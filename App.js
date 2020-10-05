import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import Home from './pages/Home';
import FindMe from './pages/FindMe';
import aboutus from './pages/aboutus';

const navigator =  createStackNavigator (
  {
  Home:{screen: Home},
  FindMe:{screen: FindMe},
  About_us: { screen: aboutus },
});

export default createAppContainer(navigator);