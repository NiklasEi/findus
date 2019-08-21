import React from "react"
import { Router } from "@reach/router"
import Layout from "../layouts/index";
import Profile from "../components/app/profile"
import CollectionDetail from "../components/app/collectionDetail"
import UserRoute from "../utils/userRoute"

const App = () => (
  <Layout>
    <Router>
      <UserRoute path="/app/profile" component={Profile} />
      <UserRoute path="/app/collection/:id" component={CollectionDetail} />
    </Router>
  </Layout>
)
export default App