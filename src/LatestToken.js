import React from 'react';
import {Image} from 'react-bootstrap';

import {
  shouldShowNonInteractive,
  tokenGenerator,
  tokenHighlightImage,
} from './utils';
import './Project.css';

const LatestToken = ({project, complete, random, latest}) => {
  const tokenId = (complete ? random : latest) + project * 1000000;
  const tokenURL = tokenGenerator(tokenId);

  console.log('>>> tokenURL', tokenURL);
  return (
    <div className="text-center">
      <a href={`/token/${tokenId}`}>
        {!shouldShowNonInteractive(Number(project)) ? (
          <div className="live-view-container">
            <div className="live-script-container">
              <iframe src={tokenURL} title="Project Live View" />
            </div>
          </div>
        ) : (
          <Image style={{width: '60%'}} src={tokenHighlightImage(tokenId)} />
        )}
      </a>
    </div>
  );
};

export default LatestToken;
