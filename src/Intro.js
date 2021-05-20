import React, {Component} from 'react';
//import {Button} from 'react-bootstrap';

class Intro extends Component {
  render() {
    return (
      <div>
        <h1 className="text-center">
          <b>Creativity in Generative Design</b>
        </h1>
        <h3 className="text-center">
          Hosted immutably on the Ethereum Blockchain
        </h3>
        {/*
      <div className="text-center my-4">
          <Button variant="light" className="mx-1" disabled={true} style={{width:"300px"}}>Creative Coder? (Coming Soon)</Button>
          <Button variant="light" className="mx-1" disabled={true} style={{width:"300px"}}>Learn More (Coming Soon)</Button>
      </div>
      */}
        <hr />
        <p className="text-center">
          Live Projects: {this.props.activeProjects.length} • Total Invocations:
          {this.props.totalInvocations}
        </p>
      </div>
    );
  }
}

export default Intro;
