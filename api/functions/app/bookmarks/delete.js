"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const deleteBookmark = {
    TableName: process.env.DYNAMODB_TABLE_BOOKMARKS,
    Key: {
      id: event.pathParameters.bookmark
    },
    ExpressionAttributeValues: {
      ":owner": event.pathParameters.user
    },
    ConditionExpression: "bookmarkOwner = :owner",
    ReturnValues: "ALL_OLD"
  };

  // delete the collection from the database
  dynamoDb.delete(deleteBookmark, (error, data) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": process.env.ORIGIN,
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "text/plain"
        },
        body: "Couldn't delete the bookmark."
      });
      return;
    }

    console.log("Deleted bookmark... continuing to remove from collection")

    if (!data.Attributes || !data.Attributes.collection) {
      callback(null, {
        statusCode: 501,
        headers: {
          "Access-Control-Allow-Origin": process.env.ORIGIN,
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "text/plain"
        },
        body: "Couldn't delete the bookmark."
      });
      return;
    }

    const timestamp = new Date().getTime();
    const updateCollection = {
      TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
      Key: {
        id: data.Attributes.collection
      },
      ExpressionAttributeValues: {
        ":owner": event.pathParameters.user,
        ":updatedAt": timestamp,
        ":old": dynamoDb.createSet([event.pathParameters.bookmark])
      },
      ConditionExpression: "collectionOwner = :owner",
      UpdateExpression: "SET updatedAt = :updatedAt DELETE bookmarks :old ",
      ReturnValues: "NONE"
    };

    // update the collection in the database
    dynamoDb.update(updateCollection, (error, result) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: {
            "Access-Control-Allow-Origin": process.env.ORIGIN,
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "text/plain"
          },
          body: JSON.stringify({message: "Couldn't update the collection, but the bookmark might be deleted!."})
        });
        return;
      }

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
    });
  });
};
