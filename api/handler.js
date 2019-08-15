"use strict";

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
        hi: " Du Ei",
      },
      null,
      2
    ),
  };
};

module.exports.preSignUp = async (event, context, callback) => {
  event.response.autoConfirmUser = true;
  callback(null, event);
};
