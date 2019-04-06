import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import sinon from 'sinon';
import PlayersAppBar from '../../src/components/PlayersAppBar';
import AuthHelperMethods from '../../src/components/Auth/AuthHelperMethods';

let wrapper;
const history = {
  replace: jest.fn(),
};
const auth = new AuthHelperMethods();

describe('The Player Appbar (header bar) should', () => {
  beforeEach(() => {
    wrapper = mount(<PlayersAppBar auth={auth} props={history} />);
  });

  it('show the Player Appbar (header bar) should', () => {
    expect(wrapper.find('PlayersAppBar').length).toEqual(1);
  });

  it('render correctly', () => {
    const component = renderer.create(<PlayersAppBar auth={auth} props={history} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('show the Material UI Toolbar', () => {
    expect(wrapper.find('Toolbar').length).toEqual(1);
  });

  it('show the 2 available buttons', () => {
    expect(wrapper.find('Button').length).toEqual(2);
  });

  it('have a login button', () => {
    expect(wrapper.find('Button#Login').length).toEqual(1);
  });

  it('have a register button', () => {
    expect(wrapper.find('Button#Register').length).toEqual(1);
  });

  it('allow props to be set', () => {
    expect(wrapper.props().auth).toBeInstanceOf(AuthHelperMethods);
  });
});

// Click mock functions: because the history object is utilized to change the URL
// on click button events (with props.history.replace) and jest/enzyme are not passing
// the BrowserHistory Object, the click handler function in the PlayersAppBar is mocked
// and the clicks simulated. Because the mocks need to be defined for the Component
// before it is mounted, the mount is done locally in this describe section for each
// button test.
describe('The PlayerAppBar buttons should', () => {
  const spy = sinon.spy();
  let pWrapper;
  beforeEach(() => {
    PlayersAppBar.prototype.goTo = spy;
    pWrapper = mount(<PlayersAppBar auth={auth} props={history} />);
    pWrapper.setProps({ history: { replace: spy } });
  });

  it('process click events for Login', () => {
    pWrapper.find('Button#Login').simulate('click');
    sinon.assert.called(spy);
  });

  it('process click events for Register', () => {
    pWrapper.find('Button#Register').simulate('click');
    sinon.assert.called(spy);
  });

  it('call goTo "/login" on click Login Button', () => {
    pWrapper.find('Button#Login').simulate('click');

    sinon.assert.called(spy);
    sinon.assert.calledWith(spy, '/login');
  });

  it('call goTo "/register" on click Register Button', () => {
    pWrapper.find('Button#Register').simulate('click');

    sinon.assert.called(spy);
    sinon.assert.calledWith(spy, '/register');
  });
});
