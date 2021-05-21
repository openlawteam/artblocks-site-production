import React from 'react';

import DiscordSVG from './assets/svg/DiscordSVG';
import GitHubSVG from './assets/svg/GitHubSVG';
import MediumSVG from './assets/svg/MediumSVG';
import TelegramSVG from './assets/svg/TelegramSVG';
import TwitterSVG from './assets/svg/TwitterSVG';

export default function SocialMedia() {
  const orgTwitterURL = 'https://twitter.com/FLAMINGODAO';
  const orgGithubURL = '';
  const orgMediumURL = 'https://medium.com/@FLAMINGODAO';
  const orgTelegramURL = 'https://t.me/joinchat/FLvdBBVz3o9pfi-rfd9BqQ';
  const orgDiscordURL = 'https://discord.gg/yZ6BPxkWfj';

  return (
    <div className={`social-media-wrapper org-social-media-wrapper`}>
      {orgTwitterURL && (
        <a href={orgTwitterURL} target="_blank" rel="noopener noreferrer">
          <TwitterSVG />
        </a>
      )}
      {orgGithubURL && (
        <a href={orgGithubURL} target="_blank" rel="noopener noreferrer">
          <GitHubSVG />
        </a>
      )}
      {orgMediumURL && (
        <a href={orgMediumURL} target="_blank" rel="noopener noreferrer">
          <MediumSVG />
        </a>
      )}
      {orgTelegramURL && (
        <a href={orgTelegramURL} target="_blank" rel="noopener noreferrer">
          <TelegramSVG />
        </a>
      )}
      {orgDiscordURL && (
        <a href={orgDiscordURL} target="_blank" rel="noopener noreferrer">
          <DiscordSVG />
        </a>
      )}
    </div>
  );
}
