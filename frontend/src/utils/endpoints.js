import buildApiUrl from "./buildApiUrl";

let hello = buildApiUrl("posts/hello")

function create(userId) {
  return buildApiUrl(`app/user/${userId}/collections`)
}

export { hello, create }