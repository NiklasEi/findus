'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_BOOKMARKS,
    Key: {
      id: event.pathParameters.bookmark,
    },
    ExpressionAttributeValues: {
      ':owner': event.pathParameters.user,
    },
    ConditionExpression: 'bookmarkOwner = :owner',
  };

  // fetch bookmark from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Access-Control-Allow-Origin': process.env.ORIGIN,
          'Access-Control-Allow-Credentials': true,
          'Content-Type': "text/plain"
        },
        body: 'Couldn\'t fetch the bookmark.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ORIGIN,
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
