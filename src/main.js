import React from 'react';
import ReactDOM from 'react-dom';
import ReactHorizontalTimeline from '../dist/react-horizontal-timeline';

import HorizontalTimelineContent from './Components/HorizontalTimelineContent';
import GameInfo from './resources/content';

import {} from 'bootstrap-webpack';
import {} from './css/body.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0, previous: 0 };
    console.log(ReactHorizontalTimeline);
  }

  componentWillMount() {
    this.data = GameInfo.map((game, index) => {
      return ({
        date: game.date,
        component: (
          <div className='container' key={index}>
            <h1>{ `The Elder Scrolls ${index + 1}:`}</h1>
            <h2>{ game.subtitle }</h2>
            <hr />
            <p>{ game.content}</p>
            <hr />
          </div>
        )
      });
    });
  }

  render() {
    return (
      <HorizontalTimelineContent
        content={this.data} />
    );
  }
}


ReactDOM.render(<App />, document.getElementById('react-horizontal-timeline'));
