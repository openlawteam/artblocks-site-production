import React, {Component} from 'react';
import {tokenDetailsUrl} from './utils';
import {
  Card,
  Button,
  CardDeck,
  Row,
  Col,
  ButtonGroup,
  Tooltip,
  OverlayTrigger,
  Alert,
  Container,
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {TwitterIcon, TwitterShareButton} from 'react-share';
import './ProjectGallery.css';

class NewToken extends Component {
  constructor(props) {
    super(props);
    this.state = {tokenURIInfo: '', token: this.props.token, embed: false};
    this.handleClickEmbed = this.handleClickEmbed.bind(this);
  }

  async componentDidMount() {
    try {
      const artBlocks = this.props.artBlocks;
      const projectId = await artBlocks.methods
        .tokenIdToProjectId(this.props.token)
        .call();
      const projectTokenInfo = await artBlocks.methods
        .projectTokenInfo(this.props.project)
        .call();
      const projectTokens = Array.from(
        Array(projectTokenInfo.invocations).keys()
      );
      const projectDescription = await artBlocks.methods
        .projectDetails(projectId)
        .call();
      const projectTokenDetails = await artBlocks.methods
        .projectTokenInfo(projectId)
        .call();
      const projectScriptDetails = await artBlocks.methods
        .projectScriptInfo(projectId)
        .call();
      const projectURIInfo = await artBlocks.methods
        .projectURIInfo(projectId)
        .call();

      fetch(tokenDetailsUrl(this.props.token))
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          this.setState({
            features: json.features,
          });
        });

      this.setState({
        artBlocks,
        projectId,
        projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        projectURIInfo,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleClickEmbed() {
    let embed = this.state.embed;
    this.setState({embed: !embed});
  }

  render() {
    const viewImageToolTip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        View static rendered image fullscreen.
      </Tooltip>
    );

    const viewScriptToolTip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Visit the live script for this project. The script will run in your
        browser and generate the content in real time. Projects might be
        interactive! Check description panel for more details.
      </Tooltip>
    );

    const viewGalleryToolTip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        {this.state.projectDescription &&
          'View all ' + this.state.projectDescription[0] + ' tokens.'}
      </Tooltip>
    );

    const viewEmbedLink = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Copy the below link and paste it in the URL field for embedding in
        virtual platforms like{' '}
        <a
          href="https://www.cryptovoxels.com"
          rel="noopener noreferrer"
          target="_blank">
          Cryptovoxels
        </a>
        .
      </Tooltip>
    );

    let baseURL = this.props.baseURL;

    function tokenImage(token) {
      return baseURL + '/image/' + token;
    }

    function tokenGenerator(token) {
      return baseURL + '/generator/' + token;
    }

    function tokenVox(token) {
      return baseURL + '/vox/' + token;
    }

    return (
      <div className="section-wrapper">
        <div className="content-wrapper">
          <button
            type="button"
            onClick={() => this.props.handleToggleView('off')}
            className="close"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <Row>
            <Col xs={12} md={6} className="my-auto">
              <h1>Purchase complete!</h1>
              {this.state.projectDescription && (
                <div>
                  <h3>
                    You just minted {this.state.projectDescription[0]} #
                    {Number(this.props.token) -
                      Number(this.state.projectId && this.state.projectId) *
                        1000000}
                  </h3>
                  <h3>by {this.state.projectDescription[1]}</h3>
                  {this.state.projectDescription[3] && (
                    <a
                      href={this.state.projectDescription[3]}
                      target="_blank"
                      rel="noopener noreferrer">
                      {this.state.projectDescription[3]}
                    </a>
                  )}
                  <br />
                  <br />

                  {this.state.projectDescription[2] && (
                    <p>{this.state.projectDescription[2]}</p>
                  )}
                  <br />
                  {this.state.projectScriptDetails &&
                    (this.state.projectScriptDetails[0] === 'vox' ||
                      this.state.projectScriptDetails[0] === 'megavox') && (
                      <div>
                        <OverlayTrigger
                          placement="top"
                          delay={{show: 250, hide: 6000}}
                          overlay={viewEmbedLink}>
                          <Button
                            variant="info btn-sm"
                            onClick={this.handleClickEmbed}>
                            Embed
                          </Button>
                        </OverlayTrigger>
                        {this.state.embed && (
                          <div>
                            <br />
                            <p>{tokenVox(this.state.token)}</p>
                            <br />
                          </div>
                        )}
                      </div>
                    )}

                  {this.state.features && this.state.features.length > 0 ? (
                    <div>
                      <Alert variant="info">
                        <p>Features</p>
                        <Container>
                          {this.state.features.map((feature, index) => {
                            return (
                              <Row key={index}>
                                <p
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '1px',
                                  }}
                                  key={index}>
                                  {feature}
                                </p>
                              </Row>
                            );
                          })}
                        </Container>
                      </Alert>
                    </div>
                  ) : null}
                  {/*
          <p style={{"fontSize":"12px"}}>{this.state.tokenHashes && this.state.tokenHashes.length===1?"Token hash:":"Token hashes:"} {this.state.tokenHashes && this.state.tokenHashes}</p>
          */}
                  <br />
                  <p>
                    Total Minted:{' '}
                    {this.state.projectTokens &&
                      this.state.projectTokens.length}{' '}
                    out of a maximum of{' '}
                    {this.state.projectTokenDetails &&
                      this.state.projectTokenDetails[3]}
                  </p>
                  <br />
                  <TwitterShareButton
                    url={
                      this.props.network === 'rinkeby'
                        ? process.env.REACT_APP_API_URL_RINKEBY +
                          '/token/' +
                          this.state.token
                        : process.env.REACT_APP_API_URL_MAINNET +
                          '/token/' +
                          this.state.token
                    }
                    title={
                      'I just minted ' +
                      (this.props.network === 'rinkeby' ? 'testnet ' : '') +
                      this.state.projectDescription[0] +
                      ' #' +
                      (Number(this.props.token) -
                        Number(this.state.projectId && this.state.projectId) *
                          1000000) +
                      ' by ' +
                      this.state.projectDescription[1] +
                      '!'
                    }
                    hashtags={['genArt', 'flamingodao', 'artblocks', 'flutter']}
                    via={'FLAMINGODAO'}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </div>
              )}
            </Col>
            <Col xs={12} md={6}>
              <CardDeck className="col d-flex justify-content-center">
                <Card className="mt-4" style={{width: '18rem'}}>
                  <Card.Body>
                    {this.props.token && (
                      <div className="live-script-container">
                        <iframe
                          src={tokenGenerator(this.props.token)}
                          title={this.props.token}
                        />
                      </div>
                    )}
                    <hr />
                    <div className="text-center">
                      <div>
                        <ButtonGroup size="md">
                          <OverlayTrigger
                            placement="top"
                            delay={{show: 250, hide: 400}}
                            overlay={viewImageToolTip}>
                            <Button
                              variant="light"
                              onClick={() =>
                                window.open(
                                  tokenImage(this.props.token),
                                  '_blank'
                                )
                              }>
                              View Image
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{show: 250, hide: 400}}
                            overlay={viewScriptToolTip}>
                            <Button
                              variant="light"
                              onClick={() =>
                                window.open(
                                  tokenGenerator(this.props.token),
                                  '_blank'
                                )
                              }>
                              Live Script
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{show: 250, hide: 400}}
                            overlay={viewGalleryToolTip}>
                            <Button
                              variant="light"
                              as={Link}
                              onClick={() => this.props.handleToggleView('off')}
                              to={'/project/' + this.state.projectId}>
                              {this.state.projectDescription &&
                                this.state.projectDescription[0]}{' '}
                              Gallery
                            </Button>
                          </OverlayTrigger>
                        </ButtonGroup>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </CardDeck>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default NewToken;
