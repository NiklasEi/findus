function buildApiUrl(endpoint) {
  return `https://${process.env.GATSBY_AWS_API_ID}.execute-api.eu-central-1.amazonaws.com/${process.env.GATSBY_STAGE}/${endpoint}`
}

export default buildApiUrl