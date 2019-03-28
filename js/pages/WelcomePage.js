import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
}
  from 'react-native'
import HomePage from './HomePage'
import ThemeDao from '../expand/dao/ThemeDao'
import SplashScreen from 'react-native-splash-screen'
import NavigatorUtil from '../util/NavigatorUtil'
export default class WelcomePage extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    new ThemeDao().getTheme().then((data) => {
      this.theme = data
    })
    this.timer = setTimeout(() => {
      SplashScreen.hide()
      // this.props.navigator.resetTo({
      //   component: HomePage,
      //   params: {
      //     theme: this.theme
      //   }
      // })
      NavigatorUtil.resetToHomePage({
        theme: this.theme,
        navigation:this.props.navigation
      })
    }, 500)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return null
    // <View style={styles.container}>
    //   <NavigationBar
    //     title={'欢迎'}
    //     style={{ backgroundColor: '#6495ED' }}
    //   />
    //   <Text style={styles.tips}>欢迎</Text>
    // </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  tips: {
    fontSize: 29
  }
})