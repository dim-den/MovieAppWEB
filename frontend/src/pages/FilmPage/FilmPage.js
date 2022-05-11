import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { getToken, makeTokenizedRequest, getEmail, userAuthrorized } from './../../utils/Common';
import Rating from '@mui/material/Rating';
import Card from 'react-bootstrap/Card'
import "./FilmPage.css";

class FilmPage extends Component {

    emptyFilm = {
        id: 0,
        title: '',
        genre: '',
        description: '',
        director: '',
        country: '',
        release: null,
        budget: 0,
        fees: 0,
        avgScore: 0.0
    };

    emptyUser = {
        id: 0,
        username: '',
        email: ''
    }

    emptyUserReview = {
        review: '',
        score: null,
        published: null,
        userId: 0,
        filmId: 0,
        user: this.emptyUser
    };

    constructor(props) {
        super(props);
        this.state = {
            film: this.emptyFilm,
            userReview: this.emptyUserReview,
            reviews: null,
            currentUser: null,
            error: null
        };
        this.handleChangeScore = this.handleChangeScore.bind(this);
    }

    async componentDidMount() {
        const film = await (await makeTokenizedRequest(`/api/film?title=${this.props.match.params.title}`)).data[0];
        if (film) {
            film.genre = await (await makeTokenizedRequest(`/api/filmGenres?filmId=${film.id}`)).data;
            film.avgScore = await (await makeTokenizedRequest(`/api/filmReviews/score?filmId=${film.id}`)).data;
            if (film.avgScore) film.avgScore = film.avgScore.toFixed(2)
            else film.avgScore = "No scores";

            const reviews = await (await makeTokenizedRequest(`/api/filmReviews?filmId=${film.id}`)).data;

            for (let i = 0; i < reviews.length; i++) {
                reviews[i].user = await (await makeTokenizedRequest(`/api/user/${reviews[i].userId}`)).data;
            }
            this.setState({ film, reviews });
        }


        const currentUser = await (await makeTokenizedRequest(`/api/user?email=${getEmail()}`)).data;
        this.setState({ currentUser });

        if (film && userAuthrorized) {
            const userReview = await (await makeTokenizedRequest(`/api/filmReview?filmId=${film.id}&userId=${currentUser.id}`)).data;
            this.setState({ userReview: userReview });
        }
    }

    async handleChangeScore(event, newValue) {
        const { userReview, currentUser, film } = this.state;

        const newReview = {
            review: '',
            score: newValue,
            published: new Date(),
            userId: currentUser.id,
            filmId: film.id
        };

        await makeTokenizedRequest('/api/filmReview/leaveScore', 'POST', JSON.stringify(newReview))
            .then(response => {
                userReview.score = newValue;
                this.setState({ userReview });
            })
            .catch(error => {
                this.setState({ error: "An error occurred while leaving a score" });
            });

        film.avgScore = await (await makeTokenizedRequest(`/api/filmReviews/score?filmId=${film.id}`)).data.toFixed(2);
        this.setState({film});
    }


    render() {
        const { userReview, film, reviews } = this.state;
        const score = userReview.score ? userReview.score : 0;

        let reviewsList = null;

        if (reviews) {
            reviewsList = reviews.map(review => {
                let header = `Username: ${review.user.username}`;
                let footer = `User score: ${review.score}`;

                return <Card border="secondary" className='mt-3' style={{ width: '40rem' }}>
                    <Card.Header>
                        <div class="d-flex justify-content-between">
                            <div>
                                <big className="text-dark">{header}</big >
                            </div>
                            <div>
                                <big className="text-dark">Published: {review.published.substring(0, 10)}</big >
                            </div>
                        </div>


                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {review.review}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <div className="text-muted">{footer}</div>
                    </Card.Footer>
                </Card>;
            })
        };

        return (
            <div>
                <AppNavbar />
                <Container>
                    {film.title ?
                        <div>
                            <div>
                                <h1>{film.title}</h1>
                                <p className='p-model'> <strong>Description:</strong> {film.description}</p>
                                <p className='p-model'> <strong>Director:</strong> {film.director}</p>
                                <p className='p-model'> <strong>Genre:</strong> {film.genre}</p>
                                <p className='p-model'> <strong>Country:</strong> {film.country}</p>
                                <p className='p-model'> <strong>Release:</strong> {film.release ? film.release.substring(0, 10) : null}</p>
                                <p className='p-model'> <strong>Budget:</strong> {film.budget}$</p>
                                <p className='p-model'> <strong>Fees:</strong> {film.fees}$</p>
                                <p className='p-model'> <strong>Average score:</strong> {film.avgScore}</p>
                            </div>
                            <Rating size="large" defaultValue={film.avgScore} value={score}
                                onChange={this.handleChangeScore} max={10} />

                            {userReview.score ? <p className='p-model'>Your score: {userReview.score}</p>
                                : <p className='p-model'>Leave your score for this film!</p>
                            }

                            {reviewsList && reviewsList.length > 0 ?
                                <div>
                                    <h2>User reviews:</h2>
                                    {reviewsList}
                                </div>
                                : null
                            }

                            <div className="float-right">
                                <Button size="lg" className="mt-3" color="dark" tag={Link} to={"/film/review/" + film.id}>Add review</Button>
                            </div>

                        </div>
                        : <h2>Film not found</h2>

                    }
                </Container >

            </div>
        );
    }

}
export default withRouter(FilmPage);