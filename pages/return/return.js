// pages/return/return.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alreadyOrders: [],
    totalPrice: 0,

    returnTotalPrice: 0,
      hasReturn: 0,

    orderSearchId: '',
    orderTime: '',
    tableName: '',
    tabTypeName: '',

    payMethod: '无',
    payStatus: '退款',
    remark: ''
  },

  //计算总价
  countTotalPrice: function() {
    var totalPrice2 = 0;
    for(var i=0; i<this.data.alreadyOrders.length; i++) {
      totalPrice2 += this.data.alreadyOrders[i].num * this.data.alreadyOrders[i].price;
    }
    this.setData({
      totalPrice: totalPrice2.toFixed(2)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      alreadyOrders: app.data.alreadyOrders,
      orderSearchId: app.data.orderSearchId,
      orderTime: app.data.orderTime,
      tableName: app.data.tableName,
      tabTypeName: app.data.tabTypeName,
      remark: app.data.remark,

      returnTotalPrice: app.data.returnTotalPrice,
      hasReturn: app.data.hasReturn,
    });
    this.countTotalPrice();
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