'use strict';
import React, { Component } from 'react';
import {
  View,
  Linking
} from 'react-native';

import { MORE_MENU } from '../../common/MoreMenu'
import ViewUtils from '../../util/ViewUtils'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import NavigatorUtil from '../../util/NavigatorUtil'
import config from '../../../res/data/config.json'
export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({ ...this.params, navigation: this.params.navigation }, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about, config)
    this.state = {
      projectModels: [],
      author: config.author,
    }
  }
  updateState(dic) {
    this.setState(dic)
  }
  componentDidMount() {
    this.aboutCommon.componentDidMount()
  }
  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount();
  }
  onClick(tab) {
    let TargetComponent, params = { ...this.params, menuType: tab }
    switch (tab) {
      case MORE_MENU.About_Author:
        TargetComponent = 'AboutMePage';
        break;
      case MORE_MENU.Website:
        TargetComponent = 'WebViewPage'
        params.url = 'http://www.devio.org/io/GitHubPopular/'
        params.title = 'GitHubPopular'
        break;
      case MORE_MENU.Feedback:
        var url = 'mailto://crazycodeboy@gmail.com'
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
        break;
    }
    if (TargetComponent) {
      NavigatorUtil.goToMenuPage(params, TargetComponent)
    }
  }
  render() {
    let content = <View>
      {this.aboutCommon.renderRepository(this.state.projectModels)}
      {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Website.name), require('../../../res/images/ic_computer.png'), MORE_MENU.Website.name, this.params.theme.styles.tabBarSelectedIcon)}
      <View style={GlobalStyles.line}></View>
      {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.About_Author.name), require('../my/img/ic_insert_emoticon.png'), MORE_MENU.About_Author.name, this.params.theme.styles.tabBarSelectedIcon)}
      <View style={GlobalStyles.line}></View>
      {ViewUtils.getSettingItem(() => this.onClick(MORE_MENU.Feedback.name), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback.name, this.params.theme.styles.tabBarSelectedIcon)}
      <View style={GlobalStyles.line}></View>
    </View>
    return this.aboutCommon.render(content, {
      'name': 'GitHub Popular',
      'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
      'avatar': this.state.author.avatar1,
      'backgroundImg': this.state.author.backgroundImg1,
    })
  }
}

