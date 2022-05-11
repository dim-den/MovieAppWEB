import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import axios from 'axios';
import { setUserSession } from '../../utils/Common';


class Login extends Component {

    emptyItem = {
        email: '',
        password: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            error: null,
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = { ...this.state.item };
        item[name] = value;
        this.setState({ item: item, error: null });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;

        this.setState({ error: null, loading: true })

        console.log(item);

        axios.post('/api/auth/login', item)
        .then(response => {
            setUserSession(response.data.token, response.data.email, response.data.role );
            this.props.history.push('/');
        }).catch(error => {
            if (error.response.status === 401) this.setState({ error: error.response.data.message, loading: false}); 
            else {console.log(error.response.data); this.setState({ error: "Something went wrong. Please try again later.", loading: false})};
        });
    }

    render() {
        const { item } = this.state;
        const title = <h2>Login</h2>;
        const { error } = this.state;

        return <div>
            <AppNavbar />
            <Container>
                {title}
                <h4 style={{ color: 'red' }}>{error}</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="title">Email</Label>
                        <Input type="email" name="email" id="email" value={item.email || ''}
                            onChange={this.handleChange} autoComplete="email" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="title">Password</Label>
                        <Input type="password" name="password" id="password" value={item.password || ''}
                            onChange={this.handleChange} autoComplete="password" />
                    </FormGroup>
                    <FormGroup className='mt-2'>
                        <Button color="primary" type="submit" disabled={this.state.loading || !item.email || !item.password}>Login</Button>{' '}
                        <Button color="secondary" tag={Link} to="/register">Don't have an account?</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(Login);