"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
    Key: {
      id: event.pathParameters.collection
    },
    ExpressionAttributeValues: {
      ":owner": event.pathParameters.user
    },
    ConditionExpression: "collectionOwner = :owner",
    ReturnValues: "ALL_OLD"
  };

  // delete the collection from the database
  dynamoDb.delete(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": process.env.ORIGIN,
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "text/plain"
        },
        body: "Couldn't remove the collection."
      });
      return;
    }

    console.log("deleted...");
    console.log(data);
    if (!data.Attributes.id) {
      callback(null, {
        statusCode: 501,
        headers: {
          "Access-Control-Allow-Origin": process.env.ORIGIN,
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "text/plain"
        },
        body: "Couldn't delete the collection."
      });
      return;
    }

    console.log("Cleaning up user file and bookmarks in the background...");

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(data.Attributes)
    };
    callback(null, response);

    const timestamp = new Date().getTime();
    const updateUser = {
      TableName: process.env.DYNAMODB_TABLE_USERS,
      Key: {
        id: event.pathParameters.user
      },
      ExpressionAttributeValues: {
        ":updatedAt": timestamp,
        ":old": dynamoDb.createSet([event.pathParameters.collection])
      },
      UpdateExpression: "SET updatedAt = :updatedAt DELETE collections :old ",
      ReturnValues: "ALL_NEW"
    };

    // update the collection in the database
    dynamoDb.update(updateUser, (error, result) => {
      if (error) {
        console.error(error);
      }
    });

    if (
      !data.Attributes.bookmarks ||
      !data.Attributes.bookmarks.values ||
      data.Attributes.bookmarks.values.length < 1
    )
      return;

    const removeBookmarks = {
      RequestItems: {
        [process.env.DYNAMODB_TABLE_BOOKMARKS]: data.Attributes.bookmarks.values.map(
          id => {
            return {
              DeleteRequest: {
                Key: {
                  id: id
                }
              }
            };
          }
        )
      }
    };

    dynamoDb.batchWrite(removeBookmarks, function(error, data) {
      if (error) {
        console.error(error);
      }
    });
  });
};
