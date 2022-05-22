import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { makeTokenizedFormDataRequest, makeTokenizedRequest } from './../../utils/Common';

class ActorEdit extends Component {

    emptyItem = {
        name: '',
        surname: '',
        country: '',
        birthday: null
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            error: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const actor = await (await makeTokenizedRequest(`/api/actor/${this.props.match.params.id}`)).data;
            if (actor.birthday) actor.birthday = actor.birthday.substring(0, 10);
            this.setState({ item: actor });
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
        if (item.birthday) item.birthday = item.birthday.substring(0, 10);

        if (item.id && this.input.current.files[0]) {
            const formData = new FormData();
            formData.append("file", this.input.current.files[0]);

            await makeTokenizedFormDataRequest('/api/actor/uploadImage/' + item.id, formData);
        }
        else if (!item.id && this.input.current.files[0]) {
            const formData = new FormData();
            formData.append("file", this.input.current.files[0]);

            let result = await (await makeTokenizedFormDataRequest('/api/actor/uploadImage', formData)).data;
            item.imageUrl = result.url;
        };

        await makeTokenizedRequest('/api/actor' + (item.id ? '/update/' + item.id : '/save'),
            (item.id) ? 'PUT' : 'POST',
            item)
            .then(response => this.props.history.push('/actors'))
            .catch(error => {
                if (error.response.status == 400) this.setState({ error: error.response.data.message, loading: false });
                else if (error.response.status == 403) this.setState({ error: "Not enough rights for this action", loading: false });
                else this.setState({ error: "Wrong value", loading: false });
            });
    }

    render() {
        const { item } = this.state;
        const { error } = this.state;
        const title = <h2>{item.id ? 'Edit actor' : 'Add actor'}</h2>;

        return <div>
            <AppNavbar />
            <Container>
                {title}
                <h4 style={{ color: 'red' }}>{error}</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="name" name="name" id="name" value={item.name || ''}
                            onChange={this.handleChange} autoComplete="name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="surname">Surname</Label>
                        <Input type="text" name="surname" id="surname" value={item.surname || ''}
                            onChange={this.handleChange} autoComplete="surname" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="upload-image-file">Image</Label>
                        <br />
                        <input type="file" accept=".png, .jpg, .jpeg" ref={this.input} name="upload" id="upload" placeholder='upload-image-file' />
                    </FormGroup>
                    <FormGroup>
                        <Label for="country">Country</Label>
                        <Input type="text" name="country" id="country" value={item.country || ''}
                            onChange={this.handleChange} autoComplete="country" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="birthday">Birthday</Label>
                        <Input type="date" name="birthday" id="birthday" value={item.birthday || ''}
                            onChange={this.handleChange} autoComplete="birthday" />
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/actors">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(ActorEdit);