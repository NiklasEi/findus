import React, { Component } from "react";
import { list } from "../../utils/collectionEndpoints";
import { Link } from "gatsby";
import style from "../../styles/profile.module.scss";
import Collection from "./collection";
import NewCollection from "./newCollection";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: []
    };
  }

  componentDidMount() {
    list()
      .then(response => {
        response.data.sort((a, b) => a.title > b.title ? 1 : -1)
        this.setState({ collections: response.data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  addCollection(collection) {
    let collections = [...this.state.collections]
    collections.push(collection)
    collections.sort((a, b) => a.title > b.title ? 1 : -1)
    this.setState({ collections })
  }

  render() {
    console.log(this.state.collections);
    return (
      <div className={style.collections}>
        <NewCollection addCollection={this.addCollection.bind(this)}/>
        {this.state.collections.map(collection => {
          return (
            <div className={style.item} key={collection.id}>
              <Link
                to={"/app/collection/" + collection.id}
                state={{ collection: {...collection }}}
              ></Link>
              <Collection collection={collection} key={collection.id} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Profile;
