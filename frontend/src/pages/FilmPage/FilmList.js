import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { Link } from 'react-router-dom';
import { haveAccess, getToken, makeTokenizedRequest } from './../../utils/Common';
import  {Image } from 'react-native'

class FilmList extends Component {

    constructor(props) {
        super(props);
        this.state = { films: [] };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        makeTokenizedRequest(`/api/film/all`)
            .then(response => this.setState({ films: response.data }))
            .catch(error => {
                this.setState({ error: error.message });
            });
    }

    async remove(id) {
        this.setState({ error: null })

        await makeTokenizedRequest(`api/film/${id}`, 'DELETE')
            .then(() => {
                let updatedfilms = [...this.state.films].filter(i => i.id !== id);
                this.setState({ films: updatedfilms });
            })
            .catch(error => {
                if (error.response.status === 500) this.setState({ error: "Can't delete this row (constraint)" });
                else this.setState({ error: error.message });
            });
    }

    render() {
        const { films, isLoading, error } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const filmList = films.map(film => {
            return <tr key={film.id}>
                <td>{film.id}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{film.title}</td>
                <td>{film.description}</td>
                <td>{film.genre}</td>
                <td> <Image
                    source={{
                        uri: film.posterUrl
                    }}
                    style={{ width: 160, height: 90}}
                /></td>
                <td>{film.director}</td>
                <td>{film.country}</td>
                <td>{film.release.substring(0, 10)}</td>
                <td>{film.budget}</td>
                <td>{film.fees}</td>
                {haveAccess("ADMIN") ?
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"films/" + film.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(film.id)}>Delete</Button>
                        </ButtonGroup>
                    </td>
                    : null
                }
            </tr>
        });

        return (
            <div>
                <AppNavbar />

                <Container fluid>
                    {haveAccess("ADMIN") ?
                        <div className="float-right">
                            <Button color="success" tag={Link} to="/films/new">Add Film</Button>
                        </div>
                        : null
                    }
                    <h4 style={{ color: 'red' }}>{error}</h4>
                    <h3>Films</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="5%">ID</th>
                                <th width="10%">Title</th>
                                <th width="25%">Description</th>
                                <th width="10%">Genre</th>
                                <th width="10%">Poster</th>
                                <th width="10%">Director</th>
                                <th width="10%">Country</th>
                                <th width="10%">Release date</th>
                                <th width="10%">Budget</th>
                                <th width="10%">Fees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filmList}
                        </tbody>
                    </Table>
                </Container>
            </div >
        );
    }
}
export default FilmList;