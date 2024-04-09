import React from 'react';
import ReactDOM from 'react-dom';
import AppClient from './AppClient';

const App = () => {

  return (
    <div>
      <AppClient />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
