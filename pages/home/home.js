// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordersList: [],
    nowOrder: [],
    finishedOrder: [],
    allOrder: [],
    returnOrder: [],

    touchedOrderNum: 1
  },
  //头部选择时间
  topTouch: function(e) {
    this.setData({
      touchedOrderNum: e.currentTarget.dataset.index
    });
  },
  //初始化app.js数据
  initApp: function() {
    var app = getApp();
    app.data.numberOfDiners = -1;
    app.data.res = "";
    app.data.table = "";
    app.data.inited = 0;
    app.data.menu = [];
    app.data.menuForNum = [];
    app.data.typeForNum = [];
    app.data.orders = [];
    app.data.totalPrice = [];
    app.data.tableName = [];
    app.data.tabTypeName = '';
    app.data.remark = '';
    app.data.alreadyOrders = [];
    app.data.orderSearchId = '';
    app.data.orderTime = '';
    app.data.isAdd = false;
  },
  //初始化ordersList

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //清空所有其他的东西
    this.initApp();
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