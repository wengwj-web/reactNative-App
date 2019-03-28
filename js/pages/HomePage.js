/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator'
import PopularPage from './PopularPage'
import FavoritePage from './FavoritePage'
// import AsyncStorageTest from '../../test/AsyncStorageTest'
import MyPage from './my/MyPage';
import Toast, { DURATION } from 'react-native-easy-toast';
// import WebViewTest from '../../test/WebViewTest'
import codePush from 'react-native-code-push'
// import TrendingTest from '../../test/TrendingTest'
import TrendingPage from '../pages/TrendingPage'
import NavigatorUtil from '../util/NavigatorUtil'
import BaseComponent from './BaseComponent'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import ThemeFactory, { ThemeFlags } from '../../res/styles/ThemeFactory'
export const ACTION_HOME = {
  A_SHOW_TOAST: 'showToast',
  A_RESTART: 'restart',
  A_THEME: 'theme', A_HOME_TAB_SELECT: 'home_tab_select'
}
export const FLAG_TAB = {
  flag_popularTab: 'tb_popular',
  flag_trendingTab: 'tb_trending',
  flag_favoriteTab: 'tb_favorite',
  flag_my: 'tb_my'
}
export const EVENT_TYPE_HOME_TAB_SELECT = "home_tab_select"
export default class HomePage extends BaseComponent {
  constructor(props) {
    super(props)
    // let selectedTab = this.props.selectedTab ? this.props.selectedTab : 'tb_popular'
    this.params = this.props.navigation.state.params
    let selectedTab = this.params.selectedTab ? this.params.selectedTab : 'tb_popular'
    this.state = {
      selectedTab: selectedTab,
      theme: this.params.theme || ThemeFactory.createTheme(ThemeFlags.Default)
    }
  }
  componentDidMount() {
    // this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
    //   this.toast.show(text, DURATION.LENGTH_LONG)
    // })
    super.componentDidMount()
    this.listener = DeviceEventEmitter.addListener('ACTION_HOME', (action, params) =>
      this.onAction(action, params)
    )
    this.update()
  }
  /**
   * 向codepush服务器检查更新
   */
  update() {
    codePush.sync({
      updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix: '更新内容',
        title: '更新',
        mandatoryUpdateMessage: '',
        mandatoryContinueButtonLabel: '更新',
      },
      mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
      // deploymentKey: CODE_PUSH_PRODUCTION_KEY,
    });
  }
  /**
   * 通知回调事件处理
   * @param {*} action 
   * @param {*} params 
   */
  onAction(action, params) {
    if (ACTION_HOME.A_RESTART === action) {
      this.onRestart(params)
    } else if (ACTION_HOME.A_SHOW_TOAST === action) {
      this.toast.show(params.text, DURATION.LENGTH_LONG)
    }
  }
  /**
   * 重启首页
   * @param {*} jumpToTab 默认显示的页面 
   */
  onRestart(jumpToTab) {
    // this.props.navigator.resetTo({
    //   component: HomePage,
    //   params: {
    //     ...this.props,
    //     selectedTab: jumpToTab
    //   }
    // })
    NavigatorUtil.resetToHomePage({
      ...this.params,
      selectedTab: jumpToTab,
      navigation: this.props.navigation
    })
  }
  componentWillUnmount() {
    super.componentWillUnmount()
    this.listener && this.listener.remove()
  }
  _renderTab(Component, selectedTab, title, renderIcon) {
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectedTab}
        selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
        title={title}
        renderIcon={() => <Image style={styles.image}
          source={renderIcon} />}
        renderSelectedIcon={() => <Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
          source={renderIcon} />}
        onPress={() => this.onTabClick(this.state.selectedTab, selectedTab)}
      >
        <Component {...this.props} theme={this.state.theme} />
      </TabNavigator.Item>
    )
  }
  onTabClick(from, to) {
    this.setState({ selectedTab: to })
    DeviceEventEmitter.emit(EVENT_TYPE_HOME_TAB_SELECT, from, to)
  }
  render() {
    const Root = <SafeAreaViewPlus
      topColor={this.state.theme.themeColor}
      bottomInset={false}
    >
      <TabNavigator>
        {/* <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_popular'}
            selectedTitleStyle={{ color: '#2196f3' }}
            title="最热"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: '#2196f3' }]} source={require('../../res/images/ic_polular.png')} />}
            badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tb_popular' })}>
            <PopularPage {...this.props} />
          </TabNavigator.Item> */}
        {this._renderTab(PopularPage, FLAG_TAB.flag_popularTab, '最热', require('../../res/images/ic_polular.png'))}
        {this._renderTab(TrendingPage, FLAG_TAB.flag_trendingTab, '趋势', require('../../res/images/ic_trending.png'))}
        {this._renderTab(FavoritePage, FLAG_TAB.flag_favoriteTab, '收藏', require('../../res/images/ic_favorite.png'))}
        {this._renderTab(MyPage, FLAG_TAB.flag_my, '我的', require('../../res/images/ic_my.png'))}
      </TabNavigator>
      <Toast ref={toast => this.toast = toast} />
    </SafeAreaViewPlus>
    return Root;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page1: {
    flex: 1,
    backgroundColor: 'red'
  },
  page2: {
    flex: 1,
    backgroundColor: 'yellow'
  },
  image: {
    height: 22,
    width: 22
  }
});

