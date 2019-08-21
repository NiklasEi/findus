"use strict";

const uuidv1 = require("uuid/v1");
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.apiVersions = {
  dynamodb: "2012-08-10"
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.title !== "string" || typeof data.description !== "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': process.env.ORIGIN,
        'Access-Control-Allow-Credentials': true,
        'Content-Type': "text/plain"
      },
      body: "Couldn't create the collection."
    });
    return;
  }

  let newId = uuidv1();

  const newCollection = {
    TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
    Item: {
      id: newId,
      title: data.title,
      description: data.description,
      collectionOwner: event.pathParameters.user,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  const updateUser = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: {
      id: event.pathParameters.user
    },
    ExpressionAttributeValues: {
      ":new": dynamoDb.createSet([newId]),
      ":updatedAt": timestamp
    },
    UpdateExpression: "ADD collections :new SET updatedAt = :updatedAt",
    ReturnValues: "NONE"
  };

  const newUser = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Item: {
      id: event.pathParameters.user,
      createdAt: timestamp,
      updatedAt: timestamp,
      collections: dynamoDb.createSet([newId])
    }
  };

  /**
   * ToDo: could allow for creating a collection with existing bookmarks
   * 
  if(Object.prototype.toString.call(data.bookmarks) === '[object Array]') {
    for (let bookmark of data.bookmarks) {

    }
  }
   */

  // attempt to update the user file with the new collection
  dynamoDb.update(updateUser, (error, result) => {
    // The user might not have a file for colelctions yet
    if (error) {
      console.error(error);
      console.error("probably no userfile yet... attempting to create a new one");
      dynamoDb.put(newUser, error => {
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: {
              'Access-Control-Allow-Origin': process.env.ORIGIN,
              'Access-Control-Allow-Credentials': true,
              'Content-Type': "text/plain"
            },
            body: "Failed to add the collection to the user."
          });
          return;
        }
        // write the collection to the database
        dynamoDb.put(newCollection, error => {
          if (error) {
            console.error(error);
            callback(null, {
              statusCode: error.statusCode || 501,
              headers: {
                'Access-Control-Allow-Origin': process.env.ORIGIN,
                'Access-Control-Allow-Credentials': true,
                'Content-Type': "text/plain"
              },
              body: "Couldn't create the collection."
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
            body: JSON.stringify(newCollection.Item)
          };
          callback(null, response);
        });
      });
      return;
    }

    // write the collection to the database
    dynamoDb.put(newCollection, error => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: {
            'Access-Control-Allow-Origin': process.env.ORIGIN,
            'Access-Control-Allow-Credentials': true,
            'Content-Type': "text/plain"
          },
          body: "Couldn't create the collection."
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
        body: JSON.stringify(newCollection.Item)
      };
      callback(null, response);
    });
  });
};
