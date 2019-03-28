import React, { Component } from 'react'
import {
  View,
  WebView
}
  from 'react-native'

import NavigationBar from '../common/NavigationBar'
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtils from '../util/ViewUtils'
import NavigatorUtil from '../util/NavigatorUtil'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'

export default class WebViewPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.state = {
      url: this.params.url,
      title: this.params.title,
      canGoBack: false
    }
  }
  onBackPress() {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigatorUtil.goBack(this.props.navigation)
    }
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack
    })
  }
  render() {
    return (
      <SafeAreaViewPlus
        style={GlobalStyles.root_container}
        topColor={this.params.theme.themeColor}
      >
        <NavigationBar
          navigator={this.props.navigator}
          popEnabled={false}
          style={this.params.theme.styles.navBar}
          leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
          title={this.state.title}
        />
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }} />
      </SafeAreaViewPlus>
    )
  }
}
