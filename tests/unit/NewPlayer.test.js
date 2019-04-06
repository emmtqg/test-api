import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';

import NewPlayer from '../../src/components/NewPlayer';
import AuthHelperMethods from '../../src/components/Auth/AuthHelperMethods';

// All field forms are translated between the form and API property
// names and the component state properties. This is defined in the
// project Config.js file.
const apiCamelizedLookupForNewPlayer = {
  first_name: 'firstName',
  last_name: 'lastName',
  handedness: 'handedness',
  rating: 'rating',
};

let UnwrappedShallowComponent;
let wrapper;

// auth mocks
const newPlayerMock = jest.fn();
newPlayerMock.mockResolvedValue({
  success: true,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2E3NzI0YTMxMGQyMTdmZjM5MDFlYWUiLCJpYXQiOjE1NTQ0Nzc2NDJ9.dB--qqJQT6Zx8Ccn6HhKAXqtZX0oqhgyV2oEjy3RonU',
  user: {
    first_name: 'Same',
    last_name: 'Smith',
    email: 'a@b.com',
    id: '5ca7724a310d217ff3901eae',
  },
});
// expect(mock('foo')).resolves.toBe('bar');

// history mock
const history = {
  replace: jest.fn(),
};
const auth = new AuthHelperMethods();
auth.loggedIn = jest.fn(() => true);

beforeAll(() => {
  auth.newPlayer = jest.fn(() => { Promise.resolve({}); });
  wrapper = mount(<NewPlayer auth={auth} props={history} />);
  const shallowComponent = shallow(<NewPlayer auth={auth} props={history} />);
  UnwrappedShallowComponent = shallowComponent.first().shallow();
});

afterAll(() => {
  wrapper.unmount();
});


describe('The New Player Form should', () => {
  it('match the New Player form snapshot', () => {
    expect(wrapper.find('NewPlayer').length).toEqual(1);
  });

  it('render correctly', () => {
    const component = renderer.create(<NewPlayer auth={auth} props={history} />);
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
    const formNames = Object.keys(apiCamelizedLookupForNewPlayer);
    const formValues = Object.values(apiCamelizedLookupForNewPlayer);
    let input;
    formNames.forEach((element) => {
      it(` checking ${element} has a defined onChange function`, () => {
        // MUI returning multiple nodes with #text_field, get the first with props
        input = wrapper.find(`#${element}`).first();
        expect(input.length).toBeGreaterThanOrEqual(1);
        expect(input.props('onChange')).toBeDefined();
        expect(typeof input.props('onChange').onChange === 'function').toBe(true);
      });
    });

    formNames.forEach((element, index) => {
      it(` checking ${element} updates component state on change`, () => {
        input = UnwrappedShallowComponent.find(`#${element}`).first();
        if ((element === 'first_name') || (element === 'last_name')) {
          input.simulate('change', { target: { name: element, value: 'Ping' } });
          expect(UnwrappedShallowComponent.state(formValues[index])).toBe('Ping');
        } else if (element === 'rating') {
          input.simulate('change', { target: { name: element, value: '9000' } });
          expect(UnwrappedShallowComponent.state(formValues[index])).toBe('9000');
        } else if (element === 'handedness') {
          input.simulate('change', { target: { name: element, value: 'right' } });
          expect(UnwrappedShallowComponent.state(formValues[index])).toBe('right');
        } else {
          // flags erroneous field listed in formNames (apiCamelizedLookupForNewPlayer)
          expect(true).toBe(false);
        }
      });
    });
  });
});
