import userPool from "./userPool";

async function getUser() {
  let cognitoUser = userPool.getCurrentUser();
  console.log("Resolving current user");
  if (cognitoUser) {
    let sessionPromise = new Promise((resolve, reject) => {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          reject(err);
        }
        if (session.isValid()) {
          resolve(cognitoUser);
        } else {
          reject(new Error("Session not valid"));
        }
      });
    });
    return sessionPromise;
  } else {
    console.log("No user found");
    throw new Error("No current user");
  }
}

export default getUser;
