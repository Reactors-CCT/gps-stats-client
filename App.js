import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import Home from './pages/Home';
import FindMe from './pages/FindMe';





const navigator =  createStackNavigator (
  {
  Home:{screen: Home},
  FindMe:{screen: FindMe},
});

export default createAppContainer(navigator);