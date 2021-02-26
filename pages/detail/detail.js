// pages/detail/detail.js
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
    payStatus: '未支付',
    remark: ''
  },
  

  //商户付款付款按钮
  pay: function() {
    let that = this;
    var app = getApp();
     var openId2 = app.data.openid;
     wx.request({
       url: app.data.realUrl + "/wxpay/pay/" + openId2,
       method: 'POST',
       data: {
         searchId: app.data.orderSearchId,
         total_fee: that.data.totalPrice,
       },
       success: function (resMy) {
        //在这里检查pay的status
        var data = resMy.data;
        if(data == 1) {
          wx.showModal({
            title: '提示',
            content: '订单已经完结，请重新扫码下单',
            showCancel: false,
          });
          //relunch到home界面，
          wx.reLaunch({
            url: '../../pages/home/home',
          });
          //清空所有数据。
          that.initApp();
        } else {
          wx.requestPayment({
            'timeStamp': resMy.data.timeStamp,
            'nonceStr': resMy.data.nonceStr,
            'package': resMy.data.package,
            'signType': resMy.data.signType,
            'paySign': resMy.data.paySign,
            'success': function(payRes) {
              wx.reLaunch({
                url: '../../pages/home/home',
              });
              //清空所有数据。
              that.initApp();
            },
            'fail': function(payRes) {
              //修改isPayNow，同时设置payStatus,payTime
              wx.request({
                url: app.data.realUrl + "/wxpay/fail/" + app.data.orderSearchId,
                method: 'POST',
              });
            }
          });
        }
       }
     });
  },

  //普通商户支付
  realPay: function() {
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
    });
  },

  //服务商支付
  realServicePay: function() {
     var app = getApp();
     var openId2 = app.data.openid;
     console.log("serviceOpenID: ");
     console.log(openId2);
     wx.request({
       url: app.data.realUrl + "/wxpay/pay/" + openId2,
       method: 'POST',
       data: {
         searchId: app.data.searchId,
         total_fee: this.data.totalPrice,
       },
       success: function (resMy) {
         console.log(resMy);
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