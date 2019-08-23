import React, { Component } from "react";
import style from "../styles/nav.module.scss";
import userPool from "../utils/auth/userPool";
import { Link } from "gatsby";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav as MatNav,
  NavItem,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
} from "reactstrap";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBookmark, FaUser } from "react-icons/fa";

export class Nav extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      isLoggedIn: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  componentDidMount() {
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log(err);
          if (this.state.isLoggedIn) {
            this.setState({ isLoggedIn: false });
          }
          return;
        }
        console.log("session validity: " + session.isValid());
        if (this.state.isLoggedIn !== session.isValid()) {
          this.setState({ isLoggedIn: session.isValid() });
        }
      });
    } else {
      if (this.state.isLoggedIn) {
        this.setState({ isLoggedIn: false });
      }
    }
  }

  render() {
    return (
      <Navbar className={style.nav} light expand="md">
        <Link to="/" className="navbar-brand"><img src="/images/favicon/40x40.png" alt="icon"/>Findus</Link>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <MatNav className="ml-auto" navbar>
            {this.state.isLoggedIn ? (
              <>
                <NavItem>
                  <Link to="/auth/logout" className="nav-link">
                    <FaSignOutAlt /> Logout
                  </Link>
                </NavItem>
              <NavItem>
                <Link to="/app/profile" className="nav-link">
                  <FaUser /> Profile
                </Link>
              </NavItem>
              <NavItem>
                <Link to="/app/collection" className="nav-link">
                  <FaBookmark /> Collection
                </Link>
              </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <Link to="/auth/login" className="nav-link">
                    <FaSignInAlt /> Login
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/auth/signup" className="nav-link">
                    <FaUserPlus /> Signup
                  </Link>
                </NavItem>
              </>
            )}
            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </MatNav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Nav;
