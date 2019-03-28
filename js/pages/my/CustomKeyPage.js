
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Alert,
  DeviceEventEmitter
} from 'react-native'
import CheckBox from 'react-native-check-box'
import NavigationBar from '../../common/NavigationBar'
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import ViewUtils from '../../util/ViewUtils'
import { ACTION_HOME, FLAG_TAB } from '../HomePage'
import BackPressComponent from '../../common/BackPressComponent'
import NavigatorUtil from '../../util/NavigatorUtil'
import  SafeAreaViewPlus from '../../common/SafeAreaViewPlus'

export default class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params
    this.changeValues = [];
    this.isRemoveKey = this.params.isRemoveKey ? true : false;
    this.state = {
      dataArray: []
    }
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
  }

  componentDidMount() {
    this.languageDao = new LanguageDao(this.params.flag);
    this.loadData();
    this.backPress.componentDidMount();
  }
  onBackPress(e) {
    this.onBack();
    return true;
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
    if (this.params.onUpdateFavorite) this.params.onUpdateFavorite();
  }

  loadData() {
    this.languageDao.fetch().then((data) => {
      this.setState({
        dataArray: data
      })
    }).catch((error) => {
      console.log(error);
    });
  }

  onClick(data) {
    if (!this.isRemoveKey) data.checked = !data.checked;
    ArrayUtils.updateArray(this.changeValues, data)
  }

  onSave() {
    if (this.changeValues.length === 0) {
      NavigatorUtil.goBack(this.props.navigation)
      return;
    }
    if (this.isRemoveKey) {
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
      }
    }
    this.languageDao.save(this.state.dataArray);
    // this.params.navigator.pop();
    var jumpToTab = this.params.flag === FLAG_LANGUAGE.flag_key ?
      FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab
    DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART, jumpToTab)
  }

  onBack() {
    if (this.changeValues.length > 0) {
      Alert.alert(
        '提示',
        '是否保存修改?',
        [
          {
            text: '否', onPress: () => {
              NavigatorUtil.goBack(this.props.navigation)
            }
          }, {
            text: '是', onPress: () => {
              this.onSave();
            }
          }
        ]
      )
    } else {
      NavigatorUtil.goBack(this.props.navigation)
    }
  }

  renderView() {
    if (!this.state.dataArray || this.state.dataArray.length === 0) return;
    var len = this.state.dataArray.length;
    var views = [];
    for (var i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(this.state.dataArray[i])}
            {this.renderCheckBox(this.state.dataArray[i + 1])}
          </View>
          <View style={styles.line} />
        </View>
      )
    }
    views.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
          {this.renderCheckBox(this.state.dataArray[len - 1])}
        </View>
      </View>
    )
    return views;

  }

  renderCheckBox(data) {
    let leftText = data.name;
    let isChecked = this.isRemoveKey ? false : data.checked;
    return (
      <CheckBox
        style={{ flex: 1, padding: 10 }}
        onClick={() => this.onClick(data)}
        isChecked={isChecked}
        leftText={leftText}
        checkedImage={<Image source={require('../../pages/my/img/ic_check_box.png')}
          style={this.params.theme.styles.tabBarSelectedIcon} />}
        unCheckedImage={<Image source={require('../../pages/my/img/ic_check_box_outline_blank.png')}
          style={this.params.theme.styles.tabBarSelectedIcon} />}
      />);
  }

  render() {
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    let title = this.isRemoveKey ? '标签移除' : '自定义标签';
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    let navigationBar =
      <NavigationBar
        title={title}
        leftButton={ViewUtils.getLeftButton(() => this.onBack())}
        style={this.params.theme.styles.navBar}
        rightButton={ViewUtils.getRightButton(rightButtonTitle, () => this.onSave())} />;
    return (
      <SafeAreaViewPlus 
        style={styles.container}
        topColor={this.params.theme.themeColor}
      >
        {navigationBar}
        <ScrollView>
          {this.renderView()}
        </ScrollView>
      </SafeAreaViewPlus>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2f2'
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
})