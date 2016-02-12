import React from 'react';
import HorizontalTimeline from './HorizontalTimeline';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let dates = [
      '1/1/1991',
      '1/1/1992',
      '1/1/1993',
      '1/1/1994',
      '1/1/1995',
      '1/1/1996',
      '1/1/1997',
      '1/1/1998',
      '1/1/1999'
    ];
    return (
      <HorizontalTimeline
        values={ dates }
        indexClick={ (index) => { console.log(`${index} was cllicked`); }} />
    );
  }
}
