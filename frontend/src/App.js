import React, { Component } from 'react';
import './App.css';
import Home from './pages/HomePage/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FilmList from './pages/FilmPage/FilmList';
import FilmEdit from "./pages/FilmPage/FilmEdit";
import FilmPage from "./pages/FilmPage/FilmPage";
import FilmLeaveReviewPage from "./pages/FilmPage/FilmLeaveReviewPage";
import ActorList from './pages/ActorPage/ActorList';
import ActorEdit from "./pages/ActorPage/ActorEdit";
import ActorPage from "./pages/ActorPage/ActorPage";
import UserList from './pages/UserPage/UserList';
import UserEdit from "./pages/UserPage/UserEdit";
import FilmReviewList from './pages/FilmReviewPage/FilmReviewList';
import FilmReviewEdit from "./pages/FilmReviewPage/FilmReviewEdit";
import FilmCastList from './pages/FilmCastPage/FilmCastList';
import FilmCastEdit from "./pages/FilmCastPage/FilmCastEdit";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import PrivateRoute from './utils/PrivateRoute';
import UserPage from './pages/UserPage/UserPage';

class App extends Component {
  componentDidMount(){
    document.title = "Movie App"
  }

  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            
            <PrivateRoute hasRole="user" path='/films' exact={true} component={FilmList}/>
            <PrivateRoute hasRole="admin" path='/films/:id' component={FilmEdit}/>
            <PrivateRoute hasRole="user" path='/film/review/:id' component={FilmLeaveReviewPage}/>
            <Route path='/film/:id' component={FilmPage}/>
            <PrivateRoute hasRole="user" path='/actors' exact={true} component={ActorList}/>
            <PrivateRoute hasRole="admin" path='/actors/:id' component={ActorEdit}/>
            <Route path='/actor/:id' component={ActorPage}/>
            <PrivateRoute hasRole="admin" path='/users' exact={true} component={UserList}/>
            <PrivateRoute hasRole="admin" path='/users/:id' component={UserEdit}/>
            <PrivateRoute hasRole="user" path='/profile' component={UserPage}/>
            <PrivateRoute hasRole="user" path='/filmReviews' exact={true} component={FilmReviewList}/>
            <PrivateRoute hasRole="admin" path='/filmReviews/:id' component={FilmReviewEdit}/>
            <PrivateRoute hasRole="user" path='/filmCasts' exact={true} component={FilmCastList}/>
            <PrivateRoute hasRole="admin" path='/filmCasts/:id' component={FilmCastEdit}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
          </Switch>
        </Router>
    )
  }
}

export default App;