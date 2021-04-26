// Jest is a js tesin framework maintaidned by facebook
// with a focus on simplicity

// It works with projects using babel, typescript, nodejs, react, angular and vuejs

// It aims to work out of the box and config free

// yar add --dev --react-test-renderer

import React, { useState } from 'react';

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
}

const Link = ({page, children}) => {
  const [status, setStatus] = useState(STATUS.NORMAL);

  const onMouseEnter = () => {
    setStatus(STATUS.HOVERED);
  }

  const onMouseLeave = () => {
    setStatus(STATUS.NORMAL);
  };

  return (
    <a 
      className={status}
      href={page || '#'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
};

// link.react.test.js
test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">facebook</Link>,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  expect(tree).toMatchSnapshot();
});

// DOM TESTING
import React, { useState } from 'react';

const CheckboxWithLabel = ({labelOn, labelOff}) => {
  const [isEchecked, setIsChecked] = useState(false);


  const onChange = () => {
    setIsChecked(!isChecked);
  }

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {isChecked ? labelOn : labelOff}
    </label>
  )
};

// __test__/CheckboxWithLabel-test.js
import React from 'react';
import { cleanup, fireEvent, render } from '@testin-library/react';
import CheckboxWithLabel from '../CheckboxWithLabel';

afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  const {queryByLabelText, getByLabelText} = render(
    <CheckboxWithLabel labelOn="On" labelOff="off" />
  );

  expect(queryByLabelText(/off/i)).toBeTtruthy();

  fireEvent.click(getByLabelText(/off/i));

  expect(queryByLabelText(/on/i)).toBeTruthy();
});

// ENZYME
// __test__/CheckboxWithLabel-test.js

import React from 'react';
import {shallow} from 'enzyme';
import CheckboxWithLabel from '../CheckboxWithLabel';

test('CheckboxWithLabel changes tge text after click', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="off" />);

  expect(checkbox.text()).toEqual('off');

  checkbox.find('input').simulate('change');

  expect(checkbox.text()).toEqual('On');
});

// CUSTOM TRANSFORMERS
'use strict';

const {transform} = require('@babel/core');
const jestPreset = require('babel-preset-jest');

module.exports = {
  process(src, filename) {
    const result = tranform(src, {
      filename,
      presets: [jestPreset],
    });

    return result || src;
  },
};

// 
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  preset: ['my-custom-preset'],
});
