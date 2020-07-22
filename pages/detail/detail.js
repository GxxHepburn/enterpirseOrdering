// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTotal:{number:10, price: 10.1},
    alreadyOrders: [],
    totalPrice: 0,
    orderSearchId: '',
    orderTime: '',
    tableName: '',
    tabTypeName: '',

    payMethod: '无',
    payStatus: '未支付',
    remark: ''
  },
  //付款按钮
  pay: function() {
    //检查支付状态如果未支付，
    // var app = getApp();
    // var appPayStatus2 = app.data.appPayStatus;
    // if(!appPayStatus2) {
    //   //那么进行支付,将payStatus设置为结束状态，relunch到home界面，清空所有数据。
    //   app.data.appPayStatus = true;
    //   wx.reLaunch({
    //     url: '../../pages/home/home',
    //   });
    // } else {
    //   //否则，提示订单完结，跳转到home界面，清空所有数据。
    //   wx.reLaunch({
    //     url: '../../pages/home/home',
    //   });
    // }
    // this.initApp();

    //测试支付
    var app = getApp();
    var openId2 = app.data.openid;
    wx.request({
      url: app.data.realUrl + "/wxpay/" + openId2,
      method: 'POST',
      success: function (resMy) {
        wx.requestPayment({
          'timeStamp': resMy.data.timeStamp,
          'nonceStr': resMy.data.nonceStr,
          'package': resMy.data.package,
          'signType': resMy.data.signType,
          'paySign': resMy.data.paySign,
          'success': function(payRes) {
            console.log('success: ' + payRes.errMsg);
          },
          'fail': function(payRes) {
            console.log('fail: ' + payRes.errMsg);
          }
        });
      }
    })
  },
  //初始化app.js数据
  initApp: function() {
    var app = getApp();
    // app.data.numberOfDiners = -1;
    // app.data.res = "";
    // app.data.table = "";
    // app.data.inited = 0;
    // app.data.menu = [];
    // app.data.menuForNum = [];
    // app.data.typeForNum = [];
    // app.data.orders = [];
    // app.data.totalPrice = [];
    // app.data.tableName = [];
    // app.data.tabTypeName = '';
    // app.data.remark = '';
    // app.data.alreadyOrders = [];
    app.onLaunch();
  },
  touchAdd: function() {
    var app = getApp();
    app.data.isAdd = true;
    wx.navigateTo({
      url: '../../pages/menu/menu',
    });
  },
  //计算总价
  countTotalPrice: function() {
    var totalPrice2 = 0;
    for(var i=0; i<this.data.alreadyOrders.length; i++) {
      totalPrice2 += this.data.alreadyOrders[i].num * this.data.alreadyOrders[i].price;
    }
    this.setData({
      totalPrice: totalPrice2
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    console.log("detail.js: ");
    console.log(app.data.menuForNum);
    this.setData({
      alreadyOrders: app.data.alreadyOrders,
      orderSearchId: app.data.orderSearchId,
      orderTime: app.data.orderTime,
      tableName: app.data.tableName,
      tabTypeName: app.data.tabTypeName,
      remark: app.data.remark
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