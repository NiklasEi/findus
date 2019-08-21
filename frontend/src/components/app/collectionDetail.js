import React, { Component } from "react";
import style from "../../styles/collectionDetail.module.scss";
import { list } from "../../utils/bookmarkEndpoints";
import { NotificationManager } from "react-notifications";
import { get } from "../../utils/collectionEndpoints";
import { FaPen, FaGlobe, FaTrash } from "react-icons/fa";

export class CollectionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.location.state
      ? {
          collection: { ...this.props.location.state.collection },
        }
      : {};
    this.state.bookmarks = [];
    this.state.loaded = false;
    console.log(this.state);
  }

  componentDidMount() {
    const id = this.props.id;
    if (!this.state.collection) {
      get(id)
      .then(response => {
        this.setState({collection: response.data})
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error(
          "Error while fetching bookmarks",
          null,
          20000
        );
      })
    }
    if (this.state.loaded) return;
    list(id)
      .then(result => {
        this.setState({
          bookmarks: result.data.sort((a, b) =>
            a.createdAt > b.createdAt ? 1 : -1
          ),
          loaded: true,
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error(
          "Error while fetching bookmarks",
          null,
          20000
        );
      });
  }

  editBookmark(id) {
    
  }

  deleteBookmark(id) {
    
  }

  render() {
    return (
      <div className={style.container}>
        <div className={style.header}>
          {this.state.collection && (
            <>
              <span>{this.state.collection.title}</span>
              <span>{this.state.collection.description}</span>
            </>
          )}
        </div>
        {this.state.bookmarks.map(bookmark => {
          return (
            <div className={style.row} key={bookmark.id}>
              {/* Render the icons of the bookmarks, or the default globe icon if there is no favicon found, or no url in the bookmark */}
              <img src={`https://www.google.com/s2/favicons?domain=${bookmark.url ? new URL(bookmark.url).host : "example.com"}`} alt="favicon"/>
              <span>{bookmark.lable}</span>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer"><FaGlobe size="1.2em"/></a>
              <FaPen size="1.2em" onClick={this.editBookmark.bind(this, bookmark.id)}/>
              <FaTrash size="1.2em" onClick={this.deleteBookmark.bind(this, bookmark.id)}/>
            </div>
          );
        })}
      </div>
    );
  }
}

export default CollectionDetail;
