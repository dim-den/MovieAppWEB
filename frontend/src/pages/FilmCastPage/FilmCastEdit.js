import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { makeTokenizedRequest } from './../../utils/Common';

class FilmCastEdit extends Component {

    emptyItem = {
        roleName: '',
        actorId: 0,
        filmId: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            error: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const filmCast = await (await makeTokenizedRequest(`/api/filmCast/${this.props.match.params.id}`)).data;
            this.setState({ item: filmCast });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = { ...this.state.item };
        item[name] = value;
        this.setState({ item });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;

        await makeTokenizedRequest('/api/filmCast' + (item.id ? '/update/' + item.id : '/save'), 
                                   (item.id) ? 'PUT' : 'POST',
                                    item)
                                    .then(response =>  this.props.history.push('/filmCasts'))
                                    .catch(error => {
                                        if (error.response.status === 400) this.setState({ error: error.response.data.message, loading: false}); 
                                        else this.setState({ error: "Wrong value", loading: false});
                                    });
    }

    render() {
        const { item } = this.state;
        const { error } = this.state;
        const title = <h2>{item.id ? 'Edit film cast' : 'Add film cast'}</h2>;

        return <div>
            <AppNavbar />
            <Container>
                {title}
                <h4 style={{ color: 'red' }}>{error}</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="roleName">Role name</Label>
                        <Input type="text" name="roleName" id="roleName" value={item.roleName || ''}
                            onChange={this.handleChange} autoComplete="roleName" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="actorId">Actor ID</Label>
                        <Input type="number" name="actorId" id="actorId" value={item.actorId || ''}
                            onChange={this.handleChange} autoComplete="actorId" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="filmId">Film ID</Label>
                        <Input type="number" name="filmId" id="filmId" value={item.filmId || ''}
                            onChange={this.handleChange} autoComplete="filmId" />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/filmCasts">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(FilmCastEdit);