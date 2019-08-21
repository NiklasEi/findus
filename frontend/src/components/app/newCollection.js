import React, { Component } from "react";
import { create } from "../../utils/collectionEndpoints";
import Button from "@material-ui/core/Button";
import { FaSpinner } from "react-icons/fa";
import style from "../../styles/newCollection.module.scss";
import {NotificationManager} from 'react-notifications';


export class NewCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      title: "",
      description: ""
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  }

  change(event) {
    let input = event.currentTarget;
    if (input.name !== "title" && input.name !== "description") return;
    this.setState({ [input.name]: input.value });
  }

  submit(event) {
    event.preventDefault();
    this.setState({ submitting: true });
    create({ title: this.state.title, description: this.state.description })
      .then(response => {
        console.log(response);
        this.props.addCollection(response.data);
        NotificationManager.info("New Collection created", null, 5000)
        this.setState({ submitting: false });
      })
      .catch(error => {
        NotificationManager.error("Collection was not created", "Error", 20000)
        this.setState({ submitting: false });
      });
  }

  render() {
    return (
      <div className={style.container}>
        <h4>New Collection</h4>
        <form onSubmit={this.submit} className={style.form}>
          <input
            required
            id="title"
            placeholder="Title"
            value={this.state.title || ""}
            onChange={this.change}
            name="title"
            type="text"
            disabled={this.state.submitting}
          />
          <textarea
            required
            id="description"
            placeholder="Description"
            value={this.state.description || ""}
            onChange={this.change}
            name="description"
            rows="4"
            disabled={this.state.submitting}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            {this.state.submitting ? (
              <>
                <span>Submitting&nbsp;</span>
                <FaSpinner className="icon-spin" />
              </>
            ) : (
              <span>Submit</span>
            )}
          </Button>
        </form>
      </div>
    );
  }
}

export default NewCollection;
