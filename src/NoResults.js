import React from 'react';

export default function NoResults(props) {
  return (
    <div id="error">
      <i className="fas fa-sad-cry"></i><br/>
      Darn, there are no results for your search...<br/>
      Try again!
    </div>
  );
}
