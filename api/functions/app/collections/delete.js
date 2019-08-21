'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
    Key: {
      id: event.pathParameters.collection,
    },
    ExpressionAttributeValues: {
      ':owner': event.pathParameters.user,
    },
    ConditionExpression: 'collectionOwner = :owner',
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
          'Access-Control-Allow-Origin': process.env.ORIGIN,
          'Access-Control-Allow-Credentials': true,
          'Content-Type': "text/plain"
        },
        body: 'Couldn\'t remove the collection.',
      });
      return;
    }


    console.log("deleted...");
    console.log(data);
    if (!data.id) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": process.env.ORIGIN,
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "text/plain"
        },
        body: "Couldn't delete the collection."
      });
      return;
    }

    const updateUser = {
      TableName: process.env.DYNAMODB_TABLE_USERS,
      Key: {
        id: event.pathParameters.user
      },
      ExpressionAttributeValues: {
        ":updatedAt": timestamp,
        ":old": dynamoDb.createSet([event.pathParameters.collection])
      },
      UpdateExpression: "SET updatedAt = :updatedAt DELETE bookmarks = :old ",
      ReturnValues: "ALL_NEW"
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
          body: "Couldn't update the collection."
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
        body: JSON.stringify(result.Attributes)
      };
      callback(null, response);
    });
    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ORIGIN,
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({status: "ok"}),
    };
    callback(null, response);
  });
};
