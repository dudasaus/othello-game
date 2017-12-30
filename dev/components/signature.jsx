import React from 'react';
import { render } from 'react-dom';

class Signature extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="signature">
        Created by
        <a href="http://austindudas.com" target="_blank">
          Austin Dudas
        </a>
         &nbsp;|&nbsp; 
        <a href="http://creative2017.com" target="_blank">
          #creative2017
        </a>
      </div>
    );
  }
}

module.exports = { Signature };
