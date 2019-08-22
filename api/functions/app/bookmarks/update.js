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
  if (typeof data.lable !== "string" || typeof data.url !== "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN,
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "text/plain"
      },
      body: "Couldn't create the collection."
    });
    return;
  }

  const updateBookmark = {
    TableName: process.env.DYNAMODB_TABLE_BOOKMARKS,
    Key: {
      id: event.pathParameters.bookmark,
    },
    ExpressionAttributeNames: {'#url' : 'url'},
    ExpressionAttributeValues: {
      ':owner': event.pathParameters.user,
      ':lable': data.lable,
      ':url': data.url,
      ':updatedAt': timestamp,
    },
    ConditionExpression: 'bookmarkOwner = :owner',
    UpdateExpression: 'SET lable = :lable, #url = :url, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the collection in the database
  dynamoDb.update(updateBookmark, (error, result) => {
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
        body: 'Couldn\'t update the bookmark.',
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
