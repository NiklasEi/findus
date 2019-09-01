# Findus API
*This API is deployed to AWS using serverless framework*

User authentication is done with Cognito. Three DynamoDB tables contain the users collections, collection info, and bookmarks. The API is exposed with ApiGateway and uses Lambda functions that access the DynamoDB tables and return/manipulate the data.

