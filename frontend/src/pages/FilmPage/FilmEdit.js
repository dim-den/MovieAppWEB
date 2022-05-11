import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { getToken, makeTokenizedRequest } from './../../utils/Common';

class FilmEdit extends Component {

    emptyItem = {
        title: '',
        description: '',
        genre: '',
        director: '',
        country: '',
        release: null,
        budget: 0,
        fees: 0
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
            const film = await (await makeTokenizedRequest(`/api/film/${this.props.match.params.id}`)).data;
            this.setState({ item: film });
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

        await makeTokenizedRequest('/api/film' + (item.id ? '/update/' + item.id : '/save'),
            (item.id) ? 'PUT' : 'POST',
            JSON.stringify(item))
            .then(response => this.props.history.push('/films'))
            .catch(error => {
                if (error.response.status === 400) this.setState({ error: error.response.data.message, loading: false });
                else this.setState({ error: "Wrong value", loading: false });
            });
    }

    render() {
        const { item } = this.state;
        const { error } = this.state;
        const title = <h2>{item.id ? 'Edit film' : 'Add film'}</h2>;

        return <div>
            <AppNavbar />
            <Container>
                {title}
                <h4 style={{ color: 'red' }}>{error}</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" value={item.title || ''}
                            onChange={this.handleChange} autoComplete="title" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" value={item.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="genre">Genre</Label>
                        <Input type="text" name="genre" id="genre" value={item.genre || ''}
                            onChange={this.handleChange} autoComplete="genre" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="director">Director</Label>
                        <Input type="text" name="director" id="director" value={item.director || ''}
                            onChange={this.handleChange} autoComplete="director" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="country">Country</Label>
                        <Input type="text" name="country" id="country" value={item.country || ''}
                            onChange={this.handleChange} autoComplete="country" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="release">Release date</Label>
                        <Input type="date" name="release" id="release" value={item.release || ''}
                            onChange={this.handleChange} autoComplete="release" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="budget">Budget</Label>
                        <Input type="number" name="budget" id="budget" value={item.budget || ''}
                            onChange={this.handleChange} autoComplete="budget" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="fees">Fees</Label>
                        <Input type="number" name="fees" id="fees" value={item.fees || ''}
                            onChange={this.handleChange} autoComplete="fees" />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/films">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(FilmEdit);