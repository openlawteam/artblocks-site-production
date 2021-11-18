import React, {Component} from 'react';
import {Image} from 'react-bootstrap';

import {
  shouldShowNonInteractive,
  tokenHighlightImage,
  renderGenerator,
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

  render() {
    return (
      <div className="text-center">
        <a href={`/token/${this.state.tokenId}`}>
          {!shouldShowNonInteractive(Number(this.props.project)) ? (
            <div className="live-view-container">
              <div className="live-script-container">
                <iframe
                  title="Project Live View"
                  srcDoc={this.state.srcDocument}
                />
              </div>
            </div>
          ) : (
            <Image
              style={{width: '60%'}}
              src={tokenHighlightImage(this.state.tokenId)}
            />
          )}
        </a>
      </div>
    );
  }
}

export default LatestToken;
