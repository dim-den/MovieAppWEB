
import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Navbar, NavbarBrand } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { removeUserSession, userAuthrorized, haveAccess } from './../../utils/Common';

class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        removeUserSession();

        this.props.history.push('/login');
    }

    render() {
        let isAuthorized = userAuthrorized();

        return <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="collapse navbar-collapse" id="navbarMobileToggle">
                <NavbarBrand tag={Link} to="/">Home</NavbarBrand>

                {haveAccess("ADMIN") ? <NavbarBrand tag={Link} to="/users">Users</NavbarBrand> : null}

                {isAuthorized ?
                    <div>
                        <NavbarBrand tag={Link} to="/films">Films</NavbarBrand>
                        <NavbarBrand tag={Link} to="/actors">Actors</NavbarBrand>
                        <NavbarBrand tag={Link} to="/filmReviews">Film reviews</NavbarBrand>
                        <NavbarBrand tag={Link} to="/filmCasts">Film casts</NavbarBrand>
                    </div>
                    : null
                }


            </div>

            {isAuthorized ?
                <div class="btn-group float-end">
                    <Button onClick={this.handleLogout} className="btn btn-dark btn-lg btn-logout">Logout</Button>
                </div>
                : null
            }

            {!isAuthorized ?
                <div>
                    <NavbarBrand tag={Link} to="/login">Login</NavbarBrand>
                    <NavbarBrand tag={Link} to="/register">Register</NavbarBrand>
                </div>
                : null
            }

        </nav>;
    }
}

export default withRouter(AppNavbar);
