import React, { Component } from 'react';
import { userAuthrorized } from './../../utils/Common';
import AppNavbar from './../../components/Navbar/AppNavbar';
import SearchBar from "./../../components/SearchBar/SearchBar";
import {Container} from 'reactstrap';

import './../../App.css';
import "./Home.css";

import { withRouter } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div style={{ backgroundImage: "url(/background.jpg)" }} className="background">
                <AppNavbar />
                <Container >

                <div className="home"  >
                    <SearchBar placeholder="Looking for..." />
                </div>
                </Container>
            </div>
        );
    }
}
export default withRouter(Home);