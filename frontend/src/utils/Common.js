import axios from 'axios';


// return the token from the session storage
export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

export const getRole = () => {
    const roleStr = sessionStorage.getItem('role');
    if (roleStr && roleStr !== 'undefined') {
        return JSON.parse(roleStr);
    }
    else return null;
}

export const getUserId = () => {
    return sessionStorage.getItem('userId') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
}

// set the token and user from the session storage
export const setUserSession = (token, id, role) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', id);
    sessionStorage.setItem('role', JSON.stringify(role));
}


export const userAuthrorized = () => {
    return getToken() !== null;
}

export const haveAccess = required_role => {
    let user_role = getRole();

    if(user_role === null) return false;
    else if(user_role === required_role) return true;
    else if(user_role === "admin") return true;
    else return false;
}

export const makeTokenizedRequest = (path, method = 'GET', body = null) => {
    return body ? 
        axios(path, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            data: body}) :
        axios(path, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }});
}