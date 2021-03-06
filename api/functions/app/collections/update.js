'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.title !== 'string' || typeof data.description !== "string") {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': process.env.ORIGIN,
        'Access-Control-Allow-Credentials': true,
        'Content-Type': "text/plain"
      },
      body: 'Couldn\'t update the collection.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
    Key: {
      id: event.pathParameters.collection,
    },
    ExpressionAttributeValues: {
      ':owner': event.pathParameters.user,
      ':title': data.title,
      ':description': data.description,
      ':updatedAt': timestamp,
    },
    ConditionExpression: 'collectionOwner = :owner',
    UpdateExpression: 'SET title = :title, description = :description, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the collection in the database
  dynamoDb.update(params, (error, result) => {
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
        body: 'Couldn\'t update the collection.',
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
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
