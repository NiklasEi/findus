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

  let newId = uuidv1();

  const newBookmark = {
    TableName: process.env.DYNAMODB_TABLE_BOOKMARKS,
    Item: {
      id: newId,
      lable: data.lable,
      url: data.url,
      bookmarkOwner: event.pathParameters.user,
      createdAt: timestamp,
      updatedAt: timestamp,
      collection: event.pathParameters.collection
    }
  };

  const updateCollection = {
    TableName: process.env.DYNAMODB_TABLE_COLLECTIONS,
    Key: {
      id: event.pathParameters.collection
    },
    ExpressionAttributeValues: {
      ":owner": event.pathParameters.user,
      ":new": dynamoDb.createSet([newId]),
      ":updatedAt": timestamp
    },
    ConditionExpression: "collectionOwner = :owner",
    UpdateExpression: "ADD bookmarks :new SET updatedAt = :updatedAt",
    ReturnValues: "NONE"
  };

  // attempt to update the user file with the new collection
  dynamoDb.update(updateCollection, (error, result) => {
    // The user might not have a file for colelctions yet
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin": process.env.ORIGIN,
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "text/plain"
        },
        body: "Couldn't find the collection."
      });
      return;
    }

    // write the bookmark to the database
    dynamoDb.put(newBookmark, error => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: {
            "Access-Control-Allow-Origin": process.env.ORIGIN,
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "text/plain"
          },
          body: "Couldn't create the bookmark."
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
        body: JSON.stringify(newBookmark.Item)
      };
      callback(null, response);
    });
  });
};
