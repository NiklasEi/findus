import axios from "axios";

function favicon(url) {
  return axios({
    method: "get",
    url: "https://www.google.com/s2/favicons",
    params: {
      domain: new URL(url).host
    }
  })
}

export default favicon