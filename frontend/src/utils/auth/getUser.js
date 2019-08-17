import userPool from "./userPool";

var cognitoUser = userPool.getCurrentUser();

export default new Promise(function(resolve, reject) {
  console.log("Resolving current user")
  if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
      if (err) {
        reject(err);
        return;
      }
      if (session.isValid()) {
        resolve(cognitoUser);
      } else {
        reject(new Error("Session not valid"));
      }
    });
  }
});
