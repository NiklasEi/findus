"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  const collection = {
    TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
    Key: {
      id: event.pathParameters.collection
    },
    ExpressionAttributeValues: {
      ":owner": event.pathParameters.user
    },
    ConditionExpression: "collectionOwner = :owner"
  };
  // fetch collection from the database
  dynamoDb.get(collection, (error, result) => {
    if (error) {
      console.error(error);
      sendCallback(null, {
        statusCode: error.statusCode || 501,
        body: JSON.stringify({"Couldn't fetch the collection."})
      }, callback);
      return;
    }
    console.log(result);
    const params = {
      RequestItems: {
        [process.env.DYNAMODB_TABLE_BOOKMARKS]: {
          Keys: result.Item.bookmarks.values.map(bookmark => {
            return { id: bookmark };
          }),
          ExpressionAttributeValues: {
            ":owner": event.pathParameters.user
          },
          ConditionExpression: "bookmarkOwner = :owner"
        }
      }
    };
    dynamoDb.batchGet(params, (error, bookmarks) => {
      if (error) {
        console.error(error);
        sendCallback(null, {
          statusCode: error.statusCode || 501,
          body: JSON.stringify({error: "Couldn't fetch the bookmarks."})
        }, callback);
        return;
      }

      console.log(bookmarks);

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(
          bookmarks.Responses[process.env.DYNAMODB_TABLE_BOOKMARKS]
        )
      };
      sendCallback(null, response, callback);
    });
  });
};

function sendCallback(err, res, callback) {
  response.headers = {
    "Access-Control-Allow-Origin": process.env.ORIGIN,
    "Access-Control-Allow-Credentials": true
  }
  callback(err, res);
}
