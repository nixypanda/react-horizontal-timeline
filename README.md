#React Horizontal Timeline
A react port of the horizontal time-line developed by CodyHouse.
Here is a [demo] (http://jck-d-rpr.github.io/react-horizontal-timeline) I hope you too are a fan of the elder scrolls.

###Usage
This module exports 2 components.

1. ```HorizontalTimeline```

It will just render a timeline with the dates that you provided and it is upto you what to do when a date is selected. i.e. it will give you the index of the date that was clicked and you can do anything with it.

Property	       |	Type   	   |	Default	                    |	Description
:------------------|:--------------|:-------------------------------|:--------------------------------
 values            | array         | undefind                       | **sorted** array of dates (**required**)
 indexCLick        | function      | undefind                       | function that takes the index of the array as argument (**required**)
 index             | number        | 0                              | the index of the selected date (useful if you want to control the selected date from outside like in case of react-swipeable-views)
 eventsMinDistance | number        | 80                             | The minimum distance between consecutive events
 fillingMotion     | object        |{ stiffness: 150, damping: 25 } | Sets the animation style of how filling motion will look
 slidingMotion     | object        |{ stiffness: 150, damping: 25 } | Sets the animation style of how sliding motion will look
 styles            | object        |{ background: '#dfdfdf', foreground: '#7b9d6f', maxSize: 800 } | object containging the styles for the timeline currently foreground and background colors along with the max length of the timeline can be changed.

This is how it can be used.
```
const VALUES = [ /* The date strings go here */ ];

export default class App extends React.Component {
  state = { value: 0, previous: 0 };

  render() {
    return (
      <div>
        <HorizontalTimeline
          indexClick={(index) => {
            this.setState({ value: index, previous: this.state.value });
          }}
          values={ VALUES } />
        <div className='text-center'>
          {/* any arbitrary component can go here */}    
          {this.state.value}
        </div>
      </div>
    );
  }
}

```

2. ```HorizontalTimelineContent```

You can provide this component with the complete data and it will render it (also uses react-swipeable-views).

Property	|	Type		|	Default		|	Description
:-----------|:--------------|:--------------|:--------------------------------
 content    | [ object(s) ] | undefind      | an array of object(s) which have two keys { date, component } where component is the component to render when corresponding date is selected.

This is how it can be used
```
# GameInfo contains the content to display look for
# date: is the date string
# subtitle: is a string (e.g. 'skyrim')
# content: is also a string (desc of a game)

class App extends React.Component {

  state = { value: 0, previous: 0 };

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
      <HorizontalTimelineContent content={this.data} />
    );
  }
}
```

###Todo
- ~~Start using react-motion to simplify code a bit.~~
- ~~Arrows on the buttons on either side.~~
- ~~Start using some solution for css (e.g. ReactCSS, ReactStyle, etc..).~~
- Make it more customizable.
- Improve the structure.
- better prop options/handling.
- Make someone use it. :D


####Here is the information provided by the original author.

An easy to customize, horizontal timeline powered by CSS and jQuery.

[Article on CodyHouse](http://codyhouse.co/gem/horizontal-timeline/)

[Demo](https://codyhouse.co/demo/horizontal-timeline/index.html)

[Terms](http://codyhouse.co/terms/)
