import React, { Component } from 'react'
import style from "../../styles/collection.module.scss"
import { FaSpinner } from "react-icons/fa";
import { get } from '../../utils/collectionEndpoints';

export class Collection extends Component {
  constructor(props) {
    super(props)
    if(!this.props.collectionId && !this.props.collection) throw new Error("Unknown collection ID in Collection component!")
    this.state = {
      collection: this.props.collection ? this.props.collection : {}
    }
  }

  componentDidMount() {
    if(this.state.collection) return;
    console.log("loading collection")
    get().then(collection => {
      this.setState({collection: collection})
    }).catch(error => {
      console.error(error)
    });
  }

  render() {
    let collection = this.state.collection;
    return collection ? (
      <div className={style.collection}>
        <p>{collection.title}</p>
        <span>{collection.bookmarks.length} bookmarks</span>
      </div>
    ) : (
      <div className="flexCenter">
        <FaSpinner className="icon-spin" />
      </div>
    )
  }
}

export default Collection
