/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  DeviceEventEmitter
} from 'react-native';

import { ACTION_HOME,EVENT_TYPE_HOME_TAB_SELECT } from '../pages/HomePage'

export default class BaseComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: this.props.theme
    }
  }
  componentDidMount() {
    this.baseListener = DeviceEventEmitter.addListener('ACTION_BASE', (action, params) =>
      this.onBaseAction(action, params)
    )
    this.homeTabSelectListener = DeviceEventEmitter.addListener(EVENT_TYPE_HOME_TAB_SELECT,
      (from, to) => this.onTabSelected(from, to));
  }
  /**
   * 通知回调事件处理
   * @param {*} action 
   * @param {*} params 
   */
  onBaseAction(action, params) {
    if (ACTION_HOME.A_THEME === action) {
      this.onThemeChaneg(params)
    }
  }

  onTabSelected(from, to) {

  }
  /**
   * 当主题改变后更新主题
   * @param {*} theme 
   */
  onThemeChaneg(theme) {
    if (!theme) return
    this.setState({
      theme: theme
    })
  }
  componentWillUnmount() {
    this.baseListener && this.baseListener.remove()
  }
}


