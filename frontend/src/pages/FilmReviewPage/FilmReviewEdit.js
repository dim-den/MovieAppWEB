import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { getToken, makeTokenizedRequest } from './../../utils/Common';

class FilmReviewEdit extends Component {

    emptyItem = {
        review:'',
        score:0,
        published:'',
        userId:0,
        filmId:0
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
            const filmReview = await (await makeTokenizedRequest(`/api/filmReview/${this.props.match.params.id}`)).data;
            if (filmReview.published) filmReview.published = filmReview.published.substring(0, 10);
            this.setState({ item: filmReview });
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

        await makeTokenizedRequest('/api/filmReview' + (item.id ? '/update/' + item.id : '/save'), 
                                   (item.id) ? 'PUT' : 'POST',
                                    item)
                                    .then(response =>  this.props.history.push('/filmReviews'))
                                    .catch(error => {
                                        if (error.response.status === 400) this.setState({ error: error.response.data.message, loading: false}); 
                                        else this.setState({ error: "Wrong value", loading: false});
                                    });
    }

    render() {
        const {item} = this.state;
        const { error } = this.state;
        const title = <h2>{item.id ? 'Edit film review' : 'Add film review'}</h2>;
    
        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <h4 style={{ color: 'red' }}>{error}</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="review">Review</Label>
                        <Input type="text" name="review" id="review" value={item.review || ''}
                               onChange={this.handleChange} autoComplete="review"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="score">Score</Label>
                        <Input type="number" name="score" id="score" value={item.score || ''}
                               onChange={this.handleChange} autoComplete="score"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="published">Published</Label>
                        <Input type="date" name="published" id="published" value={item.published || ''}
                               onChange={this.handleChange} autoComplete="published"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="userId">User ID</Label>
                        <Input type="number" name="userId" id="userId" value={item.userId || ''}
                               onChange={this.handleChange} autoComplete="userId"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="filmId">Film ID</Label>
                        <Input type="number" name="filmId" id="filmId" value={item.filmId || ''}
                               onChange={this.handleChange} autoComplete="filmId"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/filmReviews">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}
export default withRouter(FilmReviewEdit);