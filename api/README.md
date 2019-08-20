# Findus API
*This API is deployed to AWS using serverless framework*

User authentication is done with Cognito. Two DynamoDB tables contain the collections and bookmarks of the users. The API is exposed with ApiGateway and calls Lambda functions that can then access the data and return/manipulate it.

