import React, { Component } from "react";
import style from "../../styles/collection.module.scss";
import { FaSpinner, FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { get, update, remove } from "../../utils/collectionEndpoints";
import { NotificationManager } from "react-notifications";

export class Collection extends Component {
  constructor(props) {
    super(props);
    if (!this.props.collectionId && !this.props.collection)
      throw new Error("Unknown collection ID in Collection component!");
    this.state = {
      collection: this.props.collection ? this.props.collection : undefined,
      editing: false,
      submitting: false,
      deleting: false,
    };
  }

  componentDidMount() {
    if (this.state.collection) return;
    console.log("loading collection");
    get()
      .then(collection => {
        this.setState({ collection: collection });
      })
      .catch(error => {
        console.error(error);
      });
  }

  startEdit() {
    this.setState({
      edit: {
        title: this.state.collection.title,
        description: this.state.collection.description,
      },
      editing: true,
    });
  }

  changeEdit(event) {
    let input = event.currentTarget;
    let edit = this.state.edit;
    edit[input.name] = input.value;
    this.setState({ edit: edit });
  }

  stopEdit() {
    this.setState({
      editing: false,
    });
  }

  submitEdit(event) {
    event.preventDefault();
    if (
      this.state.edit.title.trim().length < 1 ||
      this.state.edit.description.trim().length < 1
    ) {
      NotificationManager.error(
        `Please supply a valid value for the ${
          this.state.edit.title.trim().length < 1 ? "title" : "description"
        }`,
        "Invalid input",
        10000
      );
      return;
    }
    this.setState({ submitting: true });
    update(this.state.collection.id, {
      title: this.state.edit.title.trim(),
      description: this.state.edit.description.trim(),
    })
      .then(response => {
        console.log(response);
        NotificationManager.info("Collection edited", null, 5000);
        this.setState({
          submitting: false,
          editing: false,
          collection: response.data,
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Collection was not changed", "Error", 20000);
        this.setState({ submitting: false });
      });
  }

  delete() {
    this.setState({ deleting: true });
    remove(this.state.collection.id)
      .then(response => {
        if (!response.data || !response.data.id)
          throw new Error("Collection already deleted?");
        NotificationManager.info("Collection deleted", null, 5000);
        this.props.delete();
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Collection was not deleted", "Error", 20000);
        this.setState({ deleting: false });
      });
  }

  render() {
    let collection = this.state.collection;
    return collection ? (
      this.state.editing ? (
        <div className={style.collection}>
          <form onSubmit={this.submitEdit.bind(this)}>
            <input
              onChange={this.changeEdit.bind(this)}
              type="text"
              value={this.state.edit.title}
              placeholder="Title"
              name="title"
            />
            <textarea
              onChange={this.changeEdit.bind(this)}
              name="description"
              id="description"
              value={this.state.edit.description}
              rows="10"
            ></textarea>
            <button
              type="submit"
              title="Update collection"
              className="btn-success"
              disabled={this.state.submitting}
            >
              {this.state.submitting ? (
                <span>
                  Updating&nbsp;
                  <FaSpinner size="1.2em" className="icon-spin" />
                </span>
              ) : (
                <span>
                  Submit&nbsp;
                  <FaCheck size="1.2em" />
                </span>
              )}
            </button>
            <button
              type="none"
              onClick={this.stopEdit.bind(this)}
              className="btn-warning"
              title="Stop editing"
            >
              <span>
                Cancel&nbsp;
                <FaTimes size="1.2em" />
              </span>
            </button>
          </form>
        </div>
      ) : (
        <div className={style.collection}>
          <h4 className={style.title}>{collection.title}</h4>
          <p>{collection.description}</p>
          <div className={style.footer}>
            <div className={style.icon} onClick={this.startEdit.bind(this)}>
              <FaPen size="1.2em" />
            </div>
            <span>
              {collection.bookmarks ? collection.bookmarks.length : "0"} entries
            </span>
            <div className={style.icon} onClick={this.delete.bind(this)}>
              {this.state.deleting ? (
                <FaSpinner size="1.2em" className="icon-spin" />
              ) : (
                <FaTrash size="1.2em" />
              )}
            </div>
          </div>
        </div>
      )
    ) : (
      <div className="flexCenter">
        <FaSpinner className="icon-spin" />
      </div>
    );
  }
}

export default Collection;
