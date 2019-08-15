import React, { Component } from 'react'
import Layout from "../../layouts/index"
import ConfirmEmail from '../../components/auth/confirmEmail';

export class Confirm extends Component {


  render() {
    return (
      <Layout>
        <ConfirmEmail/>
      </Layout>
    )
  }
}

export default Confirm
