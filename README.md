#React Horizontal Timeline
A react port of the horizontal timeline developed by CodyHouse.
Here is a [demo] (http://jck-d-rpr.github.io/react-horizontal-timeline) I hope you too are a fan of the elder scrolls.

###Usage
The file in [src/Components/HorizontalTimeline](https://github.com/jck-d-rpr/react-horizontal-timeline/blob/master/src/Components/HorizontalTimeline.js) is what you are looking for.

This is how it can be used.
```
.
.
<HorizontalTimeline values={ /* The array of dates that you want to apper on the timeline */ }
  indexClick={ /* The function that should be triggered when that particular date is clicked (identification by index) */ }
  eventsMinDistance={ /* OPTIONAL: Sets the mininum distance between events */ } />
```

###Todo
- Start using some solution for css (e.g. ReactCSS, ReactStyle, etc..)
- Start using react-motion to simplify code a bit.


####Here is the information provided by the original author.

An easy to customize, horizontal timeline powered by CSS and jQuery.

[Article on CodyHouse](http://codyhouse.co/gem/horizontal-timeline/)

[Demo](https://codyhouse.co/demo/horizontal-timeline/index.html)

[Terms](http://codyhouse.co/terms/)
