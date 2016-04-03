import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ReactHorizontalTimeline from '../../src/Components/HorizontalTimeline';

describe('Testing integrity of the the timeline component', () => {
  it('checks if the timeline is a valid react component', () => {
    let renderer = ReactTestUtils.createRenderer();
    renderer.render(
      <ReactHorizontalTimeline
        indexClick={ (index) => {
          console.log(index);
        }}
        values={[ '1/1/1993', '1/1/1994' ]}
      />
    );

    let result = renderer.getRenderOutput();
    expect(result.type).toEqual('div');
  });
});
