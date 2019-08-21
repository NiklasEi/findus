import React, { Component } from 'react'
import style from "../../styles/collectionDetail.module.scss"
import { list } from '../../utils/bookmarkEndpoints';

export class CollectionDetail extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.location.state.collection ? {
      collection: {...this.props.location.state.collection}
    } : { }
    this.state.bookmarks = []
    this.state.loaded = false
    console.log(this.state)
  }

  componentDidMount() {
    // ToDo: load bookmarks from ID list in collection
    if(this.state.loaded) return;
  }

  render() {
    return (
      <div className={style.container}>
        <p>Id: {this.props.id}</p>
        {this.state.collection &&
          <>
            <p>{this.state.collection.title}</p>
            <p>{this.state.collection.description}</p>
          </>
        }
      </div>
    )
  }
}

export default CollectionDetail
