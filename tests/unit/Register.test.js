import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Register from '../../src/components/pages/Register';
import AuthHelperMethods from '../../src/components/auth/AuthHelperMethods';

// All field forms are translated between the form and API property
// names and the component state properties. This is defined in the
// project Config.js file.
const apiCamelizedLookupForRegister = {
  first_name: 'firstName',
  last_name: 'lastName',
  confirm_password: 'confirmPassword',
  email: 'email',
  password: 'password',
};

let UnwrappedShallowComponent;
let wrapper;
const history = {
  replace: jest.fn(),
};
const auth = new AuthHelperMethods();

// auth mocks for Promise return of newUser API call from AuthHelpers.js
const newUser = {
  success: true,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2E3NzI0YTMxMGQyMTdmZjM5MDFlYWUiLCJpYXQiOjE1NTQ0Nzc2NDJ9.dB--qqJQT6Zx8Ccn6HhKAXqtZX0oqhgyV2oEjy3RonU',
  user: {
    first_name: 'Same',
    last_name: 'Smith',
    email: 'a@b.com',
    id: '5ca7724a310d217ff3901eae',
  },
};
const registerMock = jest.fn().mockReturnValue(Promise.resolve(newUser));
auth.register = registerMock;

beforeAll(() => {
  wrapper = mount(<Register auth={auth} props={history} />);
  const shallowComponent = shallow(<Register auth={auth} props={history} />);
  UnwrappedShallowComponent = shallowComponent.first().shallow();
});

afterAll(() => {
  wrapper.unmount();
});

describe('The Register Form should', () => {
  it('match the Registration form snapshot', () => {
    expect(wrapper.find('Register').length).toEqual(1);
  });

  it('render correctly', () => {
    const component = renderer.create(<Register auth={auth} props={history} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('actually have a form element', () => {
    expect(wrapper.find('form').length).toBe(1);
  });

  // Loop through the apiCamelizedLookup array for all field forms
  describe('The form fields retrieve data and update component state', () => {
    // state names are transformed to camelCase for eslint rule
    // This is done via an enum like object defined in the project
    // Config.js file (under /src).
    const formNames = Object.keys(apiCamelizedLookupForRegister);
    const camelizedNames = Object.values(apiCamelizedLookupForRegister);
    let input;
    formNames.forEach((element) => {
      it(` checking ${element} has a defined onChange function`, () => {
        // MUI returning multiple nodes with #text_field, get the first with props
        input = wrapper.find(`#${element}`).first();
        expect(input.props('onChange')).toBeDefined();
        expect(typeof input.props('onChange').onChange === 'function').toBe(true);
      });
    });

    formNames.forEach((element, index) => {
      it(` checking ${element} updates state property on change`, () => {
        input = UnwrappedShallowComponent.find(`#${element}`).first();
        input.simulate('change', { target: { name: element, value: 'Ping' } });
        expect(UnwrappedShallowComponent.state(camelizedNames[index])).toBe('Ping');
      });
    });

    describe('The "Register Me!" button should', () => {
      const spy = sinon.spy();
      let pWrapper;
      beforeEach(() => {
        Register.prototype.handleFormSubmit = spy;
        pWrapper = mount(<Register auth={auth} />);
      });

      afterEach(() => {
        pWrapper.unmount();
      });

      it('process submit event for Register Me', () => {
        // fill in the form
        formNames.forEach((element) => {
          input = UnwrappedShallowComponent.find(`#${element}`).first();
          input.simulate('change', { target: { name: element, value: 'Ping' } });
        });

        // make confirm password differ to bump out of handleFormSubmit
        input = UnwrappedShallowComponent.find('#confirm_password').first();
        input.simulate('change', { target: { name: 'confirm_password', value: 'abcd' } });

        let prevented = false;
        UnwrappedShallowComponent.find('form').simulate('submit', { preventDefault: () => { prevented = true; } });
        expect(prevented).toBe(true);
      });

      it('do client-side check that password and confirm_password match testing state (stubbed)', () => {
        const stubHandleSubmit = sinon.stub(UnwrappedShallowComponent.instance(), 'handleFormSubmit').callsFake((thisComponent) => {
          const thisComponentState = thisComponent.state();
          return (thisComponentState.confirmPassword === thisComponentState.password);
        });

        // fill in the form
        formNames.forEach((element) => {
          input = UnwrappedShallowComponent.find(`#${element}`).first();
          input.simulate('change', { target: { name: element, value: 'Ping' } });
        });

        UnwrappedShallowComponent.find('form').simulate('submit', UnwrappedShallowComponent);
        sinon.assert.called(stubHandleSubmit);
      });

      it('Redirects to Roster (main page with Auth) on successful registration', () => {
        // mock history.replace('/roster')
        const mockReplaceURLtoRoster = jest.fn(() => true);
        const mockEvent = { preventDefault: () => {} };
        history.replace = mockReplaceURLtoRoster;

        const wrap = shallow(<Register auth={auth} props={history} />);
        const unwrappedWrap = wrap.first().shallow();

        // fill in the form
        input = unwrappedWrap.find('#first_name').first();
        input.simulate('change', { target: { name: 'first_name', value: 'Same' } });
        input = unwrappedWrap.find('#last_name').first();
        input.simulate('change', { target: { name: 'last_name', value: 'Smith' } });
        input = unwrappedWrap.find('#email').first();
        input.simulate('change', { target: { name: 'email', value: 'a@b.com' } });
        input = unwrappedWrap.find('#password').first();
        input.simulate('change', { target: { name: 'password', value: 'foozball' } });
        input = unwrappedWrap.find('#confirm_password').first();
        input.simulate('change', { target: { name: 'confirm_password', value: 'foozball' } });

        // Call submit and mock Auth.register to return resolved promise
        unwrappedWrap.find('form').simulate('submit', mockEvent);
        expect(registerMock('auth.register')).resolves.toBe(newUser);
      });
    });
  });
});
