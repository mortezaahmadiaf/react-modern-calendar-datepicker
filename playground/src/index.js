/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../../src/DatePicker.css';
import DatePicker from '../../src';
import * as serviceWorker from './serviceWorker';

const App = () => {
  const [selectedDay, setValue] = useState(null);
  return <div id='test' style={{height:200,background:"red",width:"100%",display:"flex",justifyContent:"end" }}> <DatePicker  locale={'af'} value={selectedDay} onChange={setValue} shouldHighlightWeekends /></div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
