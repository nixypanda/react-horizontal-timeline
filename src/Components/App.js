import React from 'react';
import { Motion, spring } from 'react-motion';
import HorizontalTimeline from './HorizontalTimeline';
import SwipeableViews from 'react-swipeable-views';

import GameInfo from '../resources/content';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0, previous: 0 };
  }

  componentWillMount() {
    this.dates = GameInfo.map((game) => game.date);
  }

  render() {
    let views = GameInfo.map((game, index) => {
      return (
        <div className='container' key={index}>
          <h2>{ game.subtitle }</h2>
          <hr />
          <p>{ game.content}</p>
          <hr />
        </div>
      );
    });

    return (
      <div>
        <HorizontalTimeline
        indexClick={(index) => {
          this.setState({ value: index, previous: this.state.value });
        }}
       values={ this.dates } />
     <div className='text-center'>
        <Motion style={{ x: spring(this.state.value + 1) }} >
          {value => <h1>{ 'The Elder Scrolls ' + value.x.toFixed(0) + ' :'}</h1>}
        </Motion>
        <SwipeableViews
          index={this.state.value}
          resistance>
          {views}
        </SwipeableViews>
      </div>
      </div>
    );
  }
}
