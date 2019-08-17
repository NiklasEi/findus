module.exports.authorizer = (event, context, callback) => {
  callback(null, {
    principalId: "*",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: event.methodArn
        }
      ]
    }
  });
};

// var https = require("https");
// // var jose = require("node-jose");

// var jwt = require("jsonwebtoken");
// var jwkToPem = require("jwk-to-pem");

// var region = process.env.MY_AWS_REGION;
// var userpool_id = process.env.AWS_COGNITO_USER_POOL_ID;
// var app_client_id = process.env.AWS_COGNITO_CLIENT_ID;
// var keys_url =
//   "https://cognito-idp." +
//   region +
//   ".amazonaws.com/" +
//   userpool_id +
//   "/.well-known/jwks.json";

// module.exports.authorizer = (event, context, callback) => {
//   //   var token = event.authorizationToken//.replace(/^(Bearer\s\.)/,"");
//   //   console.log(token)
//   //   var sections = token.split(".");
//   //   // get the kid from the headers prior to verification
//   //   var header = jose.util.base64url.decode(sections[0]);
//   //   console.log(header)
//   //   header = JSON.parse(header);
//   //   var kid = header.kid;
//   var pem = jwkToPem(jwk);
//   jwt.verify(token, pem, { algorithms: ["RS256"] }, function(
//     err,
//     decodedToken
//   ) {
//       let kid = "";
//     console.log(err)
//     console.log(decodedToken)
//     // download the public keys
//     https.get(keys_url, function(response) {
//       if (response.statusCode == 200) {
//         response.on("data", function(body) {
//           var keys = JSON.parse(body)["keys"];
//           // search for the kid in the downloaded public keys
//           var key_index = -1;
//           for (var i = 0; i < keys.length; i++) {
//             if (kid == keys[i].kid) {
//               key_index = i;
//               break;
//             }
//           }
//           if (key_index == -1) {
//             console.log("Public key not found in jwks.json");
//             callback("Public key not found in jwks.json");
//           }
//           // construct the public key
//           jose.JWK.asKey(keys[key_index]).then(function(result) {
//             // verify the signature
//             console.log("verify the signature");
//             jose.JWS.createVerify(result)
//               .verify(token)
//               .then(function(result) {
//                 console.log("check date and audience");
//                 // now we can use the claims
//                 var claims = JSON.parse(result.payload);
//                 // additionally we can verify the token expiration
//                 var current_ts = Math.floor(new Date() / 1000);
//                 if (current_ts > claims.exp) {
//                   callback("Token is expired");
//                 }
//                 // and the Audience (use claims.client_id if verifying an access token)
//                 if (claims.aud != app_client_id) {
//                   callback("Token was not issued for this audience");
//                 }
//                 console.log("all fine!");
//                 console.log(
//                   "Answering: " +
//                     JSON.stringify({
//                       principalId: "*",
//                       policyDocument: {
//                         Version: "2012-10-17",
//                         Statement: [
//                           {
//                             Action: "execute-api:Invoke",
//                             Effect: "Allow",
//                             Resource: event.methodArn
//                           }
//                         ]
//                       }
//                     })
//                 );
//                 callback(null, {
//                   principalId: "*",
//                   policyDocument: {
//                     Version: "2012-10-17",
//                     Statement: [
//                       {
//                         Action: "execute-api:Invoke",
//                         Effect: "Allow",
//                         Resource: event.methodArn
//                       }
//                     ]
//                   }
//                 });
//                 callback(null, claims);
//               })
//               .catch(function() {
//                 callback("Signature verification failed");
//               });
//           });
//         });
//       }
//     });
//   });
// };

// // Help function to generate an IAM policy
// var generatePolicy = function(principalId, effect, resource) {
//     var authResponse = {};

//     authResponse.principalId = principalId;
//     if (effect && resource) {
//         var policyDocument = {};
//         policyDocument.Version = '2012-10-17';
//         policyDocument.Statement = [];
//         var statementOne = {};
//         statementOne.Action = 'execute-api:Invoke';
//         statementOne.Effect = effect;
//         statementOne.Resource = resource;
//         policyDocument.Statement[0] = statementOne;
//         authResponse.policyDocument = policyDocument;
//     }

//     return authResponse;
// }
