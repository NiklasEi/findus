import buildApiUrl from "./buildApiUrl";
import getIdToken from "./auth/getIdToken";
import axios from "axios";

/**
 * Prepare an authorized axios request
 * @param {string} method The request method
 * @param {string} url The request url
 * @param {object} data The request url
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
 * Create a new collection for the user
 * @param {object} data Data to create the collection from
 */
function create(data) {
  return authorizedRequest("post", buildApiUrl(`app/user/%userId%/collections`), data);
}

/**
 * Remove a collection
 * @param {string} collectionId 
 */
function remove(collectionId) {
  return authorizedRequest("delete", buildApiUrl(`app/user/%userId%/collections/${collectionId}`));
}

/**
 * Get a specific collection
 * @param {string} collectionId 
 */
function get(collectionId) {
  return authorizedRequest("get", buildApiUrl(`app/user/%userId%/collections/${collectionId}`));
}

/**
 * Get all collections of the user
 */
function list() {
  return authorizedRequest("get", buildApiUrl(`app/user/%userId%/collections`));
}

/**
 * Update a specific collection
 * @param {string} collectionId
 * @param {object} data Data to update the collection to
 */
function update(collectionId, data) {
  return authorizedRequest("put", buildApiUrl(`app/user/%userId%/collections/${collectionId}`), data);
}

export { create, remove, get, list, update };
