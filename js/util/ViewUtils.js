import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

export default class ViewUtils extends Component {
  /**
   * 获取设置页的item
   * @param {*} callBack 单击item的回调 
   * @param {*} icon 左侧图标
   * @param {*} text 显示的文本
   * @param {*} tintStyle  图标着色
   * @param {*} expandableicon 右侧图标
   */
  static getSettingItem(callBack, icon, text, tintStyle, expandableicon) {
    return <TouchableHighlight
      onPress={callBack}
    >
      <View style={styles.item}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            resizeMode='stretch'
            style={[{ width: 16, height: 16, marginRight: 10 }, tintStyle]}
            source={icon}></Image>
          <Text>{text}</Text>
        </View>
        <Image
          style={[{
            marginRight: 10,
            height: 22,
            width: 22,
          }, tintStyle]}
          source={expandableicon ? expandableicon : require('../../res/images/ic_tiaozhuan.png')} />
      </View>
    </TouchableHighlight>
  }
  static getLeftButton(callBack) {
    return <TouchableOpacity
      style={{ padding: 8 }}
      onPress={callBack}
    >
      <Image style={{ width: 26, height: 26, tintColor: 'white' }}
        source={require('../../res/images/ic_arrow_back_white_36pt.png')}
      />
    </TouchableOpacity>
  }
  static getRightButton(title, callBack) {
    return <TouchableOpacity
      style={{ alignItems: 'center', }}
      onPress={callBack}>
      <View style={{ marginRight: 10 }}>
        <Text style={{ fontSize: 20, color: '#FFFFFF', }}>{title}</Text>
      </View>
    </TouchableOpacity>
  }
  /**
    * 获取更多按钮
    * @param callBack
    * @returns {XML}
    */
  static getMoreButton(callBack) {
    return <TouchableHighlight
      underlayColor={'transparent'}
      ref="moreMenuButton"
      style={{ padding: 5 }}
      onPress={callBack}
    >
      <View style={{ paddingRight: 8 }}>
        <Image
          style={{ width: 24, height: 24, }}
          source={require('../../res/images/ic_more_vert_white_48pt.png')}
        />
      </View>
    </TouchableHighlight>
  }

  /**
    * 获取分享按钮
    * @param callBack
    * @returns {XML}
    */
  static getShareButton(callBack) {
    return <TouchableHighlight
      underlayColor={'transparent'}
      onPress={callBack}
    >
      <Image
        style={{ width: 20, height: 20, opacity: 0.9, marginRight: 10, tintColor: 'white' }}
        source={require('../../res/images/ic_share.png')} />
    </TouchableHighlight>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 29
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60,
    backgroundColor: '#ffffff'
  }
})