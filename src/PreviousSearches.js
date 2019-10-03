import React from 'react';
import PreviousSearch from './PreviousSearch';

export default function PreviousSearches(props) {
  return (
    <div>
      <p>Previous Searches<i className="fas fa-times" onClick={props.onShowPrevious}></i></p>
      {props.previousSearches.map((term) => {
        return <PreviousSearch term={term} onLoadPrevious={props.onLoadPrevious} key={Math.random()} />
      })}
    </div>
  );
}
