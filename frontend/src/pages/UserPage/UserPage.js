import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../../components/Navbar/AppNavbar';
import { getToken, makeTokenizedRequest, getEmail, userAuthrorized, getUserId } from '../../utils/Common';
import Rating from '@mui/material/Rating';
import Card from 'react-bootstrap/Card'
import "./UserPage.css";
import './../../App.css';

class UserPage extends Component {

    emptyUser = {
        id: 0,
        email: '',
        name: '',
        password: '',
        role: '',
        birthday: null
    };

    constructor(props) {
        super(props);
        this.state = {
            user: this.emptyUser,
            filmReviews: null,
            avgFilmScore: 0.0,
            error: null
        };

        this.calculate_age = this.calculate_age.bind(this);
    }

    async componentDidMount() {
        const user = await (await makeTokenizedRequest(`/api/user/${getUserId()}`)).data;
        console.log(user);

        if (user) {
            const avgFilmScore = await (await makeTokenizedRequest(`/api/filmReview/userAvgScore/${user.id}`)).data.score;
            const filmReviews = await (await makeTokenizedRequest(`/api/filmReview/user/${user.id}`)).data;

            for (let i = 0; i < filmReviews.length; i++) {
                filmReviews[i].film = await (await makeTokenizedRequest(`/api/film/${filmReviews[i].filmId}`)).data;
                console.log(filmReviews[i].film)
            }

            this.setState({ filmReviews, user, avgFilmScore });
        }  
        else {
            this.setState({ error: "Not enough rights" });
        }  
    }

    calculate_age(date) {
        var diff_ms = Date.now() - (new Date(date)).getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    render() {
        const { error, user, filmReviews, avgFilmScore } = this.state;

        let filmReviewsList = null;

        if (filmReviews) {
            filmReviewsList = filmReviews.map(filmReview => {
                
                let path = "/film/" + filmReview.film.id;

                return <Card border="secondary" className='mt-3' style={{ width: '30rem' }}>
                    <Card.Header>
                        <div class="d-flex justify-content-between">
                            <a className='a-film-link' href={path}>
                                <big className="text-dark">{filmReview.film.title} ({filmReview.film.release.substring(0, 4)})</big >
                            </a>
                            <br/>
                            <p>Score: {filmReview.score}</p>
                        </div>
                    </Card.Header>
                </Card>;
            })
        };

        return (
            <div style={{ backgroundImage: "url(/background.jpg)" }} className="background">
                <AppNavbar />
                <Container>
                    {user ?
                        <div className='info-block'>
                            <div>
                                <h1>{user.name}</h1>
                                <p className='p-model'> <strong>Email:</strong> {user.email}</p>
                                <p className='p-model'> <strong>Birthday:</strong> {user.birthday ? <span> {user.birthday.substring(0, 10)} ({this.calculate_age(user.birthday)} years) </span> : "not setted"} </p>
                                <p className='p-model'> <strong>Role:</strong> {user.role}</p>
                                <p className='p-model'> <strong>Average user film score:</strong> {avgFilmScore ? avgFilmScore : "no scores yet"}</p>

                                {/* <p className='p-model'> <strong>Birthday:</strong> {user.birthday ? user.birthday.substring(0, 10) : null} ({this.calculate_age(user.birthday)} years)</p> */}
                            </div>
                           
                            {filmReviewsList && filmReviewsList.length > 0 ?
                                <div>
                                     <h2>User rated films ({filmReviewsList.length}):</h2>
                                    {filmReviewsList}
                                </div>
                                :
                                <h5>No film reviews found</h5>
                            }
                        </div>
                        : <h2>{error}</h2>

                    }
                </Container >

            </div>
        );
    }

}
export default withRouter(UserPage);