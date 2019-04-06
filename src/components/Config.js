const baseUrl = 'https://players-api.developer.alchemy.codes/';
const loginUrl = `${baseUrl}api/login`;
const registerUrl = `${baseUrl}api/user`;
const playersUrl = `${baseUrl}api/players`;
const apiCamelizedLookup = {
  first_name: 'firstName',
  last_name: 'lastName',
  confirm_password: 'confirmPassword',
  email: 'email',
  password: 'password',
  handedness: 'handedness',
  rating: 'rating',
};
const testPlayers = [
  {
    id: 1, firstName: 'al', lastName: 'smith', rating: 9500, handedness: 'left',
  },
  {
    id: 22, firstName: 'sue', lastName: 'smith', rating: 10000, handedness: 'left',
  },
  {
    id: 333, firstName: 'dan', lastName: 'smith', rating: 500, handedness: 'right',
  },
  {
    id: 4444, firstName: 'mark', lastName: 'smith', rating: 800, handedness: 'left',
  },
  {
    id: 55555, firstName: 'liz', lastName: 'smith', rating: 9500, handedness: 'right',
  },
];

class Config {
  static get loginUrl() {
    return loginUrl;
  }

  static get registerUrl() {
    return registerUrl;
  }

  static get playersUrl() {
    return playersUrl;
  }

  static get players() {
    return testPlayers;
  }

  static get apiCamelizedLookup() {
    return apiCamelizedLookup;
  }
}

export default Config;
