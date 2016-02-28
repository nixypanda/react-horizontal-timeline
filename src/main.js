import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';

require('bootstrap-webpack');
require('./css/body.css');

ReactDOM.render(<App />, document.getElementById('react-horizontal-timeline'));
