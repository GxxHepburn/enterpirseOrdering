// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTime: '',
    no: ''
  },
  onTap () {
    if (this.data.no !== '') {
      // 提示，已取号，请不要重复取号
      wx.showToast({
        title: '已取号，请不要重复取号',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 提示，您已成功取号
      wx.showToast({
        title: '取号成功',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        no: '001'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
    var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var year = date.getFullYear()
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[date.getDay()]
    this.setData({
      nowTime: year+'年'+month+'月'+day+'日'+' '+week
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})