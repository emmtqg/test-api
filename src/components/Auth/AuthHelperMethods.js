import decode from 'jwt-decode';

import config from '../Config';

// The apiCamelizedLookup provides a fieldname check and crossreference
// for the form field names. It aids in translation of valid property
// names to whatever the API required (single point of definition between
// the state properties and api names). It was assumed if the ESLint rules
// did not allow underscores (as specified in the API names) then, rather
// than overriding the linter, a mechanism should be incorporated to allow
// any API to specify properties as required and they can then be updated
// in one location. If form fields are checked for testing, then the form
// component can also utilize the apiCamelizedLookup for field specifications.
const { apiCamelizedLookup } = config;
const apiNames = Object.keys(apiCamelizedLookup);

export default class AuthHelperMethods {
  getApiPropName = (name) => {
    // Get the API 'expected' property of input form field
    let index = -1;
    Object.values(apiCamelizedLookup).findIndex((ele, i) => {
      index = i;
      return (ele === name);
    });
    return index; // returning matched index or -1 if not in apiCamelized object
  }

  lookupApiName = (name) => {
    const index = this.getApiPropName(name);
    if (index > -1) {
      // apiNames are the API keys in lookup array
      return apiNames[index];
    }

    return ''; // API will error with invalid fieldname
  }

  register = (registerObject) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = registerObject;

    // Get a token from api server using the fetch api
    return (
      this.fetch(config.registerUrl, {
        method: 'POST',
        body: JSON.stringify({
          [this.lookupApiName('firstName')]: firstName,
          [this.lookupApiName('lastName')]: lastName,
          email,
          password,
          [this.lookupApiName('confirmPassword')]: confirmPassword,
        }),
      })
        .then((response) => {
          // console.log(`Auth (Register): ${response}`);
          if (response) {
            this.setToken(response.token); // Setting the token in localStorage
            return Promise.resolve(response);
          }
          return Promise.reject(response);
        })
    );
  }

  newPlayer = (newPlayerObject) => {
    const {
      firstName,
      lastName,
      rating,
      handedness,
    } = newPlayerObject;

    // Get a token from api server using the fetch api
    return (
      this.fetch(config.playersUrl, {
        method: 'POST',
        body: JSON.stringify({
          [this.lookupApiName('firstName')]: firstName,
          [this.lookupApiName('lastName')]: lastName,
          rating,
          handedness,
        }),
      })
    );
  }

  getPlayers = () => (
    this.fetch(config.playersUrl, {
      method: 'GET',
    })
  );

  removePlayer = (playerId) => {
    const deleteUrl = `${config.playersUrl}/${playerId}`;
    return (
      this.fetch(deleteUrl, {
        method: 'DELETE',
      })
    );
  }

  login = (loginObject) => {
    const {
      email,
      password,
    } = loginObject;

    // Get a token from api server using the fetch api
    return (
      this.fetch(config.loginUrl, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => {
          if (response) {
            // console.log(`Auth (Login): ${response}`);
            this.setToken(response.token); // Setting the token in localStorage
            return response;
          }
          return Promise.reject(response);
        })
        .catch((error) => {
          if (error && error.message) {
            // console.log(`Error: ${error.message}`);
          }
          return Promise.reject(error);
        })
    );
  }

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return (typeof token !== typeof undefined) && (!!token && !this.isTokenExpired(token));
  }

  isTokenExpired = (token) => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) { // Checking if token is expired.
        return true;
      }
      return false;
    } catch (err) {
      // console.log('Check for expired tolen failed.');
      return false;
    }
  }

  setToken = (idToken) => {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  getToken = () =>
    // Retrieves the user token from localStorage
    localStorage.getItem('id_token')


  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
  }

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    const answer = decode(this.getToken());
    // console.log(`Get confirm token => ${answer}`);
    return answer;
  }

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this.checkStatus)
      .then(response => response.json())
      .catch((error) => {
        // console.log(`Error: ${error.message}`);
        throw error;
      });
  }

  checkStatus = (response) => {
    // Success status lies between 200 to 300
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    // raises an error in case response status is not a success
    const error = new Error(response.statusText);
    error.response = response;
    error.status = response.status;
    throw error;
  }
}
