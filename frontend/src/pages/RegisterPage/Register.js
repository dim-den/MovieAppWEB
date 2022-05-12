import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import axios from 'axios';
import { setUserSession } from './../../utils/Common';
import { FormErrors } from "./../../components/Form/FormErrors"


class Register extends Component {

    emptyItem = {
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            formErrors: { email: '', name: '', password: '', confirmPassword: '' },
            error: null,
            loading: false,
            emailValid: false,
            nameValid: false,
            passwordValid: false,
            confirmPasswordValid: false,
            formValid: false
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
        this.setState({ item: item },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let { emailValid, nameValid, passwordValid, confirmPasswordValid } = this.state;
        switch (fieldName) {
            case 'email':
                emailValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(value);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'name':
                nameValid = value.length > 3;
                fieldValidationErrors.name = nameValid ? '' : ' is invalid';
                break;
                case 'name':
                    nameValid = value.length > 3;
                    fieldValidationErrors.name = nameValid ? '' : ' is invalid';
                    break;
            case 'password':
                passwordValid = value.length > 5;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            case 'confirmPassword':
                const { password } = this.state.item;
                confirmPasswordValid = (value === password);
                fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : ' doesnt match password';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            nameValid: nameValid,
            passwordValid: passwordValid,
            confirmPasswordValid: confirmPasswordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid:  this.state.emailValid && this.state.nameValid &&
            this.state.passwordValid && this.state.confirmPasswordValid
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;

        this.setState({ error: null, loading: true })

        axios.post('/api/auth/register', item)
            .then(response => {
                console.log(response.data);
                setUserSession(response.data.token, response.data.id, response.data.role);
                this.props.history.push('/');
            }).catch(error => {
                if (error.response.status === 400) this.setState({ error: error.response.data.message, loading: false });
                else if (error.response.status === 401) this.setState({ error: error.response.data.message, loading: false });
                else if (error.response.status === 409) this.setState({ error: error.response.data.message, loading: false });
                else this.setState({ error: "Something went wrong. Please try again later.", loading: false });
            });
    }

    render() {
        const { item } = this.state;
        const title = <h2>Registration</h2>;
        const { error } = this.state;

        return <div>
            <AppNavbar />
            <Container>
                {title}
                <h4 style={{ color: 'red' }}>{error}</h4>
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form onSubmit={this.handleSubmit}>
                    <div className={'form-group ${this.errorClass(this.state.formErrors.email)}'}>
                        <Label for="title">Email</Label>
                        <Input type="email" name="email" id="email" value={item.email || ''}
                            onChange={this.handleChange} autoComplete="email" />
                    </div>
                    <div className={'form-group ${this.errorClass(this.state.formErrors.username)}'}>
                        <Label for="title">Name</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                            onChange={this.handleChange} autoComplete="name" />
                    </div>
                    <div className={'form-group ${this.errorClass(this.state.formErrors.password)}'}>
                        <Label for="title">Password</Label>
                        <Input type="password" name="password" id="password" value={item.password || ''}
                            onChange={this.handleChange} autoComplete="password" />
                    </div>
                    <div className={'form-group ${this.errorClass(this.state.formErrors.confirmPassword)}'}>
                        <Label for="title">Confirm password</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" value={item.confirmPassword || ''}
                            onChange={this.handleChange} autoComplete="confirmPassword" />
                    </div>
                    <FormGroup className='mt-2'>
                        <Button color="primary" type="submit" disabled={this.state.loading || !this.state.formValid}>Register</Button>{' '}
                        <Button color="secondary" tag={Link} to="/login">Back to login</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(Register);