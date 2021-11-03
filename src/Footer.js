import React from 'react';

import {NETWORK} from './config';
import SocialMedia from './SocialMedia';

const year = () => new Date().getFullYear();

function getPrivacyURL(NETWORK) {
  let privacyUrl = 'https://www.flamingodao.xyz/privacy';

  switch (NETWORK) {
    case 'rinkeby':
    case 'ropsten':
      privacyUrl = 'https://develop.flamingodao.xyz/privacy';
      break;
    default:
  }
  return privacyUrl;
}

export default function Footer() {
  const orgDocsURL = 'https://docs.flamingodao.xyz/';
  const orgIncName = 'Flamingo DAO, LLC';
  const orgPrimaryContactEmail = 'hello@flamingodao.xyz';
  const orgPrivacyURL = getPrivacyURL(NETWORK);

  return (
    <footer className={`wrap org-footer-wrap grid--fluid`}>
      <div className="grid__row">
        <div className={`left grid__col-lg-6 grid__col-12`}>
          <span className={`item org-footer-item`}>
            <span className={'copyright-symbol org-copyright-symbol'}>
              &copy;
            </span>{' '}
            {year()} {orgIncName}
          </span>
          <a
            className={`item org-footer-item`}
            href={orgDocsURL}
            target="_blank"
            rel="noopener noreferrer">
            Help
          </a>
          <a className={`item org-footer-item`} href={orgPrivacyURL}>
            Privacy
          </a>
          <a
            className={`item org-footer-item`}
            href={`mailto:${orgPrimaryContactEmail}`}
            target="_blank"
            rel="noopener noreferrer">
            Message Us
          </a>
        </div>

        <div className={`right grid__col-lg-6 grid__col-12`}>
          <SocialMedia />
        </div>
      </div>
    </footer>
  );
}
