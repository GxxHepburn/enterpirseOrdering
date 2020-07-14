// pages/orderConfirm/orderConfirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList:["脉动","脉动","脉动","脉动","脉动","脉动","脉动","脉动","脉动","脉动","脉动","脉动"],
    numberOfDiners: -1,
    tabTypeName: "",
    tableName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //根据app的res和table，请求得tabTypeName，和tabName
    let that = this;
    var app = getApp();
    //请求要携带openid
    wx.request({
      url: app.data.realUrl + '/wechat/loggedIn/getTabNameAndTabTypeName',
      data: {
        openid: app.data.openid,
        table: app.data.table
      },
      method: 'POST',
      success(resMy) {
        var tableName2 = resMy.data.tableName;
        var tabTypeName2 = resMy.data.tabTypeName;
        that.setData({
          tableName: tableName2,
          tabTypeName: tabTypeName2
        });
      }
    });
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