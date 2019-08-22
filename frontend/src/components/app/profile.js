import React, { Component } from "react";
import { list } from "../../utils/collectionEndpoints";
import { Link } from "gatsby";
import style from "../../styles/profile.module.scss";
import Collection from "./collection";
import NewCollection from "./newCollection";
import { FaSpinner } from "react-icons/fa";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      loaded: false
    };
  }

  componentDidMount() {
    list()
      .then(response => {
        response.data.sort((a, b) => (a.title > b.title ? 1 : -1));
        this.setState({ collections: response.data, loaded: true });
      })
      .catch(error => {
        console.error(error);
      });
  }

  addCollection(collection) {
    let collections = [...this.state.collections];
    collections.push(collection);
    collections.sort((a, b) => (a.title > b.title ? 1 : -1));
    this.setState({ collections });
  }

  delete(id) {
    let collections = [...this.state.collections];
    this.setState({ collections: collections.filter(collection => collection.id !== id) });
  }

  render() {
    return (
      <div className={style.container}>
        <div className={style.collections}>
          <NewCollection addCollection={this.addCollection.bind(this)} />
          {this.state.loaded ? this.state.collections.map(collection => {
            return (
              <div className={style.item} key={collection.id}>
                <Link
                  to={"/app/collection/" + collection.id}
                  state={{ collection: { ...collection } }}
                ></Link>
                <Collection collection={collection} key={collection.id} delete={this.delete.bind(this, collection.id)} />
              </div>
            );
          }) : (
            <div className={style.item}>
              <div className="flexCenter">
                <div>
                <p>Loading...</p>
                <FaSpinner size="3em" className="icon-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
