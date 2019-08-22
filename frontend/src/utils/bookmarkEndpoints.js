import buildApiUrl from "./buildApiUrl";
import getIdToken from "./auth/getIdToken";
import axios from "axios";

/**
 * Prepare an authorized axios request
 * @param {string} method The request method
 * @param {string} url The request url
 * @param {object} data data to send
 */
function authorizedRequest(method, url, data) {
  return getIdToken().then(token => {
    let options = {
      url: url.replace("%userId%", token.payload.sub),
      method: method,
      withCredentials: true,
      headers: { Authorization: "Bearer " + token.getJwtToken() }
    }
    if (data) options.data = data;
    return axios(options);
  });
}

/**
 * Create a new bookmark in a specific collection
 * @param {string} collectionId 
 * @param {object} data new bookmark
 */
function create(collectionId, data) {
  return authorizedRequest("post", buildApiUrl(`app/user/%userId%/collections/${collectionId}/bookmarks`), data);
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
 * @param {object} data new bookmark
 */
function update(bookmarkId, data) {
  return authorizedRequest("put", buildApiUrl(`app/user/%userId%/bookmarks/${bookmarkId}`), data);
}

export { create, remove, get, list, update };
