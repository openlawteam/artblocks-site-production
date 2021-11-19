# artblocks-site-production

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Make sure and add `REACT_APP_INFURA_KEY=` to .env file

Example, `.env`:

```
REACT_APP_NETWORK=ropsten

REACT_APP_BLOCK_DELAY_INTERVAL=3
REACT_APP_INFURA_KEY=...

REACT_APP_GENERATOR_URL_TESTNET=https://generator-staging.artblocks.io
REACT_APP_GENERATOR_STATIC_URL_TESTNET=https://flamingo-flutter-staging.s3.amazonaws.com

REACT_APP_GENERATOR_URL_MAINNET=...
REACT_APP_GENERATOR_STATIC_URL_MAINNET=...
```

Add the curated project id to the `CURATED` array in `./src/config.js`:

```
export const CURATED = [0, ...];
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the expressjs server (server.js) which serves social media card data for requests.

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Netlify Deployments

Deployments to production and develop environments are handled automatically via Netlify and GH actions:

- `Netlify develop deployment`: push to `flamingoBlocks` branch -> https://develop--flutter-flamingodao.netlify.app

- `Netlify production deployment`: push `v*` tag (will presumably be part of a release) -> https://flutter.flamingodao.xyz

_Note for this deployment implementation with a single default branch (`flamingoBlocks`) to work, the Netlify automatic builds/deploys are stopped (you'll see evidence of that in the [Netlify project UI](https://app.netlify.com/sites/flutter-flamingodao/overview)). They are handled through the GH actions and Netlify CLI. See @note in `netlify.toml` for more info._

For production deployments, simply run `npm run release` and follow the interactive UI in your console. The release script runs [np](https://github.com/sindresorhus/np). We have initially configured `np` (in `package.json`) to automatically handle only versioning, release drafts, and git tagging. We can enable additional features as needed, such as publishing to npm.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
