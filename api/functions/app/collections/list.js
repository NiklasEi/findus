"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {
  const userFile = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: {
      id: event.pathParameters.user
    }
  };
  // fetch all todos from the database
  dynamoDb.get(userFile, (error, result) => {
    if (error) {
      console.error(error);
      // assuming the user simply does not have collections yet
      const response = {
        statusCode: 200,
        body: JSON.stringify([])
      };
      callback(null, response);
      return;
    }
    console.log(result);
    const params = {
      RequestItems: {
        [process.env.DYNAMODB_TABLE_COLLECTIONS]: {
          Keys: result.Item.collections.map(collection => {
            return {id: collection};
          }),
          ExpressionAttributeValues: {
            ":owner": event.pathParameters.user
          },
          ConditionExpression: "collectionOwner = :owner"
        }
      }
    };
    dynamoDb.batchGet(params, (error, collections) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't fetch the collections."
        });
        return;
      }

      console.log(collections);

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(collections.Responses[process.env.DYNAMODB_TABLE_COLLECTIONS])
      };
      callback(null, response);
    });
  });
};
