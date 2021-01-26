import React from 'react';
import './Shadow.css';

class Shadow extends React.Component {
  render(){
    return(
      <div 
        className="shadow" 
        onClick={this.props.close}
      />
    )
  }
}

export default Shadow;
