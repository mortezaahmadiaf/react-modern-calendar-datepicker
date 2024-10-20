/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../../src/DatePicker.css';
import DatePicker from '../../src';
import * as serviceWorker from './serviceWorker';

const App = () => {
  const today = new Date();
  const [selectedDay, setValue] = useState();
  const [selectedDay1, setValue1] = useState();

  return (
    <div
      id="test"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
      }}
    >
      <DatePicker
        inputClassName={'p-text-end'}
        showSecond={true}
        showTime={true}
        locale={'en'}
        value={selectedDay}
        onChange={setValue}
        shouldHighlightWeekends
      />{' '}
      <div style={{ zIndex: '1000', background: 'red' }}>
        <DatePicker
          showSecond={true}
          showTime={true}
          locale={'fa'}
          value={selectedDay}
          onChange={setValue}
          shouldHighlightWeekends
        />
      </div>{' '}
      <DatePicker
        showSecond={true}
        showTime={true}
        locale={'en'}
        value={selectedDay}
        onChange={setValue}
        shouldHighlightWeekends
      />{' '}
      <DatePicker
        showSecond={true}
        showTime={true}
        locale={'en'}
        value={selectedDay1}
        onChange={setValue1}
        shouldHighlightWeekends
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
