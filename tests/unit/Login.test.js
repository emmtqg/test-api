import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import Login from '../../src/components/pages/Login';
import AuthHelperMethods from '../../src/components/auth/AuthHelperMethods';

let UnwrappedShallowComponent;
let wrapper;

const auth = new AuthHelperMethods();

// auth mocks
auth.loggedIn = jest.fn(() => false); // replace loggedIn test for component mount check
auth.setToken = jest.fn(() => {
  auth.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzlhNzFiMDMxMGQyMTdmZjM5MDFlMjkiLCJpYXQiOjE1NTM3MTQzNTd9.sfyRdYlfXXzgqFfxLuEONxh1TMG1teWTAMO_GvG4Xdw');
});

// auth mocks for Promise return of newLogin API call from AuthHelpers.js
const newLogin = {
  success: true,
  loginResponse: {
    id: '5b24deb1310d217ff39012c4',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzlhNzFiMDMxMGQyMTdmZjM5MDFlMjkiLCJpYXQiOjE1NTM3MTQzNTd9.sfyRdYlfXXzgqFfxLuEONxh1TMG1teWTAMO_GvG4Xdw',
  },
};
const loginMock = jest.fn().mockReturnValue(Promise.resolve(newLogin));
auth.login = loginMock;

// history mock
const history = {
  replace: jest.fn(),
};

// Although no login form fields need to be camelized for the state properties,
// the object serves to list the valid fields for the form.
const apiCamelizedLookupForLogin = {
  email: 'email',
  password: 'password',
};

beforeAll(() => {
  wrapper = mount(<Login auth={auth} props={history} />);
  const shallowComponent = shallow(<Login auth={auth} props={history} />);
  UnwrappedShallowComponent = shallowComponent.first().shallow();
});

afterAll(() => {
  // wrapper.unmount();
});

describe('The Login Form should', () => {
  it('match the Login form snapshot', () => {
    expect(wrapper.find('Login').length).toEqual(1);
  });

  it('render correctly', () => {
    const component = renderer.create(<Login auth={auth} props={history} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('actually have a form element', () => {
    expect(wrapper.find('form').length).toBe(1);
  });

  describe('The form fields retrieve data and update component state', () => {
    const formNames = Object.keys(apiCamelizedLookupForLogin);
    let input;
    formNames.forEach((element) => {
      it(` checking ${element} has a defined onChange function`, () => {
        // MUI returning multiple nodes with #text_field, get the first with props
        input = wrapper.find(`#${element}`).first();
        expect(input.props('onChange')).toBeDefined();
        expect(typeof input.props('onChange').onChange === 'function').toBe(true);
      });
    });

    formNames.forEach((element) => {
      it(` checking ${element} updates state property on change`, () => {
        input = UnwrappedShallowComponent.find(`#${element}`).first();
        input.simulate('change', { target: { name: element, value: 'Ping' } });
        expect(UnwrappedShallowComponent.state([element])).toBe('Ping');
      });
    });
  });

  describe('The Auth module (mock) should be called to log in user on Submit', () => {
    it('should call handleSubmit and mock Auth API call to login and return Promise', () => {
      // mock history.replace('/roster')
      const mockReplaceURLtoRoster = jest.fn(() => true);
      const mockEvent = { preventDefault: () => {} };
      history.replace = mockReplaceURLtoRoster;

      const wrap = shallow(<Login auth={auth} props={history} />);
      const unwrappedWrap = wrap.first().shallow();
      let input;

      input = unwrappedWrap.find('#email').first();
      input.simulate('change', { target: { email: 'email', value: 'sue@magoo.com' } });
      input = unwrappedWrap.find('#password').first();
      input.simulate('change', { target: { password: 'password', value: 'a' } });
      input = unwrappedWrap.find('#password').first();

      // Call submit and mock Auth.login to return resolved promise
      unwrappedWrap.find('form').simulate('submit', mockEvent);
      expect(loginMock('auth.login')).resolves.toBe(newLogin);
    });
  });
});
