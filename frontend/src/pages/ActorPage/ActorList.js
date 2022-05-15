import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { Link } from 'react-router-dom';
import { haveAccess, getToken, makeTokenizedRequest } from './../../utils/Common';
import  {Image } from 'react-native'

class ActorList extends Component {

    constructor(props) {
        super(props);
        this.state = { actors: [], error: null};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        makeTokenizedRequest(`/api/actor/all`)
        .then(response => this.setState({ actors: response.data }))
        .catch(error => {
            this.setState({ error: error.message });
        });
    }

    async remove(id) {
        this.setState({ error: null })

        await makeTokenizedRequest(`/api/actor/${id}`, 'DELETE')
            .then(() => {
                let updatedActors = [...this.state.actors].filter(i => i.id !== id);
                this.setState({ actors: updatedActors });
            })
            .catch(error => {
                if (error.response.status === 500) this.setState({ error: "Can't delete this row (constraint)" });
                else this.setState({ error: error.message });
            });
    }

    render() {
        const {actors, isLoading, error } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const actorList = actors.map(actor => {
            return <tr key ={actor.id}>
                <td>{actor.id}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{actor.name}</td>
                <td>{actor.surname}</td>
                <td> <Image
                 source={{
                    uri: actor.imageUrl ? actor.imageUrl : "/default-user-image.jpg"
                  }} 
                    style={{ width: 64, height: 64, borderRadius: 128 / 2 }}
                /></td>
                <td>{actor.country}</td>
                <td>{actor.birthday.substring(0, 10)}</td>
                {haveAccess("admin") ?
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"actors/" + actor.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(actor.id)}>Delete</Button>
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
                    {haveAccess("admin") ?
                        <div className="float-right">
                            <Button color="success" tag={Link} to="/actors/new">Add actor</Button>
                        </div>
                        : null
                    }
                    <h4 style={{ color: 'red' }}>{error}</h4>
                    <h3>Actors</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="5%">ID</th>
                                <th width="20%">Name</th>
                                <th width="20%">Surname</th>
                                <th width="20%">Image</th>
                                <th width="20%">Country</th>
                                <th width="15%">Birthday</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actorList}
                        </tbody>
                    </Table>
                </Container>
            </div >
        );
    }
}
export default ActorList;