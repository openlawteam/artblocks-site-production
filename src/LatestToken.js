import React, {Component} from 'react';
import {Image} from 'react-bootstrap';

import {
  shouldShowNonInteractive,
  renderGenerator,
  staticRenderGenerator,
} from './utils';
import './Project.css';

class LatestToken extends Component {
  constructor(props) {
    super(props);
    this.state = {tokenId: '', srcDocument: ''};
  }

  async componentDidMount() {
    try {
      const tokenId =
        (this.props.complete ? this.props.random : this.props.latest) +
        this.props.project * 1000000;

      const srcDocument = await renderGenerator(tokenId);

      this.setState({
        tokenId,
        srcDocument,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidUpdate(oldProps) {
    if (
      oldProps.project !== this.props.project ||
      oldProps.latest !== this.props.latest
    ) {
      try {
        const tokenId =
          (this.props.complete ? this.props.random : this.props.latest) +
          this.props.project * 1000000;

        const srcDocument = await renderGenerator(tokenId);

        this.setState({
          tokenId,
          srcDocument,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  render() {
    return (
      <div className="text-center">
        <a href={`/token/${this.state.tokenId}`}>
          {!shouldShowNonInteractive(Number(this.props.project)) ? (
            <div className="live-view-container">
              <div className="live-script-container">
                {this.state.srcDocument ? (
                  <iframe
                    title="Project Live View"
                    srcDoc={this.state.srcDocument}
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
            </div>
          ) : (
            <Image
              style={{width: '60%'}}
              src={staticRenderGenerator(this.state.tokenId)}
            />
          )}
        </a>
      </div>
    );
  }
}

export default LatestToken;
