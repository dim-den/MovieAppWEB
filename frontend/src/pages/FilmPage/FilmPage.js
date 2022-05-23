import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { makeTokenizedRequest, userAuthrorized, getUserId } from './../../utils/Common';
import Rating from '@mui/material/Rating';
import { Image } from 'react-native'
import Card from 'react-bootstrap/Card'
import "./FilmPage.css";

class FilmPage extends Component {

    emptyFilm = {
        id: 0,
        title: '',
        genre: '',
        description: '',
        posterUrl: null,
        director: '',
        country: '',
        release: null,
        budget: 0,
        fees: 0,
        avgScore: 0.0
    };

    emptyUserReview = {
        review: '',
        score: null,
        published: null,
        userId: 0,
        filmId: 0,
        username: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            film: this.emptyFilm,
            userReview: this.emptyUserReview,
            reviews: null,
            casts: null,
            currentUser: null,
            error: null
        };
        this.handleChangeScore = this.handleChangeScore.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        const film = await (await makeTokenizedRequest(`/api/film/${id}`)).data;

        if (film) {
            film.avgScore = await (await makeTokenizedRequest(`/api/filmReview/score/${film.id}`)).data.score;
            if (film.avgScore) film.avgScore = film.avgScore.toFixed(2)
            else film.avgScore = "No scores";

            const reviews = await (await makeTokenizedRequest(`/api/filmReview/film/${film.id}`)).data;
            const casts = await (await makeTokenizedRequest(`/api/filmCast/film/${film.id}`)).data;

            this.setState({ film, reviews, casts });
        }

        if (film && userAuthrorized()) {
            const userReview = await (await makeTokenizedRequest(`/api/filmReview?filmId=${film.id}&userId=${getUserId()}`)).data;
            this.setState({ userReview: userReview });
        }
    }

    async handleChangeScore(event, newValue) {
        const { userReview, film } = this.state;

        const newReview = {
            score: newValue,
            filmId: film.id
        };

        await makeTokenizedRequest('/api/filmReview/leaveScore', 'POST', newReview)
            .then(response => {
                userReview.score = newValue;
                this.setState({ userReview });
            })
            .catch(error => {
                this.setState({ error: "An error occurred while leaving a score" });
            });

        film.avgScore = await (await makeTokenizedRequest(`/api/filmReview/score/${film.id}`)).data.score.toFixed(2);
        this.setState({ film });
    }


    render() {
        const { userReview, film, reviews, casts } = this.state;
        const score = userReview.score ? userReview.score : 0;

        let reviewsList = null;
        if (reviews) {
            reviewsList = reviews.filter(review => review.review).map(review => {
                let header = `User name: `;
                let footer = `User score: ${review.score}`;

                return <Card border="secondary" className='card'>
                    <Card.Header>
                        <div class="d-flex justify-content-between">

                            <div class="d-flex justify-content-between">
                                <Image
                                    source={{
                                        uri: review.imageUrl ? review.imageUrl : "/default-user-image.jpg"
                                    }}
                                    style={{ width: 48, height: 48, borderRadius: 48 / 2, border: '1px solid black' }}
                                />
                                <h3 className='vertical-align-center' >{review.username}</h3 >

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
                </Card >;
            })
        };

        let castsList = null;
        if (casts) {
            castsList = casts.map((cast, i) => {
                let path = "/actor/" + cast.actorId;
                return <span><a className='a-actor-link' href={path}>{cast.name} {cast.surname}</a>{i + 1 == casts.length ? '' : ', '} </span>
            });
        }

        let actorsList = null;
        if (casts) {
            actorsList = casts.map((actor, i) => {
                let path = "/actor/" + actor.actorId;
                return <div className='actor-item'>
                    <a className='a-actor-link' href={path}>
                        <Image
                            source={{
                                uri: actor.imageUrl ? actor.imageUrl : "/default-user-image.jpg"
                            }}
                            style={{ marginRight: 10, width: 80, height: 80, borderRadius: 80 / 2, border: '1px solid black' }}
                        />
                    </a>
                    <div>
                        <p><strong>{actor.roleName}</strong></p>
                        <p class="form-text text-muted">{actor.name}  {actor.surname}</p>
                    </div>
                </div>
            });
        };

        let posterLink = film.posterUrl ? `url(${film.posterUrl})` : "url(/background.jpg)";
        return (
            <div style={{ backgroundImage: posterLink }} className="background">
                <AppNavbar />
                <Container>
                    {film.title ?
                        <div>
                            <div className='info-block'>
                                <Table className="mt-4">
                                    <tr>
                                        <th width="65%">
                                            <h1>{film.title}</h1>
                                        </th>
                                        <th width="35%">
                                            <div className='cards'>
                                                <span className='film-score-text'>{film.avgScore}  </span>
                                                <small className='film-score-10'> /10</small>
                                                <Image
                                                    source="/star.ico"
                                                    style={{ width: 54, height: 54, border: 0 }}
                                                />
                                            </div>
                                        </th>
                                    </tr>
                                </Table>
                                <p className='p-model'> <strong>Description:</strong> {film.description}</p>
                                <p className='p-model'> <strong>Director:</strong> {film.director}</p>
                                <p className='p-model'> <strong>Genre:</strong> {film.genre}</p>
                                <p className='p-model'> <strong>Country:</strong> {film.country}</p>
                                <p className='p-model'> <strong>Release:</strong> {film.release ? film.release.substring(0, 10) : null}</p>
                                <p className='p-model'> <strong>Budget:</strong> {film.budget}$</p>
                                <p className='p-model'> <strong>Fees:</strong> {film.fees}$</p>
                                <p className='p-model'> <strong>Average score:</strong> {film.avgScore}</p>
                                <p className='p-model'> <strong>Actors:</strong> {castsList && castsList.length > 0 ? <span> {castsList} </span> : "not found"} </p>


                                {userAuthrorized() ?
                                    <div>
                                        <Rating size="large" defaultValue={film.avgScore} value={score}
                                            onChange={this.handleChangeScore} max={10} />

                                        {userReview.score ? <p className='p-model'>Your score: {userReview.score}</p>
                                            : <p className='p-model'>Leave your score for this film!</p>
                                        }
                                    </div>
                                    : <p className='p-model mt-2'>Authorize to leave your score for film</p>
                                }
                            </div>

                            {actorsList && actorsList.length > 0 ?
                                <div>
                                    <h2>Film cast:</h2>
                                    <div className='actors-cast-block'>
                                        {actorsList}
                                    </div>
                                </div>
                                : null
                            }

                            {reviewsList && reviewsList.length > 0 ?
                                <div>
                                    <h2>User reviews ({reviewsList.length}):</h2>
                                    <div className="cards">
                                        {reviewsList}
                                    </div>
                                </div>
                                : null
                            }

                            {userAuthrorized() ?
                                <div className="float-right">
                                    <Button size="lg" className="mt-3" color="dark" tag={Link} to={"/film/review/" + film.id}>Add review</Button>
                                </div>
                                : <p className='p-model mt-2'>Authorize to leave your review for film</p>
                            }

                        </div>
                        : <h2>Film not found</h2>

                    }
                </Container >

            </div>
        );
    }

}
export default withRouter(FilmPage);