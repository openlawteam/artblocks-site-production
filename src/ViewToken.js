import React, {Component} from 'react';
import {
  Card,
  Button,
  CardDeck,
  Row,
  Col,
  ButtonGroup,
  Tooltip,
  OverlayTrigger,
  Image,
  Alert,
  Container,
  Modal,
} from 'react-bootstrap';
import {TwitterIcon, TwitterShareButton} from 'react-share';
import TextTruncate from 'react-text-truncate';
import {Link} from 'react-router-dom';
import {
  getCanvasStyleAttribute,
  getTokenDetails,
  renderGenerator,
  liveRenderUrl,
  staticRenderGenerator,
} from './utils';
import {formatEthereumAddress} from './utils';
// import OpenSeaImage from './assets/images/os_logo.png';

import './ProjectGallery.css';

class ViewToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenURIInfo: '',
      token: this.props.token,
      embed: false,
      showReadMoreModal: false,
    };
    this.handleClickEmbed = this.handleClickEmbed.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.viewTokenRef = React.createRef();
    this.loadCanvasStyleListener = this.loadCanvasStyleListener.bind(this);
  }

  async componentDidMount() {
    try {
      const artBlocks = this.props.artBlocks;
      const projectId = await artBlocks.methods
        .tokenIdToProjectId(this.props.token)
        .call();
      // const projectTokenInfo = await artBlocks.methods
      //   .projectTokenInfo(this.props.project)
      //   .call();
      // const projectTokens = Array.from(
      //   Array(projectTokenInfo.invocations).keys()
      // );
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
      const ownerOfToken = await artBlocks.methods
        .ownerOf(this.props.token)
        .call();

      // isolate try-catch
      try {
        const {features} = await getTokenDetails(
          projectURIInfo,
          this.props.token
        );

        this.setState({
          features,
        });
      } catch (error) {}

      const srcDocument = await renderGenerator(this.props.token);

      this.setState({
        artBlocks,
        //projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        projectURIInfo,
        projectId,
        ownerOfToken,
        srcDocument,
        // prettyIdentifier,
        // tokenHashes,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleClickEmbed() {
    let embed = this.state.embed;
    this.setState({embed: !embed});
  }

  closeModal() {
    this.setState({
      showReadMoreModal: false,
    });
  }

  loadCanvasStyleListener() {
    const node = this.viewTokenRef.current;
    const iframeStyle = getCanvasStyleAttribute(node);

    this.setState({
      iframeStyle,
    });
  }

  render() {
    let hyperRainbow = false;

    if (
      this.state.tokenHashes &&
      this.state.projectId &&
      this.state.projectId === '0'
    ) {
      let tokenData = this.state.tokenHashes;
      let numHashes = tokenData.length;
      let hashPairs = [];
      for (let i = 0; i < numHashes; i++) {
        for (let j = 0; j < 32; j++) {
          hashPairs.push(tokenData[i].slice(2 + j * 2, 4 + j * 2));
        }
      }
      let decPairs = hashPairs.map((x) => {
        return parseInt(x, 16);
      });
      if (decPairs[28] < 3) {
        hyperRainbow = true;
      }
    }

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

    return (
      <div ref={this.viewTokenRef} className="section-wrapper">
        <div className="content-wrapper">
          <Row>
            <Col xs={12} md={6} className="my-auto">
              {this.state.projectDescription && (
                <div className="view-token">
                  <h3>
                    {this.state.projectDescription[0]} #
                    {Number(this.state.token) -
                      Number(this.state.projectId) * 1000000}
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
                    <TextTruncate
                      line={4}
                      element="span"
                      truncateText="…"
                      text={this.state.projectDescription[2]}
                      textTruncateChild={
                        <span
                          className="readmore-ellipsis"
                          onClick={() => {
                            this.setState({
                              showReadMoreModal: true,
                            });
                          }}>
                          read more
                        </span>
                      }
                    />
                  )}

                  <br />
                  <br />

                  {this.state.ownerOfToken && (
                    <div>
                      <p>
                        Owned by{' '}
                        <Link to={'/user/' + this.state.ownerOfToken}>
                          {this.state.prettyIdentifier
                            ? this.state.prettyIdentifier
                            : formatEthereumAddress(this.state.ownerOfToken)}
                        </Link>{' '}
                        {/* <a
                          href={tokenOSURL(this.props.token)}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Image width="50" src={OpenSeaImage} />
                        </a> */}
                      </p>

                      {this.state.features &&
                      Object.keys(this.state.features).length > 0 ? (
                        <div>
                          <Alert variant="info">
                            <p>Features</p>
                            <Container>
                              {Object.keys(this.state.features).map(
                                (feature, index) => {
                                  return (
                                    <Row key={index}>
                                      <p
                                        style={{
                                          fontSize: '12px',
                                          lineHeight: '1px',
                                        }}
                                        key={index}>
                                        {feature}:{' '}
                                        {this.state.features[feature]}
                                      </p>
                                    </Row>
                                  );
                                }
                              )}
                            </Container>
                          </Alert>
                        </div>
                      ) : null}
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

                  {/* {this.state.projectScriptDetails &&
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
                    )} */}
                  <br />
                  <p>
                    Total Minted:{' '}
                    {
                      /*this.state.projectTokens && this.state.projectTokens.length*/ this
                        .state.projectTokenDetails &&
                        this.state.projectTokenDetails[2]
                    }{' '}
                    out of a maximum of{' '}
                    {this.state.projectTokenDetails &&
                      this.state.projectTokenDetails[3]}
                  </p>

                  <br />
                  <TwitterShareButton
                    url={`${liveRenderUrl(this.state.token)}`}
                    title={`${this.state.projectDescription.artist} | ${this.state.projectDescription.projectName}`}
                    hashtags={['genArt', 'flamingodao', 'artblocks', 'flutter']}
                    via={'FLAMINGODAO'}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </div>
              )}
            </Col>
            <Col xs={12} md={6}>
              <CardDeck className="col d-flex justify-content-center">
                <Card
                  border={hyperRainbow ? 'warning' : ''}
                  className="mt-4"
                  style={{width: '18rem'}}>
                  <Card.Body>
                    {this.props.nonInter.includes(
                      Math.floor(this.props.token / 1000000)
                    ) && (
                      <Image
                        style={{width: '100%'}}
                        src={staticRenderGenerator(this.props.token)}
                        rounded
                      />
                    )}

                    {!this.props.nonInter.includes(
                      Math.floor(this.props.token / 1000000)
                    ) && (
                      <div className="live-script-container">
                        {this.state.srcDocument ? (
                          <iframe
                            title={this.props.token}
                            srcDoc={this.state.srcDocument}
                            sandbox="allow-scripts allow-downloads allow-same-origin"
                            allow="xr-spatial-tracking"
                            allowvr="yes"
                            allowFullScreen
                            onLoad={this.loadCanvasStyleListener}
                            style={this.state.iframeStyle}
                          />
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#fff',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              opacity: this.state.srcDocument ? 0 : 1,
                              transition: 'opacity 1s',
                            }}>
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}
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
                                  staticRenderGenerator(this.state.token),
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
                                  liveRenderUrl(this.state.token),
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
                              to={
                                '/project/' + this.state.projectId + '/gallery'
                              }>
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
        {this.state.showReadMoreModal && (
          <Modal show={this.state.showReadMoreModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {this.state.projectDescription[0]} by{' '}
                {this.state.projectDescription[1]}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{height: '500px', overflowX: 'scroll'}}>
              <p>{this.state.projectDescription[2]}</p>
            </Modal.Body>
          </Modal>
        )}
      </div>
    );
  }
}

export default ViewToken;
