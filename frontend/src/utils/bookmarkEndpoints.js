import buildApiUrl from "./buildApiUrl";
import getIdToken from "./auth/getIdToken";
import axios from "axios";

/**
 * Prepare an authorized axios request
 * @param {string} method The request method
 * @param {string} url The request url
 */
function authorizedRequest(method, url) {
  return getIdToken().then(token => {
    return axios({
      url: url.replace("%userId%", token.payload.sub),
      method: method,
      withCredentials: true,
      headers: { Authorization: "Bearer " + token.getJwtToken() }
    });
  });
}

/**
 * Create a new bookmark in a specific collection
 * @param {string} collectionId 
 */
function create(collectionId) {
  return authorizedRequest("post", buildApiUrl(`app/user/%userId%/collections/${collectionId}/bookmarks`));
}

/**
 * Remove a bookmark
 * @param {string} bookmarkId 
 */
function remove(bookmarkId) {
  return authorizedRequest("delete", buildApiUrl(`app/user/%userId%/bookmarks/${bookmarkId}`));
}

/**
 * Get a specific bookmark
 * @param {string} bookmarkId 
 */
function get(bookmarkId) {
  return authorizedRequest("get", buildApiUrl(`app/user/%userId%/bookmarks/${bookmarkId}`));
}

/**
 * Get all bookmarks of a collection
 * @param {string} collectionId 
 */
function list(collectionId) {
  return authorizedRequest("get", buildApiUrl(`app/user/%userId%/collections/${collectionId}/bookmarks`));
}

/**
 * Update a specific bookmark
 * @param {string} bookmarkId 
 */
function update(bookmarkId) {
  return authorizedRequest("put", buildApiUrl(`app/user/%userId%/bookmarks/${bookmarkId}`));
}

export { create, remove, get, list, update };
