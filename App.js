//importing navigation libraries
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

//importing screens
import Home from './pages/Home';
import FindMe from './pages/FindMe';
import AboutUs from './pages/AboutUs';

//creating navigator
const navigator =  createStackNavigator (
  {
  Home:{screen: Home},
  FindMe:{screen: FindMe},
  AboutUs: { screen: AboutUs },
});

export default createAppContainer(navigator);