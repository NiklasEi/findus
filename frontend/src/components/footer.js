import React, { Component } from "react";
import { FaRocket } from "react-icons/fa";
import style from "../styles/footer.module.scss"

export class Footer extends Component {
  render() {
    return (
      <footer className={style.footer}>
        <strong>Niklas</strong>
        <strong>
          Ironhack <FaRocket />
        </strong>
      </footer>
    );
  }
}

export default Footer;
