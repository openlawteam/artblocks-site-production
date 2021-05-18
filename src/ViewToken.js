import React, { Component } from "react";
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
} from "react-bootstrap";
import { TwitterShareButton } from "react-twitter-embed";
import { Link } from "react-router-dom";
import { tokenDetailsUrl, reverseResolveEns } from "./utils";
import "./ProjectGallery.css";

class ViewToken extends Component {
  constructor(props) {
    super(props);
    this.state = { tokenURIInfo: "", token: this.props.token, embed: false };
    this.handleClickEmbed = this.handleClickEmbed.bind(this);
  }

  async componentDidMount() {
    console.log("currentNet: " + this.props.network);
    const artBlocks =
      this.props.token < 3000000 ? this.props.artBlocks : this.props.artBlocks2;
    const projectId = await artBlocks.methods
      .tokenIdToProjectId(this.props.token)
      .call();
    const projectTokenInfo = await artBlocks.methods
      .projectTokenInfo(this.props.project)
      .call();
    const projectTokens = Array.from(Array(projectTokenInfo.invocations).keys());
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
    const tokenHashes =
      this.props.token < 3000000
        ? await artBlocks.methods.showTokenHashes(this.props.token).call()
        : await artBlocks.methods.tokenIdToHash(this.props.token).call();
        console.log(tokenHashes);

    let prettyIdentifier;
    try {
      prettyIdentifier = await reverseResolveEns(ownerOfToken, this.props.web3);
    } catch (e) {
      console.log(e);
    }

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
      //projectTokens,
      projectDescription,
      projectTokenDetails,
      projectScriptDetails,
      projectURIInfo,
      projectId,
      ownerOfToken,
      prettyIdentifier,
      tokenHashes,
    });
  }

  handleClickEmbed() {
    let embed = this.state.embed;
    this.setState({ embed: !embed });
  }

  render() {
    let hyperRainbow = false;

    if (
      this.state.tokenHashes &&
      this.state.projectId &&
      this.state.projectId === "0"
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
    console.log(hyperRainbow);

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
          "View all " + this.state.projectDescription[0] + " tokens."}
      </Tooltip>
    );

    const viewEmbedLink = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Copy the below link and paste it in the URL field for embedding in
        virtual platforms like{" "}
        <a
          href="https://www.cryptovoxels.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Cryptovoxels
        </a>
        .
      </Tooltip>
    );

    let highlightImageUrl =
      this.props.network === "rinkeby"
        ? "https://rinkeby.oss.nodechef.com/"
        : "https://mainnet.oss.nodechef.com/";

    function tokenHighlightImage(token) {
      return highlightImageUrl + token + ".png";
    }

    let baseURL = this.props.baseURL;

    function tokenImage(token) {
      //return "https://mainnet.oss.nodechef.com/"+token+".png";
      return baseURL + "/image/" + token;
    }

    function tokenGenerator(token) {
      return baseURL + "/generator/" + token;
    }

    function tokenVox(token) {
      return baseURL + "/vox/" + token;
    }

    function tokenOSURL(token){
      if (token<3000000){
        return "https://opensea.io/assets/0x059edd72cd353df5106d2b9cc5ab83a52287ac3a/"+token;
      } else {
        return "https://opensea.io/assets/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/"+token;
      }
    }
    console.log(tokenOSURL(this.props.token));

    return (
      <div className="container mt-5">
        <Row>
          <Col xs={12} md={6} className="my-auto">
            {this.state.projectDescription && (
              <div>
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
                    rel="noopener noreferrer"
                  >
                    {this.state.projectDescription[3]}
                  </a>
                )}

                <br />
                {this.state.projectDescription[2] && (
                  <p>{this.state.projectDescription[2]}</p>
                )}

                {this.state.ownerOfToken && (
                  <div>
                  <p>
                    Owned by{" "}
                    <Link to={"/user/" + this.state.ownerOfToken}>
                      {this.state.prettyIdentifier
                        ? this.state.prettyIdentifier
                        : this.state.ownerOfToken.slice(0, 10)}
                    </Link>

                  <a
                    href={tokenOSURL(this.props.token)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image width="50" src="/os_logo.png" />
                  </a>
                  </p>
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
                                  fontSize: "12px",
                                  lineHeight: "1px",
                                }}
                                key={index}
                              >
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
                {this.state.projectScriptDetails &&
                  (this.state.projectScriptDetails[0] === "vox" ||
                    this.state.projectScriptDetails[0] === "megavox") && (
                    <div>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 6000 }}
                        overlay={viewEmbedLink}
                      >
                        <Button
                          variant="info btn-sm"
                          onClick={this.handleClickEmbed}
                        >
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
                <br />
                <p>
                  Total Minted:{" "}
                  {/*this.state.projectTokens && this.state.projectTokens.length*/this.state.projectTokenDetails && this.state.projectTokenDetails[2]}{" "}
                  out of a maximum of{" "}
                  {this.state.projectTokenDetails &&
                    this.state.projectTokenDetails[3]}
                </p>

                <br />
                <TwitterShareButton
                  url={
                    this.props.network === "rinkeby"
                      ? "https://rinkeby.artblocks.io/token/" + this.state.token
                      : "https://www.artblocks.io/token/" + this.state.token
                  }
                  options={{
                    text:
                      (this.props.network === "rinkeby" ? "Testnet " : "") +
                      this.state.projectDescription[0] +
                      " #" +
                      (Number(this.state.token) -
                        Number(this.state.projectId) * 1000000) +
                      " by " +
                      this.state.projectDescription[1],
                    via: "artblocks_io",
                  }}
                  hashtags={["genArt"]}
                />

              </div>
            )}
          </Col>
          <Col xs={12} md={6}>
            <CardDeck className="col d-flex justify-content-center">
              <Card
                border={hyperRainbow ? "warning" : ""}
                className="mt-4"
                style={{ width: "18rem" }}
              >
                <Card.Body>
                  {this.props.nonInter.includes(
                    Math.floor(this.props.token / 1000000)
                  ) && (
                    <Image
                      style={{ width: "100%" }}
                      src={tokenImage(this.props.token)}
                      rounded
                    />
                  )}

                  {!this.props.nonInter.includes(
                    Math.floor(this.props.token / 1000000)
                  ) && (
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
                          delay={{ show: 250, hide: 400 }}
                          overlay={viewImageToolTip}
                        >
                          <Button
                            variant="light"
                            onClick={() =>
                              window.open(
                                tokenHighlightImage(this.state.token),
                                "_blank"
                              )
                            }
                          >
                            View Image
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={viewScriptToolTip}
                        >
                          <Button
                            variant="light"
                            onClick={() =>
                              window.open(
                                tokenGenerator(this.state.token),
                                "_blank"
                              )
                            }
                          >
                            Live Script
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={viewGalleryToolTip}
                        >
                          <Button
                            variant="light"
                            as={Link}
                            to={"/project/" + this.state.projectId}
                          >
                            {this.state.projectDescription &&
                              this.state.projectDescription[0]}{" "}
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
        <hr />
      </div>
    );
  }
}

export default ViewToken;
