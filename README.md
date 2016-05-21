#React Horizontal Timeline
[![npm version](https://badge.fury.io/js/react-horizontal-timeline.svg)](https://badge.fury.io/js/react-horizontal-timeline)
[![Build Status](https://travis-ci.org/jck-d-rpr/react-horizontal-timeline.svg?branch=master)](https://travis-ci.org/jck-d-rpr/react-horizontal-timeline)
[![Coverage Status](https://coveralls.io/repos/github/jck-d-rpr/react-horizontal-timeline/badge.svg?branch=master)](https://coveralls.io/github/jck-d-rpr/react-horizontal-timeline?branch=master)
[![Code Climate](https://codeclimate.com/github/jck-d-rpr/react-horizontal-timeline/badges/gpa.svg)](https://codeclimate.com/github/jck-d-rpr/react-horizontal-timeline)
[![Dependency Status](https://david-dm.org/jck-d-rpr/react-horizontal-timeline.svg)](https://david-dm.org/jck-d-rpr/react-horizontal-timeline)
[![devDependency Status](https://david-dm.org/jck-d-rpr/react-horizontal-timeline/dev-status.svg)](https://david-dm.org/jck-d-rpr/react-horizontal-timeline#info=devDependencies)

A react port of the horizontal time-line developed by CodyHouse.
Here is a [demo] (http://jck-d-rpr.github.io/react-horizontal-timeline) I hope you too are a fan of the elder scrolls.

##HorizontalTimeline

It will just render a timeline with the dates that you provided and it is upto you what to do when a date is selected. i.e. it will give you the index of the date that was clicked and you can do anything with it.

Property	       |	Type   	   |	Default	                    |	Description
:------------------|:--------------|:-------------------------------|:--------------------------------
 values            | array         | undefind                       | **sorted** array of dates (**required**)
 indexCLick        | function      | undefind                       | function that takes the index of the array as argument (**required**)
 index             | number        | 0                              | the index of the selected date (useful if you want to control the selected date from outside like in case of react-swipeable-views)
 eventsMinDistance | number        | 80                             | The minimum distance between consecutive events
 fillingMotion     | object        |{ stiffness: 150, damping: 25 } | Sets the animation style of how filling motion will look
 slidingMotion     | object        |{ stiffness: 150, damping: 25 } | Sets the animation style of how sliding motion will look
 styles            | object        |{ background: '#f8f8f8', foreground: '#7b9d6f', outline: '#dfdfdf', maxSize: 800 } | object containging the styles for the timeline currently outline (the color of the boundries of the thimeline and the buttons on it's either side), foreground (the filling color, active color) and background (the background color of your page) colors along with the max length of the timeline can be changed.

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
For more advanced usage take a look at the demos directory.

###Todo
- ~~Start using react-motion to simplify code a bit.~~
- ~~Arrows on the buttons on either side.~~
- ~~Start using some solution for css (e.g. ReactCSS, ReactStyle, etc..).~~
- ~~Make it more customizable.~~
- ~~Improve the structure.~~
- Keyboard movement controls
- Touch controls
- Make someone use it. :D

##Running the developmnt version
- Just clone the repo and do an ```npm install``` followed by an ```npm run start```.
- Then go to ```localhost:5000/demos/<demo_name>/index.html``` to see the fruits of your labor.

####Here is the information provided by the original author.

An easy to customize, horizontal timeline powered by CSS and jQuery.

[Article on CodyHouse](http://codyhouse.co/gem/horizontal-timeline/)

[Demo](https://codyhouse.co/demo/horizontal-timeline/index.html)

[Terms](http://codyhouse.co/terms/)
