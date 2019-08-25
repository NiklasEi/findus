import React, { Component } from "react";
import style from "../../styles/collectionDetail.module.scss";
import { NotificationManager } from "react-notifications";
import { get } from "../../utils/collectionEndpoints";
import {
  FaPen,
  FaGlobe,
  FaTrash,
  FaPlus,
  FaFrown,
  FaEraser,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { list, create, update, remove } from "../../utils/bookmarkEndpoints";

export class CollectionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [],
      newBookmark: {
        url: "",
        lable: "",
      },
      editBookmark: {
        url: "",
        lable: "",
      },
      loaded: false,
      submittingNew: false,
      submittingEdit: false
    }
    if(this.props.location.state) {
      this.state.collection = { ...this.props.location.state.collection }
    }
  }

  componentDidMount() {
    const id = this.props.id;
    if (!this.state.collection) {
      get(id)
        .then(response => {
          this.setState({ collection: response.data });
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

  newBookmark(event) {
    event.preventDefault();
    if (
      this.state.newBookmark.lable.trim().length < 1 ||
      this.state.newBookmark.url.trim().length < 1
    ) {
      NotificationManager.error(
        `Please supply a valid value for the ${
          this.state.newBookmark.lable.trim().length < 1 ? "lable" : "url"
        }`,
        "Invalid input",
        10000
      );
      return;
    }
    this.setState({ submittingNew: true });
    create(this.props.id, {
      lable: this.state.newBookmark.lable.trim(),
      url: this.state.newBookmark.url.trim(),
    })
      .then(response => {
        this.addBookmark(response.data);
        NotificationManager.info("New Bookmark created", null, 5000);
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Bookmark was not created", "Error", 20000);
        this.setState({ submittingNew: false });
      });
  }

  addBookmark(bookmark) {
    let bookmarks = [...this.state.bookmarks];
    bookmarks.push(bookmark);
    this.setState({ bookmarks: bookmarks, submittingNew: false });
  }

  startEditBookmark(id) {
    let bookmarks = [...this.state.bookmarks];
    let bookmark = bookmarks.find(bkm => bkm.id === id);
    this.setState({
      bookmarks: bookmarks.map(bookmark => {
        return {
          id: bookmark.id,
          lable: bookmark.lable,
          url: bookmark.url,
          edit: bookmark.id === id,
        };
      }),
      editBookmark: {
        url: bookmark.url,
        lable: bookmark.lable,
        id: id,
      },
    });
  }

  editBookmark(event) {
    event.preventDefault();
    if (
      this.state.editBookmark.lable.trim().length < 1 ||
      this.state.editBookmark.url.trim().length < 1
    ) {
      NotificationManager.error(
        `Please supply a valid value for the ${
          this.state.editBookmark.lable.trim().length < 1 ? "lable" : "url"
        }`,
        "Invalid input",
        10000
      );
      return;
    }
    let editedBookmark = this.state.bookmarks.find(bookmark => this.state.editBookmark.id === bookmark.id)
    if(!editedBookmark) {
      NotificationManager.error(
        `Unable to find the bookmark being edited`,
        null,
        20000
      );
      return;
    }
    if (
      this.state.editBookmark.lable.trim() === editedBookmark.lable &&
      this.state.editBookmark.url.trim() === editedBookmark.url
    ) {
      NotificationManager.info(
        `No changes were detected in the lable or url.`,
        "Nothing to update",
        10000
      );
      return;
    }
    this.setState({ submittingEdit: true });
    update(this.state.editBookmark.id, {
      lable: this.state.editBookmark.lable.trim(),
      url: this.state.editBookmark.url.trim(),
    })
      .then(response => {
        NotificationManager.info("Bookmark edited", null, 5000);
        this.setState({
          submittingEdit: false,
          // strip editing info from bookmarks and update edited Bookmark
          bookmarks: this.state.bookmarks.map(bookmark => {
            return bookmark.id === response.data.id
              ? response.data
              : {
                  id: bookmark.id,
                  lable: bookmark.lable,
                  url: bookmark.url,
                };
          }),
          editBookmark: {
            url: "",
            lable: "",
          },
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Bookmark was not changed", "Error", 20000);
        this.setState({ submittingEdit: false });
      });
  }

  deleteBookmark(id) {
    this.setState({ deleting: id });
    remove(id)
      .then(response => {
        if(!response.data || !response.data.id) throw new Error("Bookmark already deleted?")
        NotificationManager.info("Bookmark deleted", null, 5000);
        this.setState({
          bookmarks: this.state.bookmarks.filter(
            bookmark => bookmark.id !== id
          ),
          deleting: undefined,
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Bookmark was not deleted", "Error", 20000);
        this.setState({ deleting: undefined });
      });
  }

  clear(event) {
    event.preventDefault();
    this.setState({
      newBookmark: {
        url: "",
        lable: "",
      },
    });
  }

  clearEdit(event) {
    if (event) event.preventDefault();
    let bookmarks = [...this.state.bookmarks];
    this.setState({
      // strip editing info from bookmarks
      bookmarks: bookmarks.map(bookmark => {
        return {
          id: bookmark.id,
          lable: bookmark.lable,
          url: bookmark.url,
        };
      }),
      editBookmark: {
        url: "",
        lable: "",
      },
    });
  }

  changeNewBookmark(event) {
    let input = event.currentTarget;
    let newBookmark = this.state.newBookmark;
    newBookmark[input.name] = input.value;
    this.setState({ newBookmark: newBookmark });
  }

  changeEditBookmark(event) {
    let input = event.currentTarget;
    let editBookmark = this.state.editBookmark;
    editBookmark[input.name] = input.value;
    this.setState({ editBookmark: editBookmark });
  }

  render() {
    return (
      <div className={style.container}>
        <div className={style.header}>
          {this.state.collection && (
            <>
              <h3>{this.state.collection.title}</h3>
              <p>{this.state.collection.description}</p>
            </>
          )}
        </div>
        <div className={style.newBookmarkRow}>
          <p>Add a bookmark to the collection</p>
          <form onSubmit={this.newBookmark.bind(this)}>
            <input
              required
              type="text"
              placeholder="Lable"
              id="lable"
              name="lable"
              value={this.state.newBookmark.lable}
              onChange={this.changeNewBookmark.bind(this)}
            />
            <input
              required
              type="url"
              placeholder="Url"
              id="url"
              name="url"
              value={this.state.newBookmark.url}
              onChange={this.changeNewBookmark.bind(this)}
            />
            <button
              type="submit"
              title="Add bookmark"
              className="btn-success"
              disabled={this.state.submittingNew}
            >
              {this.state.submittingNew ? (
                <FaSpinner size="1.2em" className="icon-spin" />
              ) : (
                <FaPlus size="1.2em" />
              )}
            </button>
            <button
              type="none"
              onClick={this.clear.bind(this)}
              className="btn-warning"
              title="Clear input"
            >
              <FaEraser size="1.2em" />
            </button>
          </form>
        </div>
        {this.state.bookmarks.length > 0 ? (
          this.state.bookmarks.map(bookmark => {
            return bookmark.edit ? (
              <div className={style.newBookmarkRow} key={bookmark.id}>
                <form onSubmit={this.editBookmark.bind(this)}>
                  <input
                    required
                    type="text"
                    placeholder="Lable"
                    id="lable"
                    name="lable"
                    value={this.state.editBookmark.lable}
                    onChange={this.changeEditBookmark.bind(this)}
                  />
                  <input
                    required
                    type="url"
                    placeholder="Url"
                    id="url"
                    name="url"
                    value={this.state.editBookmark.url}
                    onChange={this.changeEditBookmark.bind(this)}
                  />

                  <button
                    type="submit"
                    title="Update bookmark"
                    className="btn-success"
                    disabled={this.state.submittingEdit}
                  >
                    {this.state.submittingEdit ? (
                      <FaSpinner size="1.2em" className="icon-spin" />
                    ) : (
                      <FaCheck size="1.2em" />
                    )}
                  </button>
                  <button
                    type="none"
                    onClick={this.clearEdit.bind(this)}
                    className="btn-warning"
                    title="Stop editing"
                  >
                    <FaTimes size="1.2em" />
                  </button>
                </form>
              </div>
            ) : (
              <div className={style.bookmarkRow} key={bookmark.id}>
                {/* Render the icons of the bookmarks, or the default globe icon if there is no favicon found, or no url in the bookmark */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${
                    bookmark.url ? new URL(bookmark.url).host : "example.com"
                  }`}
                  alt="favicon"
                />
                <span>{bookmark.lable}</span>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGlobe size="1.2em" />
                </a>
                <FaPen
                  size="1.2em"
                  onClick={this.startEditBookmark.bind(this, bookmark.id)}
                />
                {bookmark.id === this.state.deleting ? (
                  <FaSpinner size="1.2em" className="icon-spin" />
                ) : (
                  <FaTrash
                    size="1.2em"
                    onClick={this.deleteBookmark.bind(this, bookmark.id)}
                  />
                )}
              </div>
            );
          })
        ) : this.state.loaded ? (
          <div className={style.centeredRow}>
            <span>
              This collection is empty and very sad <FaFrown size="1.2em" />
            </span>
          </div>
        ) : (
          <div className={style.centeredRow}>
            <span>
              Loading bookmarks <FaSpinner size="1.2em" className="icon-spin" />
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default CollectionDetail;
