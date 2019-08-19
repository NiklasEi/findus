const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const data = {
  UserPoolId: process.env.GATSBY_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.GATSBY_AWS_COGNITO_CLIENT_ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

export default userPool;
