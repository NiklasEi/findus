const ALLOWED_ORIGINS = [
	'http://localhost:8000',
	'https://mysecondorigin.com'
];

module.exports.hello = (event, context, callback) => {
  //const origin = (event.headers && event.headers !== null) ? event.headers.origin : "http://localhost:8000";
  let headers;
  //if (ALLOWED_ORIGINS.includes(origin)) {
    headers = {
      'Access-Control-Allow-Origin': 'http://localhost:8000',
      'Access-Control-Allow-Credentials': true
    }
  // } else {
  //     headers = {
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // }

  callback(null, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        //input: event,
        hi: " Du Ei",
        loggedIn: true
      },
      null,
      2
    )
  })
}