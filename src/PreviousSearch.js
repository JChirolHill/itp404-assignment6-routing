import React from 'react';

export default function PreviousSearch(props) {
  return (
    <div className="previousSearch">
      <button type="button" onClick={props.onLoadPrevious.bind(this, props.term, false)}>
        {props.term}
      </button>
    </div>
  );
}
