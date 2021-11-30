import React, {Component} from 'react';
import {liveRenderUrl} from './utils';
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
  Modal,
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {TwitterIcon, TwitterShareButton} from 'react-share';
import TextTruncate from 'react-text-truncate';
import {renderGenerator, staticRenderGenerator, getTokenDetails} from './utils';

import './ProjectGallery.css';

class NewToken extends Component {
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
  }

  async componentDidMount() {
    try {
      const artBlocks = this.props.artBlocks;
      const projectId = await artBlocks.methods
        .tokenIdToProjectId(this.props.token)
        .call();

      const projectTokenInfo = await artBlocks.methods
        .projectTokenInfo(projectId)
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
        projectId,
        projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        projectURIInfo,
        srcDocument,
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

    return (
      <div className="section-wrapper">
        <div className="content-wrapper purchase-container">
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

              {!this.state.projectDescription && (
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
                    opacity: 1,
                    transition: 'opacity 1s',
                  }}>
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}

              {this.state.projectDescription && (
                <div className="purchase-complete">
                  <h3>
                    You just minted {this.state.projectDescription[0]} #
                    {Number(this.props.token) -
                      Number(this.state.projectId && this.state.projectId) *
                        1000000}
                  </h3>
                  <h3>by {this.state.projectDescription[1]}</h3>
                  {this.state.projectDescription[3] && (
                    <a
                      className="project-link"
                      href={this.state.projectDescription[3]}
                      target="_blank"
                      rel="noopener noreferrer">
                      {this.state.projectDescription[3]}
                    </a>
                  )}

                  {this.state.projectDescription[2] && (
                    <>
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
                    </>
                  )}

                  {/* <br />
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
                    )} */}

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
                                    {feature}: {this.state.features[feature]}
                                  </p>
                                </Row>
                              );
                            }
                          )}
                        </Container>
                      </Alert>
                    </div>
                  ) : null}

                  <br />
                  <p className="total-minted">
                    Total Minted:{' '}
                    {this.state.projectTokenDetails &&
                      this.state.projectTokenDetails.invocations}{' '}
                    out of a maximum of{' '}
                    {this.state.projectTokenDetails &&
                      this.state.projectTokenDetails[3]}
                  </p>
                  <br />
                  <TwitterShareButton
                    url={`${staticRenderGenerator(this.state.token)}`}
                    title={
                      'I just minted ' +
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
                        {this.state.srcDocument ? (
                          <iframe
                            srcDoc={this.state.srcDocument}
                            title={this.props.token}
                            sandbox="allow-scripts allow-downloads allow-same-origin"
                            allow="xr-spatial-tracking"
                            allowvr="yes"
                            allowFullScreen
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
                                  staticRenderGenerator(this.props.token),
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
                                  liveRenderUrl(this.props.token),
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

export default NewToken;
