import getUser from "./getUser";

export default new Promise(function(resolve, reject) {
  console.log("Getting ID token");
  getUser
    .then(user => {
      let session = user.getSignInUserSession();
      if (session === null) reject(new Error("No signed in user session"));
      resolve(session.getIdToken());
    })
    .catch(err => {
      reject(err);
    });
});
