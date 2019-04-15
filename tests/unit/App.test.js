import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import App from '../../src/components/App';
import PlayersAppBar from '../../src/components/PlayersAppBar';
import AuthHelperMethods from '../../src/components/auth/AuthHelperMethods';

let wrapper;
const auth = new AuthHelperMethods();

describe('The App', () => {
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  // smoke test
  it('Smoke test: Should render without crashing', () => {
    shallow(<App />);
  });

  it('shows a header area (MUI AppBar)', () => {
    expect(wrapper.find(PlayersAppBar).length).toEqual(1);
  });

  it('should render correctly', () => {
    const component = renderer.create(<App auth={auth} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
