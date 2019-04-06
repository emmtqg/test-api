import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import RosterPlayer from '../../src/components/RosterPlayer';

let wrapper;

// auth mocks for Promise return of getPlayers API call from AuthHelpers.js
const player = {
  first_name: 'liam',
  last_name: 'neeson',
  rating: 9000,
  handedness: 'left',
  id: '5c9fdeee310d217ff3901e67',
};

// Mock functions for MUI classes and remove player dialog confirmation
const cbRemovePlayer = jest.fn(() => 'Generate confirm dialog');
const classes = {};
const props = { player, cbRemovePlayer, classes };

beforeAll(() => {
  wrapper = mount(<RosterPlayer {...props} />);
});

afterAll(() => {
  wrapper.unmount();
});

describe('The Roster Table Row (RosterPlayer) should', () => {
  it('render correctly (match snapshot)', () => {
    const component = renderer.create(<RosterPlayer {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('generate a table row element', () => {
    expect(wrapper.find('tr').length).toBe(1);
  });

  it('generate a table row for roster that includes player info and a delete option', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('generate a table cell with a delete icon and click callback', () => {
    const removeBtn = wrapper.find('button');
    expect(removeBtn.length).toBeGreaterThanOrEqual(1);
    expect(removeBtn.props('onClick')).toBeDefined();
    expect(typeof removeBtn.props('onClick').onClick === 'function').toBe(true);
  });
});
