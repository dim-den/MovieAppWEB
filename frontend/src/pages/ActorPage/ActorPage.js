import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { makeTokenizedRequest } from '../../utils/Common';
import Card from 'react-bootstrap/Card'
import { Image } from 'react-native'
import "./ActorPage.css";
import './../../App.css';

class ActorPage extends Component {

    emptyActor = {
        id: 0,
        name: '',
        surname: '',
        country: '',
        bday: null
    };

    constructor(props) {
        super(props);
        this.state = {
            actor: this.emptyActor,
            filmCasts: null,
            currentUser: null,
            error: null
        };

        this.calculate_age = this.calculate_age.bind(this);
    }

    async componentDidMount() {
        const actor = await (await makeTokenizedRequest(`/api/actor/${this.props.match.params.id}`)).data;

        if (actor) {
            const filmCasts = await (await makeTokenizedRequest(`/api/filmCast/actor/${actor.id}`)).data;

            for (let i = 0; i < filmCasts.length; i++) {
                filmCasts[i].film = await (await makeTokenizedRequest(`/api/film/${filmCasts[i].filmId}`)).data;
            }

            this.setState({ filmCasts });
        }

        this.setState({ actor });
    }

    calculate_age(date) {
        var diff_ms = Date.now() - (new Date(date)).getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    render() {
        const { actor, filmCasts } = this.state;

        let actorFilmsList = null;

        if (filmCasts) {
            actorFilmsList = filmCasts.map(filmCast => {
                let path = "/film/" + filmCast.film.id;

                return <Card border="secondary" className='mt-3' style={{ width: '25rem' }}>
                    <Card.Header>
                        <div class="d-flex justify-content-between">
                            <a className='a-film-link' href={path}>
                                <big className="text-dark">{filmCast.film.title} ({filmCast.film.release.substring(0, 4)})</big >
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Role name: {filmCast.roleName}
                        </Card.Text>
                    </Card.Body>
                </Card>;
            })
        };

        return (
            <div style={{ backgroundImage: "url(/background.jpg)" }} className="background">
                <AppNavbar />
                <Container>
                    {actor.name ?
                        <div className='info-block'>
                            <div >
                                <h1>{actor.name} {actor.surname}</h1>
                                <Image
                                                source={{
                                                    uri: actor.imageUrl ? actor.imageUrl : "/default-user-image.jpg"
                                                }}
                                                style={{ width: 256, height: 256, borderRadius: 256 / 2, border: '2px solid black' }}
                                            />
                                <p className='p-model'> <strong>Country:</strong> {actor.country}</p>
                                <p className='p-model'> <strong>Birthday:</strong> {actor.birthday ? actor.birthday.substring(0, 10) : null} ({this.calculate_age(actor.birthday)} years)</p>
                                <p className='p-model'> <strong>Film participated:</strong> {actorFilmsList ? actorFilmsList.length : 0}</p>
                            </div>


                            <h2>Actor films:</h2>
                            {actorFilmsList && actorFilmsList.length > 0 ?
                        <div>
                            {actorFilmsList}
                        </div>
                        :
                        <p>Films not found</p>
                    }
            </div>
                        : <h2>Actor not found</h2>

    }
                </Container >

            </div >
        );
    }

}
export default withRouter(ActorPage);