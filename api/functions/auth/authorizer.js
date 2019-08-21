var https = require("https");
var jose = require("node-jose");

var region = process.env.MY_AWS_REGION;
var userpool_id = process.env.AWS_COGNITO_USER_POOL_ID;
var app_client_id = process.env.AWS_COGNITO_CLIENT_ID;
var keys_url =
  "https://cognito-idp." +
  region +
  ".amazonaws.com/" +
  userpool_id +
  "/.well-known/jwks.json";

module.exports.authorizer = (event, context, callback) => {
  // console.log(event);
  var token = event.authorizationToken.replace(/^Bearer\s/, "");
  // console.log(token);
  var sections = token.split(".");
  // get the kid from the headers prior to verification
  var header = jose.util.base64url.decode(sections[0]);
  try {
    header = JSON.parse(header);
  } catch (error) {
    console.log("Can't parse token header");
    callback(null, policy(token, event.methodArn, false, "Invalid Token"));
    return;
  }
  var kid = header.kid;
  // download the public keys
  https.get(keys_url, function(response) {
    if (response.statusCode !== 200) {
      console.log("Unable to load the public keys");
      callback(
        null,
        policy(token, event.methodArn, false, "Unable to load the public keys")
      );
      return;
    }
    response.on("data", function(body) {
      var keys;
      try {
        keys = JSON.parse(body)["keys"];
      } catch (error) {
        console.log("Can't parse keys");
        callback(null, policy(token, event.methodArn, false, "Invalid keys response"));
        return;
      }
      // search for the kid in the downloaded public keys
      // console.log("search for the kid in the downloaded public keys");
      var key_index = -1;
      for (var i = 0; i < keys.length; i++) {
        if (kid == keys[i].kid) {
          key_index = i;
          break;
        }
      }
      if (key_index == -1) {
        console.log("Public key not found in jwks.json");
        callback(
          null,
          policy(
            token,
            event.methodArn,
            false,
            "Public key not found in jwks.json"
          )
        );
        return;
      }
      // construct the public key
      // console.log("construct the public key");
      jose.JWK.asKey(keys[key_index]).then(function(result) {
        // verify the signature
        // console.log("verify the signature");
        jose.JWS.createVerify(result)
          .verify(token)
          .then(function(result) {
            // now we can use the claims
            // console.log("now we can use the claims");
            var claims = JSON.parse(result.payload);
            // additionally we can verify the token expiration
            // console.log("additionally we can verify the token expiration");
            var current_ts = Math.floor(new Date() / 1000);
            if (current_ts > claims.exp) {
              console.log("Token expired");
              callback(
                null,
                policy(token, event.methodArn, false, "Token expired")
              );
              return;
            }
            // and the Audience (use claims.client_id if verifying an access token)
            // console.log("and the Audience");
            if (claims.aud != app_client_id) {
              console.log("Wrong audience");
              callback(
                null,
                policy(token, event.methodArn, false, "Wrong audience")
              );
              return;
            }
            callback(null, policy(token, claims.sub, true));
          })
          .catch(function(error) {
            console.log(JSON.stringify(error));
            callback(
              null,
              policy(token, event.methodArn, false, JSON.stringify(error))
            );
          });
      });
    });
  });
};

// the policies are cached with the principalId as key
// I am using the token as ID, hence I have to Deny/Allow access for all user paths
function policy(principalId, userOrArn, allow, errorMessage) {
  let response = {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: allow ? "Allow" : "Deny",
          // deny access to specified arn in the case the token cannot even be read (no user sub jet)
          Resource: /^arn:/.test(userOrArn) ? userOrArn : `arn:aws:execute-api:${region}:406011587132:${process.env.AWS_GATEWAY_API_ID}/${process.env.AWS_STAGE}/*/app/user/${userOrArn}/collections`
        },
        {
          Action: "execute-api:Invoke",
          Effect: allow ? "Allow" : "Deny",
          Resource: /^arn:/.test(userOrArn) ? userOrArn : `arn:aws:execute-api:${region}:406011587132:${process.env.AWS_GATEWAY_API_ID}/${process.env.AWS_STAGE}/*/app/user/${userOrArn}/collections/*`
        },
        {
          Action: "execute-api:Invoke",
          Effect: allow ? "Allow" : "Deny",
          Resource: /^arn:/.test(userOrArn) ? userOrArn : `arn:aws:execute-api:${region}:406011587132:${process.env.AWS_GATEWAY_API_ID}/${process.env.AWS_STAGE}/*/app/user/${userOrArn}/collections/*/bookmarks`
        },
        {
          Action: "execute-api:Invoke",
          Effect: allow ? "Allow" : "Deny",
          Resource: /^arn:/.test(userOrArn) ? userOrArn : `arn:aws:execute-api:${region}:406011587132:${process.env.AWS_GATEWAY_API_ID}/${process.env.AWS_STAGE}/*/app/user/${userOrArn}/bookmarks/*`
        }
      ]
    },
    context: {}
  };
  if (errorMessage) {
    response.context.errorMessage = errorMessage;
  }
  console.log("returning: ");
  console.log(JSON.stringify(response, null, 2));
  return response;
}
