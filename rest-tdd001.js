// MyComponent.test.js
import React from 'react';
import { shallow } from 'enzyme';
import MyComponent from './MyComponent';
import { hasUncaughtExceptionCaptureCallback } from 'process';
describe("MyComponent", () => {
  it("MyComponent", () => {
    it("should render my component", () => {
      const wrapper = shallow(<MyComponent />);
    })
  })
})

// ReferenceError: MyComponent is not defined

// MyComponent.js
export default class MyComponent extends React.Component {
  render() {
    return <div />;
  }
}

it("should render initial layour", () => {
  const component = shallow(<MyComponent />);

  expect(component.getElements()).toMatchSnapshot();
})

// another version 
import React from 'react';

export default class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <input onChange={event => this.setState({input: ''})} type="text" />
      </div>
    )
  }
}

// MyComponent.test.js
it("should create an entry in component state with the event value", () => {
  // given
  const component = shallow(<MyComponent />);
  const form = component.find('input');

  // when 
  form.props().onChange({ target: {
    name: 'myName',
    value: 'myValue'
  }});
  // then
  expect(component.state('input')).toEqual('muValue');
});


