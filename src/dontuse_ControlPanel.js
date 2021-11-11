import React, {Component} from 'react';
import {Button, Form} from 'react-bootstrap';

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      tokenURIInfo: '',
      ineraction: false,
      formValue: '',
      idValue: '',
      newProject: {price: '', dynamic: false},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
  }

  async componentDidMount() {
    //const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;

    this.setState({artBlocks, network});
  }

  handleValueChange(event) {
    this.setState({formValue: event.target.value});
  }

  handleNewProjectValueChange(e, type) {
    if (type === 'price') {
      let newProject = this.state.newProject;
      if (e.target.value > 0) {
        newProject.price = this.props.web3.utils.toWei(e.target.value, 'ether');
        this.setState({newProject});
      }
    } else if (type === 'projectName') {
      let newProject = this.state.newProject;
      newProject.name = e.target.value;
      this.setState({newProject});
    } else if (type === 'artistAddress') {
      let newProject = this.state.newProject;
      newProject.artistAddress = e.target.value;
      this.setState({newProject});
    } else if (type === 'dynamic') {
      let newProject = this.state.newProject;
      newProject.dynamic = e.target.value;
      this.setState({newProject});
    }
  }

  handleIdChange(event) {
    this.setState({idValue: event.target.value});
  }

  async handleChange(e, type) {
    e.preventDefault();
    this.setState({interaction: true});

    if (type === 'newProject') {
      await this.state.artBlocks.methods
        .addProject(
          this.state.newProject.name,
          this.state.newProject.artistAddress,
          this.state.newProject.price,
          this.state.newProject.dynamic
        )
        .send({
          from: this.props.account,
        })
        .once('receipt', (receipt) => {
          this.updateValues();
        })
        .catch((err) => {
          //alert(err);
          this.setState({interaction: false});
        });
      //newProject:{name:'',artist:'',price:'',license:'',scriptType:'',dynamic:false}
    }
  }

  render() {
    return (
      <div>
        <button
          type="button"
          onClick={() => this.props.handleToggleView('off')}
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>

        <h3>Control Panel</h3>
        <div>
          <h3>Add new project</h3>
          <br />
          <Form onSubmit={(e) => this.handleChange(e, 'newProject')}>
            <Form.Group>
              <Form.Label>
                <b>Project Name</b>
              </Form.Label>
              <Form.Control
                onChange={(e) =>
                  this.handleNewProjectValueChange(e, 'projectName')
                }
                type="text"
                step="any"
                placeholder="Enter Project Name"
              />
              <Form.Label>
                <b>Artist Address</b>
              </Form.Label>
              <Form.Control
                onChange={(e) =>
                  this.handleNewProjectValueChange(e, 'artistAddress')
                }
                type="text"
                step="any"
                placeholder="Enter Artist Ethereum Address"
              />
              <Form.Label>
                <b>Price in ETH</b>
              </Form.Label>
              <Form.Control
                onChange={(e) => this.handleNewProjectValueChange(e, 'price')}
                type="number"
                step="any"
                placeholder="Enter Price in ETH"
              />
              <Form.Label>
                <b>Dynamic?</b>
              </Form.Label>
              <br />
              <Form.Check
                name="radioGroup"
                inline
                label="True"
                type="radio"
                value={true}
                onChange={(e) => this.handleNewProjectValueChange(e, 'dynamic')}
              />
              <Form.Check
                name="radioGroup"
                inline
                label="False"
                type="radio"
                value={false}
                onChange={(e) => this.handleNewProjectValueChange(e, 'dynamic')}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <br />
        </div>
      </div>
    );
  }
}

export default ControlPanel;
