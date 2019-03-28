'use strict';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  DeviceInfo,
  Platform
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../util/ViewUtils'
import RepositoryCell from '../../common/RepositoryCell'
import ActionUtils from '../../util/ActionUtils'
import RepositoryUtils from '../../expand/dao/RepositoryUtils'
import Utils from '../../util/Utils'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import { FLAG_STORAGE } from '../../expand/dao/DataRepository'
import share from '../../../res/data/share.json'
import UShare from '../../common/UShare'
import BackPressComponent from '../../common/BackPressComponent'
import NavigatorUtil from '../../util/NavigatorUtil'
import GlobalStyles from '../../../res/styles/GlobalStyles'

export var FLAG_ABOUT = { flag_about: 'about', flag_about_me: 'about_me' }
export default class AboutCommon {
  constructor(props, updateState, flag_about, config) {
    this.props = props
    this.updateState = updateState
    this.flag_about = flag_about
    this.config = config
    this.repositories = []
    this.repositoryUtils = new RepositoryUtils(this)
    this.favoriteKeys = null
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
  }
  componentDidMount() {
    if (this.flag_about === FLAG_ABOUT.flag_about) {
      this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
    } else {
      var urls = [];
      var items = this.config.items;
      for (let i = 0, l = items.length; i < l; i++) {
        urls.push(this.config.info.url + items[i]);
      }
      this.repositoryUtils.fetchRepositories(urls);
    }
    this.backPress.componentDidMount();
  }
  onBackPress(e) {
    NavigatorUtil.goBack(this.props.navigation)
    return true;
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  /**
   * 通知数据发送改变
   * @param {*} items 改变的数据 
   */
  onNotifyDataChanged(items) {
    this.updateFavorite(items)
  }
  /**
   * 更新项目的用户收藏状态
   * @param {*} repositories 
   */
  async updateFavorite(repositories) {
    if (repositories) this.repositories = repositories;
    if (!this.repositories) return;
    if (!this.favoriteKeys) {
      this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
    }
    let projectModels = [];
    for (let i = 0, l = this.repositories.length; i < l; i++) {
      var data = this.repositories[i];
      var item = data.item ? data.item : data;
      projectModels.push({
        isFavorite: Utils.checkFavorite(item, this.favoriteKeys ? this.favoriteKeys : []),
        item: item,
      })
    }
    console.log(projectModels)
    this.updateState({
      projectModels: projectModels,
    })
  }
  /**
   * favoriteIcon单击回调函数
   * @param item
   * @param isFavorite
   */
  // onFavorite(item, isFavorite) {
  //   if (isFavorite) {
  //     this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
  //   } else {
  //     this.favoriteDao.removeFavoriteItem(item.id.toString());
  //   }
  // }
  /**
   * 创建项目视图
   * @param {*} projectModels 
   */
  onShare() {
    var shareApp;
    if (this.flag_about === FLAG_ABOUT.flag_about_me) {
      shareApp = share.share_app
    } else {
      shareApp = share.share_blog
    }
    UShare.share(shareApp.title, shareApp.content,
      shareApp.imgUrl, shareApp.url, () => { }, () => { })
  }
  renderRepository(projectModels) {
    if (!projectModels || projectModels.length === 0) return null
    let views = []
    for (let i = 0, l = projectModels.length; i < l; i++) {
      let projectModel = projectModels[i]
      views.push(<RepositoryCell
        key={projectModel.item.id}
        projectModel={projectModel}
        theme={this.props.theme}
        onSelect={() => ActionUtils.onSelectRepository({
          projectModel: projectModel,
          ...this.props,
          flag: FLAG_STORAGE.flag_popular
        })}
        // onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)} />)
        onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)} />)
    }
    return views

  }
  getParallaxRenderConfig(params) {
    let config = {}
    config.renderBackground = () => (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT
        }} />
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT
        }} />
      </View>
    )
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={{
          uri: params.avatar,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE
        }} />
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    )
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(() => NavigatorUtil.goBack(this.props.navigation))}
        {ViewUtils.getShareButton(() => this.onShare())}
      </View>
    )
    return config
  }
  render(contentView, params) {
    let renderConfig = this.getParallaxRenderConfig(params)
    return (
      <ParallaxScrollView
        headerBackgroundColor="#333"
        backgroundColor={this.props.theme.themeColor}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...renderConfig}
      >
        {contentView}
      </ParallaxScrollView>
    )
  }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : GlobalStyles.nav_bar_height_android;

const styles = StyleSheet.create({
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0,
    alignItems: 'center',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    paddingTop: (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginBottom: 5,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
});