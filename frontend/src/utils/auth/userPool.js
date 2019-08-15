const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const data = {
  UserPoolId: "eu-central-1_OF8Fc2jkE",
  ClientId: "48tivt3c01veld78mq1e7kh4hn",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

export default userPool;
