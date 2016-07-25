import React, { PropTypes } from 'react';
import SwipeableViews from 'react-swipeable-views';

import HorizontalTimeline from '../../src/Components/HorizontalTimeline';

export default class HorizontalTimelineContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0, previous: 0 };
  }

  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  componentWillMount() {
    this.dates = this.props.content.map((entry) => entry.date);
  }

  componentWillReceiveProps(nextProps) {
    this.dates = nextProps.content.map((entry) => entry.date);
  }

  render() {
    let views = this.props.content.map((entry, index) => {
      return (
        <div className='container' key={index}>
          { entry.component }
        </div>
      );
    });

    return (
      <div>
        <div style={{ width: '60%', height: '100px', margin: '0 auto' }}>
          <HorizontalTimeline
            index={this.state.value}
            indexClick={(index) => {
              this.setState({ value: index, previous: this.state.value });
            }}
            values={ this.dates } />
        </div>
        <div className='text-center'>
          <SwipeableViews
            index={this.state.value}
            onChangeIndex={(value, previous) => {
              this.setState({ value: value, previous: previous });
            }}
            resistance>
            {views}
          </SwipeableViews>
        </div>
      </div>
    );
  }
}
