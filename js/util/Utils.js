

export default class Utils {
  /**
   * 检查该Item是否被收藏
   * **/
  static checkFavorite(item, items) {
    for (var i = 0, len = items.length; i < len; i++) {
      let id = item.id ? item.id : item.fullName;
      if (id.toString() === items[i]) {
        return true;
      }
    }
    return false;
  }
   /**
   * 判断数据是否过时
   * @param {*} longTime 数据的时间戳 
   */
  static checkDate(longTime) {
    let cDate = new Date()
    let tDate = new Date()
    tDate.setTime(longTime)
    if (cDate.getMonth() !== tDate.getMonth()) return false
    if (cDate.getDay() !== tDate.getDay()) return false
    if (cDate.getHours() - tDate.getHours() > 4) return false
    return true
  }
}