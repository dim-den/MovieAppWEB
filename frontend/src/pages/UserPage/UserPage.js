import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, Label, Table } from 'reactstrap';
import AppNavbar from '../../components/Navbar/AppNavbar';
import { makeTokenizedRequest, getUserId, makeTokenizedFormDataRequest } from '../../utils/Common';
import Card from 'react-bootstrap/Card'
import { Image } from 'react-native'

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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }

    async componentDidMount() {
        const user = await (await makeTokenizedRequest(`/api/user/${getUserId()}`)).data;

        if (user) {
            const avgFilmScore = await (await makeTokenizedRequest(`/api/filmReview/userAvgScore/${user.id}`)).data.score;
            const filmReviews = await (await makeTokenizedRequest(`/api/filmReview/user/${user.id}`)).data;

            for (let i = 0; i < filmReviews.length; i++) {
                filmReviews[i].film = await (await makeTokenizedRequest(`/api/film/${filmReviews[i].filmId}`)).data;
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

    async handleSubmit(event) {
        event.preventDefault();
        if (this.input.current.files[0]) {
            const formData = new FormData();
            formData.append("file", this.input.current.files[0]);

            await makeTokenizedFormDataRequest('/api/user/upload', formData)
                .then(response => {
                    console.log('123');
                    window.location.reload()
                })
                .catch(error => {
                    this.setState({ error: error.message });
                });
        }
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
                            <br />
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
                                <Table className="mt-4">
                                    <tr>
                                        <th width="65%">
                                            <h1>{user.name}</h1>
                                        </th>
                                        <th width="45%">
                                            <Image
                                                source={{
                                                    uri: user.imageUrl ? user.imageUrl : "/default-user-image.jpg"
                                                }}
                                                style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
                                            /></th>
                                    </tr>
                                </Table>

                                <p className='p-model'> <strong>Email:</strong> {user.email}</p>
                                <p className='p-model'> <strong>Birthday:</strong> {user.birthday ? <span> {user.birthday.substring(0, 10)} ({this.calculate_age(user.birthday)} years) </span> : "not setted"} </p>
                                <p className='p-model'> <strong>Average user film score:</strong> {avgFilmScore ? avgFilmScore : "no scores yet"}</p>

                                {/* <p className='p-model'> <strong>Birthday:</strong> {user.birthday ? user.birthday.substring(0, 10) : null} ({this.calculate_age(user.birthday)} years)</p> */}
                            </div>

                            <Form onSubmit={this.handleSubmit} method="POST" encType="multipart/form-data" >
                                <Label for="upload"></Label>
                                <input type="file" accept=".png, .jpg" ref={this.input} name="upload" id="upload" placeholder='upload-image-file' />
                                <small id="fileHelpId" class="form-text text-muted">Please select the avatar to be uploaded...</small>

                                <button type="submit" class="btn btn-secondary" value="Upload">Upload</button>
                            </Form>

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