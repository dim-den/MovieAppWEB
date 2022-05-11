import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, haveAccess } from './Common';
 
// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
    console.log(rest);
  return (
    <Route
      {...rest}
      render={(props) => getToken() && haveAccess(rest.hasRole) ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}
 
export default PrivateRoute;