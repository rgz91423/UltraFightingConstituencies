import Reactotron from 'reactotron-react-native'
Reactotron
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

import App from './app/pages/router.js';

export default App;