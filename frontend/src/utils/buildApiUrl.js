function buildApiUrl(endpoint) {
  return `https://${process.env.GATSBY_AWS_API_ID}.execute-api.${process.env.GATSBY_AWS_REGION}.amazonaws.com/${process.env.GATSBY_STAGE}/${endpoint}`
}

export default buildApiUrl