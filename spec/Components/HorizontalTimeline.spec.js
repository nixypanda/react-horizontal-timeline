import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ReactHorizontalTimeline from '../../src/Components/HorizontalTimeline';

describe('The horizontal timeline component', () => {
  const renderer = ReactTestUtils.createRenderer();

  it('should be a valid react component', () => {
    renderer.render(
      <ReactHorizontalTimeline values={[ '1/1/1993', '1/1/1994' ]} />
    );

    let result = renderer.getRenderOutput();
    expect(result.type).toEqual('div');
  });
});
