import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './../../components/Navbar/AppNavbar';
import { Link } from 'react-router-dom';
import { haveAccess, makeTokenizedRequest } from './../../utils/Common';
import Pagination from './../../components/Pagination/Pagination';

const pageSize = 10;

class FilmReviewList extends Component {

    constructor(props) {
        super(props);
        this.state = { filmReviews: [] };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        makeTokenizedRequest(`/api/filmReview/all`)
            .then(response => this.setState({ filmReviews: response.data }))     
            .catch(error => {
                this.setState({ error: error.message });
            });       
    }

    async remove(id) {
        await makeTokenizedRequest(`api/filmReview/${id}`, 'DELETE')
            .then(() => {
                let updatedFilmReviews = [...this.state.filmReviews].filter(i => i.id !== id);
                this.setState({ filmReviews: updatedFilmReviews });
            });
    }

    render() {
        const { filmReviews, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const filmReviewList = filmReviews.map(filmReview => {
            return <tr key={filmReview.id}>
                <td>{filmReview.id}</td>
                <td style={{ whiteSpace: 'wrap', maxWidth: '700px' }}>{filmReview.review}</td>
                <td>{filmReview.score}</td>
                <td>{filmReview.published.substring(0, 10)}</td>
                <td>{filmReview.userId}</td>
                <td>{filmReview.filmId}</td>

                {haveAccess("admin") ?
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={"filmReviews/" + filmReview.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(filmReview.id)}>Delete</Button>
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
                            <Button color="success" tag={Link} to="/filmReviews/new">Add film review</Button>
                        </div>
                        : null
                    }
                    <h3>Film reviews</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="5%">ID</th>
                                <th width="50%">Review</th>
                                <th width="5%">Score</th>
                                <th width="10%">Published</th>
                                <th width="10%">User ID</th>
                                <th width="10%">Film ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filmReviewList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default FilmReviewList;