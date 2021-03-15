import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center'
  }
};

export default function Loading({ text = 'Loading', speed = 300 }) {
  const [ content, setContent ] = useState( text );
  const id = useRef( null );

  const clear = () => window.clearInterval( id.current );

  useEffect( () => {
    id.current = window.setInterval( () => {
      setContent( content => {
        return content === `${text}...` ? text : `${content}.`;
      } )
    }, speed )

    return clear;
  }, [ speed ] );

  return (
    <p style={styles.content}>
      {content}
    </p>
  );
}
