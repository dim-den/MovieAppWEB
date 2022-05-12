import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { Link } from 'react-router-dom';
import { haveAccess, makeTokenizedRequest } from '../../utils/Common';
import Pagination from '../../components/Pagination/Pagination';

const pageSize = 10;

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = { users: [], error: null };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        makeTokenizedRequest(`/api/user/all`)
            .then(response => this.setState({ users: response.data }))
            .catch(error => {
                this.setState({ error: error.message });
            });
    }

    async remove(id) {
        this.setState({ error: null })

        await makeTokenizedRequest(`api/user/${id}`, 'DELETE')
            .then(() => {
                let updatedUsers = [...this.state.users].filter(i => i.id !== id);
                this.setState({ users: updatedUsers });
            })
            .catch(error => {
                if (error.response.status === 500) this.setState({ error: "Can't delete this row (constraint)" });
                else this.setState({ error: error.message });
            });
    }

    render() {
        const { users, isLoading, error } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const userList = users.map(user => {
            return <tr key={user.id}>
                <td>{user.id}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>{user.birthday}</td>
                {haveAccess("admin") ?
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"users/" + user.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(user.id)}>Delete</Button>
                        </ButtonGroup>
                    </td>
                    : null
                }
            </tr>
        });

        return (
            <div>
                <AppNavbar />
                {haveAccess("admin") ?
                    <Container fluid>
                        <div className="float-right">
                            <Button color="success" tag={Link} to="/users/new">Add user</Button>
                        </div>

                        <h4 style={{ color: 'red' }}>{error}</h4>
                        <h3>Users</h3>
                        <Table className="mt-4">
                            <thead>
                                <tr>
                                    <th width="5%">ID</th>
                                    <th width="15%">Email</th>
                                    <th width="10%">Name</th>
                                    <th width="25%">Password</th>
                                    <th width="5%">Role</th>
                                    <th width="10%">Birthday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList}
                            </tbody>
                        </Table>
                    </Container>
                    : null
                }
            </div>
        );
    }
}
export default UserList;