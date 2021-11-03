import React, {Component} from 'react';
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {getMediaURL} from './config';
import './ProjectGallery.css';

class Highlight extends Component {
  constructor(props) {
    super(props);
    this.state = {tokenURIInfo: '', currency: ''};
  }

  async componentDidMount() {
    if (this.props.project === undefined) return;

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

      let currency = await artBlocks.methods
        .projectIdToCurrencySymbol(this.props.project)
        .call();

      this.setState({currency});

      this.setState({
        artBlocks,
        projectTokens,
        projectDescription,
        projectTokenDetails,
        projectScriptDetails,
        projectURIInfo,
        randomToken,
        project: this.props.project,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidUpdate(oldProps) {
    try {
      if (oldProps.project !== this.props.project) {
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

        let currency = await artBlocks.methods
          .projectIdToCurrencySymbol(this.props.project)
          .call();
        this.setState({currency});

        this.setState({
          projectTokens,
          projectDescription,
          projectTokenDetails,
          projectScriptDetails,
          projectURIInfo,
          randomToken,
          project: this.props.project,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const highlightImageToolTip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        This is a randomly selected generative work on the Art Blocks platform!
      </Tooltip>
    );

    const nextHighlight = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Click here to see another random work!
      </Tooltip>
    );

    const seeProject = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Click here to see all of the works generated by the{' '}
        {this.state.projectDescription && this.state.projectDescription[0]}{' '}
        algorithm!
      </Tooltip>
    );

    //let owned = this.state.randomToken && this.props.tokensOfOwner && this.props.tokensOfOwner.includes(this.state.randomToken.toString());

    let baseURL = this.props.baseURL;
    let url = getMediaURL(this.props.network);

    function tokenImage(token) {
      return url + token + '.png';
    }

    function tokenGenerator(token) {
      return baseURL + '/generator/' + token;
    }

    return (
      <div>
        {this.state.randomToken !== undefined && (
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <OverlayTrigger
                placement="top"
                delay={{show: 250, hide: 400}}
                overlay={highlightImageToolTip}>
                <Link to={'/token/' + this.state.randomToken}>
                  {this.props.nonInter.includes(Number(this.props.project)) && (
                    <Image
                      style={{width: '100%'}}
                      src={tokenImage(this.state.randomToken)}
                      rounded
                    />
                  )}
                  {!this.props.nonInter.includes(
                    Number(this.props.project)
                  ) && (
                    <div className="live-script-container">
                      <iframe
                        src={tokenGenerator(this.state.randomToken)}
                        title={this.state.randomToken}
                      />
                    </div>
                  )}
                </Link>
              </OverlayTrigger>
            </Col>
            <Col xs={12} md={5}>
              <Container className="org-secondary-alert show">
                <div className="mt-2 mb-2">
                  <OverlayTrigger
                    placement="left"
                    delay={{show: 250, hide: 400}}
                    overlay={seeProject}>
                    <Link to={'/project/' + this.props.project}>
                      <h5>
                        {this.state.projectDescription &&
                          this.state.projectDescription[0]}
                      </h5>
                    </Link>
                  </OverlayTrigger>

                  <h6>
                    {this.state.projectDescription &&
                      this.state.projectDescription[1]}
                  </h6>
                  <br />
                  <p>
                    #
                    {Number(this.state.randomToken) -
                      Number(this.state.project) * 1000000}{' '}
                    of{' '}
                    {this.state.projectTokens &&
                      this.state.projectTokens.length}{' '}
                    minted (
                    {this.state.projectTokenDetails &&
                      this.state.projectTokenDetails[3]}{' '}
                    max)
                    <span style={{float: 'right'}}>
                      {this.state.projectTokenDetails &&
                        this.props.web3.utils.fromWei(
                          this.state.projectTokenDetails[1],
                          'ether'
                        )}
                      {this.state.currency && this.state.currency === 'ETH'
                        ? 'Ξ'
                        : ' ' + this.state.currency}
                    </span>
                  </p>
                </div>
              </Container>
            </Col>
            {this.props.allProjects.length > 1 && (
              <Col>
                <OverlayTrigger
                  placement="top"
                  delay={{show: 250, hide: 400}}
                  overlay={nextHighlight}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      this.props.handleNextProject();
                    }}>
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      className="bi bi-arrow-right"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </Button>
                </OverlayTrigger>
              </Col>
            )}
          </Row>
        )}
        <hr />
      </div>
    );
  }
}

export default Highlight;
