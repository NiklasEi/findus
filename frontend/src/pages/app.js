import React from "react"
import { Router } from "@reach/router"
import Layout from "../layouts/index";
import Profile from "../components/app/profile"
import Collection from "../components/app/collection"
import UserRoute from "../utils/userRoute"

const App = () => (
  <Layout>
    <Router>
      <UserRoute path="/app/profile" component={Profile} />
      <UserRoute path="/app/collection" component={Collection} />
    </Router>
  </Layout>
)
export default App