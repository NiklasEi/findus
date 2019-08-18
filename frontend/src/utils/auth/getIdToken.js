import getUser from "./getUser";

async function getIdToken() {
  let user;
  try {
    user = await getUser();
  } catch (err) {
    throw err;
  }
  if (user) {
    let session = user.getSignInUserSession();
    if (session === null) throw new Error("No signed in user session");
    else return session.getIdToken();
  } else {
    throw new Error("No current user");
  }
}

export default getIdToken
