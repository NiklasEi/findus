import React, { Component } from "react";
import style from "../styles/nav.module.scss";
import userPool from "../utils/auth/userPool";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav as MatNav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

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
            this.setState({isLoggedIn: false})
          }
          return;
        }
        console.log("session validity: " + session.isValid());
        if (this.state.isLoggedIn !== session.isValid()) {
          this.setState({isLoggedIn: session.isValid()})
        }
      });
    } else {
      if (this.state.isLoggedIn) {
        this.setState({isLoggedIn: false})
      }
    }
  }

  render() {
    return (
      <Navbar className={style.nav} light expand="md">
        <NavbarBrand href="/">MySite</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <MatNav className="ml-auto" navbar>
            {this.state.isLoggedIn ? (
              <NavItem>
                <NavLink href="/auth/logout"><FaSignOutAlt/> Logout</NavLink>
              </NavItem>
            ) : (
              <>
                <NavItem>
                  <NavLink href="/auth/login"><FaSignInAlt/> Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/auth/signup"><FaUserPlus/> Signup</NavLink>
                </NavItem>
              </>
            )}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </MatNav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Nav;
