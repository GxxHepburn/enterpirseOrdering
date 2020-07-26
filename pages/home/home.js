// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordersList: [],
    nowOrder: [],
    returnOrder: [],
    finishedOrder: [],

    touchedOrderNum: 1
  },
  realChangeTime: function (orders) {
    for(var i=0; i<orders.length; i++) {
      var time2 = orders[i].o_OrderingTime;
      
      var dateStr = time2.split(" ");
      var strGMT = dateStr[0]+" "+dateStr[1]+" "+dateStr[2]+" "+dateStr[5]+" "+dateStr[3]+" GMT+0800";
      var orderTime2 = new Date(Date.parse(strGMT));

      var year = orderTime2.getFullYear();
      var month = orderTime2.getMonth() + 1;
      var day = orderTime2.getDate();
      var hour = orderTime2.getHours();
      var minute = orderTime2.getMinutes();
      var second = orderTime2.getSeconds();

      month = month > 10 ? month : "0" + month;
      day = day > 10 ? day : "0" + day;
      hour = hour > 10 ? hour : "0" + hour;
      minute = minute > 10 ? minute : "0" + minute;
      second = second > 10 ? second : "0" + second;

      orders[i].o_OrderingTime =  '' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

      var payStatus = orders[i].o_PayStatue;
      if(payStatus == 0) {
        orders[i].o_PayStatue = "未支付";
      }
      if(payStatus == 1) {
        orders[i].o_PayStatue = "已完成";
      }
      if(payStatus == 2) {
        orders[i].o_PayStatue = "退款";
      }
      if(payStatus == 3) {
        orders[i].o_PayStatue = "未完成";
      }
    }
  },
  changeTime: function (resMy) {
    this.realChangeTime(resMy.data.nowOrders);
    this.realChangeTime(resMy.data.finishedOrders);
    this.realChangeTime(resMy.data.returnOrders);
  },
  //头部选择时间
  topTouch: function(e) {
    let that = this;
    this.setData({
      touchedOrderNum: e.currentTarget.dataset.index
    });
    if(that.data.touchedOrderNum == 1) {
      that.setData({
        ordersList: that.data.nowOrder
      });
    }
    if(that.data.touchedOrderNum == 2) {
      that.setData({
        ordersList: that.data.returnOrder
      });
    }
    if(that.data.touchedOrderNum == 3) {
      that.setData({
        ordersList: that.data.finishedOrder
      });
    }
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
  initOrdersList: function() {
    let that = this;
    var app = getApp();
    wx.request({
      url: app.data.realUrl + "/wechat/loggedIn/home",
      method: 'POST',
      data: {
        openid: "o5C-Y5KCm_mMGH2nyb8IVkxUAs50"/*app.data.openid*/
      },
      success: function(resMy) {
        if(resMy.data == "0") {
          wx.showToast({
            title: '发生未知错误，请联系管理员',
            icon: 'none',
            duration: 3500
          });
          return;
        }
        console.log(resMy);
        //修改resMy时间格式
        that.changeTime(resMy);
        that.setData({
          nowOrder: resMy.data.nowOrders,
          returnOrder: resMy.data.returnOrders,
          finishedOrder: resMy.data.finishedOrders,
        });
        if(that.data.touchedOrderNum == 1) {
          that.setData({
            ordersList: resMy.data.nowOrders
          });
        }
        if(that.data.touchedOrderNum == 2) {
          that.setData({
            ordersList: resMy.data.returnOrders
          });
        }
        if(that.data.touchedOrderNum == 3) {
          that.setData({
            ordersList: resMy.data.finishedOrders
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //清空所有其他的东西
    this.initApp();
    this.initOrdersList();
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