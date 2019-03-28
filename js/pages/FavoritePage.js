
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  RefreshControl,
  FlatList,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import { FLAG_STORAGE } from '../expand/dao/DataRepository'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import ActionUtils from '../util/ActionUtils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import MoreMenu, { MORE_MENU } from '../common/MoreMenu'
import ViewUtils from '../util/ViewUtils'
import { FLAG_TAB } from './HomePage'
import ArrayUtils from '../util/ArrayUtils'
import TrendingCell from '../common/TrendingCell';
import BaseComponent from '../pages/BaseComponent'
import CustomThemePage from '../pages/my/CustomTheme'
export default class FavoritePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      theme: this.props.theme,
      customThemeViewVisible: false,
    }
  }

  renderMoreView() {
    let params = { ...this.props, fromPage: FLAG_TAB.flag_popularTab }
    return <MoreMenu
      ref='moreMenu'
      {...params}
      menus={[MORE_MENU.Custom_Theme,
      MORE_MENU.Share,
      MORE_MENU.About_Author, MORE_MENU.About]}
      anchorView={() => this.refs.moreMenuButton}
      onMoreMenuSelect={(e) => {
        if (e === MORE_MENU.Custom_Theme) {
          this.setState({
            customThemeViewVisible: true
          })
        }
      }}
    />
  }
  renderCustomThemeView() {
    return <CustomThemePage
      visible={this.state.customThemeViewVisible}
      {...this.props}
      onClose={() => this.setState({
        customThemeViewVisible: false
      })}
    />
  }
  render() {
    var statusBar = {
      backgroundColor: this.state.theme.themeColor
    }
    let navigationBar =
      <NavigationBar
        title={'收藏'}
        statusBar={statusBar}
        style={this.state.theme.styles.navBar}
        rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
      />;
    let content = <ScrollableTabView
      tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2 }}
      tabBarInactiveTextColor='mintcream'
      tabBarActiveTextColor='white'
      ref="scrollableTabView"
      tabBarBackgroundColor={this.state.theme.themeColor}
      initialPage={0}
      renderTabBar={() => <ScrollableTabBar style={{ height: 40, borderWidth: 0, elevation: 2 }}
        tabStyle={{ height: 39 }} />}
    >

      <FavoriteTab {...this.props} tabLabel='最热' flag={FLAG_STORAGE.flag_popular} />
      <FavoriteTab {...this.props} tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} />
    </ScrollableTabView>
    return <View style={styles.container}>
      {navigationBar}
      {content}
      {this.renderMoreView()}
      {this.renderCustomThemeView()}
    </View>
  }
}
class FavoriteTab extends BaseComponent {
  constructor(props) {
    super(props);
    this.unFavoriteItems = [];
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      projectModels: [],
      isLoading: false,
      favoriteKeys: [],
      theme: this.props.theme
    }
  }
  componentDidMount() {
    super.componentDidMount()
    this.loadData()
  }
  onTabSelected(from, to) {
    if (to === FLAG_TAB.flag_favoriteTab) {
      this.loadData(false)
    }
  }
  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }
  loadData(isShowLoading) {
    if (isShowLoading) {
      this.updateState({
        isLoading: true
      })
    }
    this.favoriteDao.getAllItems().then((items) => {
      var resultData = [];
      for (var i = 0, len = items.length; i < len; i++) {
        resultData.push(new ProjectModel(items[i], true));
      }
      this.setState({
        isLoading: false,
        projectModels: resultData,
      });
    }).catch((error) => {
      this.setState({
        isLoading: false,
      });
    });
  }
  // onSelectRepository(projectModel) {
  //   var item = projectModel.item;
  //   this.props.navigator.push({
  //     title: item.full_name,
  //     component: RepositoryDetail,
  //     params: {
  //       projectModel: projectModel,
  //       parentComponent: this,
  //       flag: FLAG_STORAGE.flag_popular,
  //       ...this.props
  //     },
  //   });
  // }
  /**
   * favoriteIcon单击回调函数
   * @param item
   * @param isFavorite
   */
  onFavorite(item, isFavorite) {
    // var key = this.props.flag === FLAG_STORAGE.flag_popular ?
    //   item.id.toString() : item.fullName
    // if (isFavorite) {
    //   this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    // } else {
    //   this.favoriteDao.removeFavoriteItem(key);
    // }
    ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)
    ArrayUtils.updateArray(this.unFavoriteItems, item)
    if (this.unFavoriteItems.length > 0) {
      if (this.props.flag === FLAG_STORAGE.flag_popular) {
        DeviceEventEmitter.emit('favoriteChanged_popular');
      } else {
        DeviceEventEmitter.emit('favoriteChanged_trending');
      }
    }
  }
  renderRow(data) {
    const projectModel = data.item;
    let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
    let { navigator } = this.props;
    return (
      <CellComponent
        key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        isFavorite={true}
        theme={this.props.theme}
        {...{ navigator }}
        onSelect={() => ActionUtils.onSelectRepository({
          projectModel: projectModel,
          flag: this.props.flag,
          ...this.props,
          onUpdateFavorite: () => this.onUpdateFavorite(),
        })}
        projectModel={projectModel} />
    );
  }
  onRefresh() {
    this.loadData(true);
  }
  render() {
    return <View style={styles.container}>
      <FlatList
        data={this.state.projectModels}
        renderItem={(data) => this.renderRow(data)}
        keyExtractor={item => "" + (item.item.id || item.item.fullName)}
        refreshControl={
          <RefreshControl
            title='Loading...'
            titleColor={this.props.theme.themeColor}
            colors={[this.props.theme.themeColor]}
            refreshing={this.state.isLoading}
            onRefresh={() => this.onRefresh()}
            tintColor={this.props.theme.themeColor}
          />
        }
      />
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 20
  }
})
