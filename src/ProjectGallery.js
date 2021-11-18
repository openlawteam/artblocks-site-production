import React, {Component} from 'react';
import {Card, Button, CardDeck, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {staticRenderGenerator} from './utils';

import './ProjectGallery.css';

class ProjectGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {tokenURIInfo: ''};
    this.handleNextToken = this.handleNextToken.bind(this);
    this.handlePreviousToken = this.handlePreviousToken.bind(this);
  }

  async componentDidMount() {
    try {
      const artBlocks = this.props.artBlocks;
      const projectTokenInfo = await artBlocks.methods
        .projectTokenInfo(this.props.project)
        .call();
      const projectTokens = Array.from(
        Array(projectTokenInfo.invocations).keys()
      );
      const projectDescription = await artBlocks.methods
        .projectDetails(this.props.project)
        .call();
      const projectTokenDetails = await artBlocks.methods
        .projectTokenInfo(this.props.project)
        .call();
      const projectScriptDetails = await artBlocks.methods
        .projectScriptInfo(this.props.project)
        .call();
      const projectURIInfo = await artBlocks.methods
        .projectURIInfo(this.props.project)
        .call();
      const randomToken =
        projectTokens[Math.floor(Math.random() * projectTokens.length)];
      if (this.props.project >= 3) {
        let currency = await artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        this.setState({currency});
      } else {
        this.setState({currency: 'ETH'});
      }
      this.setState({
        artBlocks,
        projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        projectURIInfo,
        randomToken,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleNextToken() {
    const currentToken = Number(this.state.randomToken);
    const maxToken =
      this.props.project * 1000000 + this.state.projectTokens.length;
    console.log('current ' + currentToken);
    console.log('maxTokens ' + maxToken);
    if (currentToken < maxToken - 1) {
      const nextToken = currentToken + 1;
      this.setState({randomToken: nextToken});
    } else {
      const nextToken = this.props.project * 1000000;
      console.log(nextToken);
      this.setState({randomToken: nextToken.toString()});
    }
  }

  handlePreviousToken() {
    const currentToken = Number(this.state.randomToken);
    const maxToken = this.state.projectTokens.length;
    console.log('current ' + currentToken);
    console.log('maxTokens ' + maxToken);
    if (currentToken > this.props.project * 1000000) {
      const nextToken = (currentToken - 1).toString();
      this.setState({randomToken: nextToken});
    } else {
      const nextToken = this.props.project * 1000000 + maxToken - 1;
      console.log(nextToken);
      this.setState({randomToken: nextToken.toString()});
    }
  }

  render() {
    let owned =
      this.state.randomToken &&
      this.props.tokensOfOwner &&
      this.props.tokensOfOwner.includes(this.state.randomToken.toString());

    console.log('owned? ' + owned);

    return (
      <div className="container mt-5">
        {this.state.randomToken && (
          <div>
            <Row>
              <Col className="my-auto">
                <p>Project {this.props.project}</p>
                {this.state.projectDescription && (
                  <div>
                    <h1>{this.state.projectDescription[0]}</h1>
                    <h3>by {this.state.projectDescription[1]}</h3>
                    <a href={this.state.projectDescription[3]}>
                      {this.state.projectDescription[3]}
                    </a>
                    <br />
                    <br />
                    <p>{this.state.projectDescription[2]}</p>
                    <br />
                    <br />
                    <p>
                      Total Minted:{' '}
                      {this.state.projectTokens &&
                        this.state.projectTokens.length}{' '}
                      /{' '}
                      {this.state.projectTokenDetails &&
                        this.state.projectTokenDetails[3]}
                    </p>
                    <p>
                      Price per token:{' '}
                      {this.state.projectTokenDetails &&
                        this.props.web3.utils.fromWei(
                          this.state.projectTokenDetails[1],
                          'ether'
                        )}
                      {this.state.currency && this.state.currency === 'ETH'
                        ? 'Ξ'
                        : ' ' + this.state.currency}
                    </p>
                    <br />
                    <p>
                      {' '}
                      Displaying token #
                      {this.state.randomToken && this.state.randomToken}
                    </p>
                    <br />
                  </div>
                )}

                <Button
                  className="btn-dark btn-sm"
                  as={Link}
                  to={'/project/' + this.props.project}>
                  Visit Gallery
                </Button>
              </Col>
              <Col>
                <CardDeck className="col d-flex justify-content-center">
                  <Card className="mt-4" style={{width: '18rem'}}>
                    <Card.Header as="h5">
                      {this.state.projectDescription &&
                        this.state.projectDescription[0]}{' '}
                      #
                      {Number(this.state.randomToken) -
                        Number(this.props.project) * 1000000}{' '}
                      {owned ? '(yours)' : ''}
                    </Card.Header>
                    <Card.Body>
                      {this.state.randomToken && (
                        <Card.Img
                          variant="top"
                          src={staticRenderGenerator(this.state.randomToken)}
                        />
                      )}
                      <hr />
                      <div className="text-center">
                        <div className="btn-group special">
                          <Button
                            variant="dark"
                            onClick={this.handlePreviousToken}>
                            Previous
                          </Button>
                          <Button
                            as={Link}
                            to={'/token/' + this.state.randomToken}
                            variant="dark">
                            Details
                          </Button>
                          <Button variant="dark" onClick={this.handleNextToken}>
                            Next
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </CardDeck>
              </Col>
            </Row>
            <br />
            <hr />
          </div>
        )}
      </div>
    );
  }
}

export default ProjectGallery;
