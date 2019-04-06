import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import Roster from '../../src/components/Roster';
import AuthHelperMethods from '../../src/components/Auth/AuthHelperMethods';

let UnwrappedShallowComponent;
let wrapper;

const auth = new AuthHelperMethods();

// auth mocks
auth.loggedIn = jest.fn(() => true); // replace loggedIn test for component mount check
auth.setToken = jest.fn(() => {
  auth.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzlhNzFiMDMxMGQyMTdmZjM5MDFlMjkiLCJpYXQiOjE1NTM3MTQzNTd9.sfyRdYlfXXzgqFfxLuEONxh1TMG1teWTAMO_GvG4Xdw');
});

// auth mocks for Promise return of getPlayers API call from AuthHelpers.js
const playerList = {
  success: true,
  players: [{
    first_name: 'liam',
    last_name: 'neeson',
    rating: 9000,
    handedness: 'left',
    id: '5c9fdeee310d217ff3901e67',
  }, {
    first_name: 'U',
    last_name: '2',
    rating: 9000,
    handedness: 'right',
    id: '5ca0eb2f310d217ff3901e71',
  }, {
    first_name: 'kevin',
    last_name: 'bacon',
    rating: 3000,
    handedness: 'right',
    id: '5ca0eb50310d217ff3901e72',
  }, {
    first_name: 'sam2',
    last_name: 'magoooo',
    rating: 9000,
    handedness: 'left',
    id: '5ca771be310d217ff3901ead',
  }],
};
const rosterMock = jest.fn().mockReturnValue(Promise.resolve(playerList));
auth.getPlayers = rosterMock;

// history mock
const history = {
  replace: jest.fn(),
};

beforeAll(() => {
  wrapper = mount(<Roster auth={auth} props={history} />);
  const shallowComponent = shallow(<Roster auth={auth} props={history} />);
  UnwrappedShallowComponent = shallowComponent.first().shallow();
});

afterAll(() => {
  wrapper.unmount();
});

describe('The Roster Table should', () => {
  it('match the Roster form snapshot', () => {
    expect(wrapper.find('Roster').length).toEqual(1);
  });

  it('render correctly', () => {
    const component = renderer.create(<Roster auth={auth} props={history} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('actually have a table element', () => {
    expect(wrapper.find('table').length).toBe(1);
  });

  describe('call the Auth module (mock) and', () => {
    it('verify user is logged in on componentWillMount', () => {
      const wrap = shallow(<Roster auth={auth} history={history} />);
      expect(auth.loggedIn).toHaveBeenCalled();
      wrap.unmount();
    });

    it('should call auth getPlayers (mock) on componentDidMount and load players into component state', () => {
      // Mock Auth API call to Roster and return Promised playerList
      expect(UnwrappedShallowComponent).toBeDefined();
      expect(UnwrappedShallowComponent.length).toBe(1);
      expect(auth.getPlayers).toHaveBeenCalled();

      // Expect Roster state to be loaded with the player list
      // Fist need to "camelize" the API return
      const camelizedPlayers = playerList.players.map(p =>
        ({
          firstName: p.first_name,
          lastName: p.last_name,
          id: p.id,
          rating: p.rating,
          handedness: p.handedness,
        }));

      expect(UnwrappedShallowComponent.state('players').sort()).toEqual(camelizedPlayers.sort());
    });
  });
});
