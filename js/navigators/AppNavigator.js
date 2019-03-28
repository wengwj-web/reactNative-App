import { StackNavigator } from 'react-navigation'
import WelcomePage from '../pages/WelcomePage'
import HomePage from '../pages/HomePage'
import RepositoryDetail from '../pages/RepositoryDetail'
import SearchPage from '../pages/SearchPage'
import FavoritePage from '../pages/FavoritePage'
import WebViewPage from '../pages/WebViewPage'
import CustomKeyPage from '../pages/my/CustomKeyPage'
import CustomTheme from '../pages/my/CustomTheme'
import MyPage from '../pages/my/MyPage'
import SortKeyPage from '../pages/my/SortKeyPage'
import AboutMePage from '../pages/about/AboutMePage'
import AboutPage from '../pages/about/AboutPage'

export default AppNavigator = StackNavigator({
  WelcomePage: {
    screen: WelcomePage
  },
  HomePage: {
    screen: HomePage
  },
  RepositoryDetail: {
    screen: RepositoryDetail
  },
  SearchPage: {
    screen: SearchPage
  },
  FavoritePage: {
    screen: FavoritePage
  },
  CustomKeyPage: {
    screen: CustomKeyPage
  },
  WebViewPage: {
    screen: WebViewPage
  },
  CustomTheme: {
    screen: CustomTheme
  },
  MyPage: {
    screen: MyPage
  },
  SortKeyPage: {
    screen: SortKeyPage
  },
  AboutMePage: {
    screen: AboutMePage
  },
  AboutPage: {
    screen: AboutPage
  },
}, {
    navigationOptions: {
      header: null
    }
  })