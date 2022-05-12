import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, TextInput } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { getEmail, getUserId, makeTokenizedRequest } from './../../utils/Common';
import { FormErrors } from "./../../components/Form/FormErrors"

class FilmLeaveReviewPage extends Component {

    emptyFilm = {
        title: '',
        description: '',
        director: '',
        country: '',
        release: null,
        budget: 0,
        fees: 0
    };

    emptyFilmReview = {
        review: '',
        score: 0,
        filmId: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            film: this.emptyFilm,
            filmReview: this.emptyFilmReview,
            formErrors: { score: '', review: '' },
            error: null,
            loading: false,
            scoreValid: false,
            reviewValid: false,
            formValid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const film = await (await makeTokenizedRequest(`/api/film/${this.props.match.params.id}`)).data;
        this.state.filmReview.filmId = film.id;

        this.setState({ film });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let filmReview = { ...this.state.filmReview };
        filmReview[name] = value;
        this.setState({ filmReview },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let { scoreValid, reviewValid } = this.state;
        switch (fieldName) {
            case 'score':
                scoreValid = value > 0 && value <= 10;
                fieldValidationErrors.score = scoreValid ? '' : ' is in wrong range (shoud be between 1 and 10)';
                break;
            case 'review':
                reviewValid = value.length >= 10 && value.length < 1024;
                fieldValidationErrors.review = reviewValid ? '' : ' is too short (min 10 symbols)';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            scoreValid: scoreValid,
            reviewValid: reviewValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.scoreValid && this.state.reviewValid
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { film, filmReview } = this.state;

        this.setState({ error: null, loading: true })

        console.log(filmReview);

        await makeTokenizedRequest('/api/filmReview/leaveReview', 'POST', filmReview)
            .then(response => {
                this.props.history.push('/film/' + film.id)
            })
            .catch(error => {
                if (error.response.status === 400) this.setState({ error: error.response.data.message, loading: false });
                else this.setState({ error: "Wrong value", loading: false });
            });
    }

    render() {
        const { film, error, filmReview } = this.state;
        const title = <h2>{'Review for film \'' + film.title + '\''}</h2>;

        return <div>
            <AppNavbar />
            <Container>
                {film.title ?
                    <div>
                        {title}
                        < h4 style={{ color: 'red' }}>{error}</h4>
                        <div className="panel panel-default">
                            <FormErrors formErrors={this.state.formErrors} />
                        </div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="score">Score</Label>
                                <Input type="number" name="score" id="score" value={filmReview.score || ''}
                                    onChange={this.handleChange} autoComplete="score" />
                            </FormGroup>
                            <FormGroup >
                                <Label for="review">Review</Label>
                                <Input type="text" name="review" id="review" value={filmReview.review || ''}
                                    onChange={this.handleChange} autoComplete="review" />
                            </FormGroup>
                            <FormGroup className='mt-1'>
                                <Button color="primary" type="submit" disabled={this.state.loading || !this.state.formValid}>Submit</Button>{' '}
                                <Button color="secondary" tag={Link} to={"/film/" + film.id}>Cancel</Button>
                            </FormGroup>
                        </Form>
                    </div>
                    : <h2>Film not found</h2>}
            </Container>
        </div >
    }

}
export default withRouter(FilmLeaveReviewPage);