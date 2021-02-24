// pages/home/home.js
var startPoint;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,

    ordersList: [],
    nowOrder: [],
    returnOrder: [],
    finishedOrder: [],

    orderLimit: 0,
    orderOk: false,

    touchedOrderNum: 1,

    buttonTop: 400,
    buttonLeft: 10,
    windowHeight: '',
    windowWidth: '',

    startPoint: 0,
    addTouch: 0
  },
  touchButton: function() {
    var app = getApp();
    let that = this;
    this.setData({
        addTouch: 1,
      }
    );
    //有未支付的订单，先弹窗提示当前订单未支付，是否支付。不支付就退回到home，支付就进入支付界面。
    if(this.data.nowOrder.length!=0 &&this.data.nowOrder[0].o_PayStatue=="未支付") {
      wx.showModal({
        title: '提示',
        content: '当前存在未支付订单，请先支付当前订单',
        success: function(res){
          if(res.confirm) {
            that.realTouchDetail(that.data.nowOrder[0]);
          }
          that.setData({
            addTouch: 0
          })
        }
      });
    } else {
      //弹窗提示请扫描桌面二维码
      wx.showModal({
        title: '提示',
        content: '请扫描桌面二维码开始点餐',
        success: function(res){
          if(res.confirm) {
            //调用扫码程序
            wx.scanCode({
              onlyFromCamera: true,
              success(options) {
                var scene = decodeURIComponent(options.result);
                //检查是否是合法的连接，不合法就弹窗提示，然后什么也不做
                wx.request({
                  url: app.data.realUrl + "/wechat/loggedIn/selectQrCode",
                  method: 'POST',
                  data: {
                    openid: app.data.openid,
                    QrCode: scene
                  },
                  success: function(resQr)  {
                    if(resQr.data!=1) {
                      //不合法
                      wx.showToast({
                        title: '请扫描正确的点菜二维码',
                        icon: 'none',
                        duration: 3500
                      });
                    } else {
                      //合法
                      var arrPara = scene.split("&");
                      var arr = [];
                      for (var i in arrPara) {
                        arr = arrPara[i].split("=");
                        if (i == 0) {
                          app.data.res = arr[1];
                        } else {
                          app.data.table = arr[1];
                        }
                      }
                      wx.reLaunch({
                        url: '../../pages/index/index',
                      });
                    }
                  }
                });
              }
            });
          }
          that.setData({
            addTouch: 0
          })
        }
      });
    }
  },
  touchDetail: function(e) {
    var order = e.currentTarget.dataset.order;
    this.realTouchDetail(order);
  },
  realTouchDetail: function(order) {
    var app = getApp();
    //分类处理，对于未支付的订单，进入订单详情界面
    //对于其他类型订单，弹出窗体，显示订单详细信息。
    if(order.o_PayStatue=="未支付") {
      wx.request({
        url: app.data.realUrl + "/wechat/loggedIn/touchDetail",
        method: 'POST',
        data: {
          openid: app.data.openid,
          orderID: order.o_ID,
          tableId: order.o_TID,
          res: order.o_MID
        },
        success: function(resMy) {
          app.data.returnTotalPrice = resMy.data.returnTotalPrice;
          app.data.hasReturn = resMy.data.hasReturn;
          //重置etail
          app.data.alreadyOrders = resMy.data.alreadyOrders;
          app.data.orderSearchId = order.o_UniqSearchID;
          app.data.orderTime = order.o_OrderingTime;
          app.data.tableName = resMy.data.tabName;
          app.data.tabTypeName = resMy.data.tabTypeName;
          app.data.remark = order.o_Remarks;
          //重置add
          app.data.menu = resMy.data.menu.menu;
          app.data.res = order.o_MID;
          app.data.table = order.o_TID;
          wx.reLaunch({
            url: "../../pages/detail/detail",
          });
        }
      });
    } else {
      wx.request({
        url: app.data.realUrl + "/wechat/loggedIn/touchDetail",
        method: 'POST',
        data: {
          openid: app.data.openid,
          orderID: order.o_ID,
          tableId: order.o_TID,
          res: order.o_MID
        },
        success: function(resMy) {
          app.data.returnTotalPrice = resMy.data.returnTotalPrice;
          app.data.hasReturn = resMy.data.hasReturn;
          //重置etail
          app.data.alreadyOrders = resMy.data.alreadyOrders;
          app.data.orderSearchId = order.o_UniqSearchID;
          app.data.orderTime = order.o_OrderingTime;
          app.data.tableName = resMy.data.tabName;
          app.data.tabTypeName = resMy.data.tabTypeName;
          app.data.remark = order.o_Remarks;
          //重置add
          app.data.menu = resMy.data.menu.menu;
          app.data.res = order.o_MID;
          app.data.table = order.o_TID;
          if(order.o_PayStatue=="未完成") {
            wx.navigateTo({
              url: '../../pages/notFi/notFi',
            });
          } else if(order.o_PayStatue=="已完成") {
            wx.navigateTo({
              url: '../../pages/Fi/Fi',
            });
          } else {
            wx.navigateTo({
              url: '../../pages/return/return',
            });
          }
        }
      });
    }
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

      month = month >= 10 ? month : "0" + month;
      day = day >= 10 ? day : "0" + day;
      hour = hour >= 10 ? hour : "0" + hour;
      minute = minute >= 10 ? minute : "0" + minute;
      second = second >= 10 ? second : "0" + second;

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
  //头部选择事件
  topTouch: function(e) {
    this.setData({
      scrollTop: 0
    })

    this.data.orderLimit = 0
    this.data.orderOk = false
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
        openid: app.data.openid
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
   * 循环提示框 
   */
  UserBanTips: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您无法在本餐厅用餐，请联系餐厅服务人员！',
      showCancel: false,
      success: function (repeatRes){
        that.UserBanTips()
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    // 初始化scroll-view高度
    var obj = wx.createSelectorQuery();
    obj.selectAll('.top').boundingClientRect(function(rect) {
      let height = wx.getSystemInfoSync().windowHeight - rect[0].height
      that.setData({
        height: height
      })
    })
    obj.exec()
    //清空所有其他的东西
    this.initApp();
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 高度,宽度 单位为px
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth
        })
      }
    });
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.data.realUrl + "/wechat/login",
            method: 'POST',
            data: {
              code: res.code
            },
            success(resMy) {
              //登陆成功
              if (resMy.statusCode == 200) {
                if (resMy.data == "0") {
                  that.UserBanTips()
                }
                
                app.data.openid = resMy.data;
                that.initOrdersList();
              }
            }
          })
        }
      }
    });
  },
  //悬浮窗移动
  buttonStart: function (e) {
    startPoint = e.touches[0]
  },
  buttonEnd: function (e) {

  },
  buttonMove: function (e) {
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    //判断是移动否超出屏幕
    if (buttonLeft+50 >= this.data.windowWidth){
      buttonLeft = this.data.windowWidth-50;
    }
    if (buttonLeft<=0){
      buttonLeft=0;
    }
    if (buttonTop<=0){
      buttonTop=0
    }
    if (buttonTop + 50 >= this.data.windowHeight){
      buttonTop = this.data.windowHeight-50;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
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

    //清空所有其他的东西
    this.initApp();
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
    var that = this
    var app = getApp()
    var orderLimitInner = this.data.orderLimit
    var orderOkInner = this.data.orderOk
    if (orderOkInner) {
      wx.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 1000
      });
      return
    }

    wx.request({
      url: app.data.realUrl + "/wechat/loggedIn/onReachBottom",
      method: 'POST',
      data: {
        openid: app.data.openid,
        touchedOrderNum: that.data.touchedOrderNum,
        orderLimit: orderLimitInner
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.meta.status == 200) {
            var ordersFormList = res.data.data.ordersFormList
            that.realChangeTime(ordersFormList);
            that.setData({
              ordersList: that.data.ordersList.concat(ordersFormList),
              orderLimit: orderLimitInner + 1
            })
          } else {
            wx.showToast({
              title: '没有更多订单了',
              icon: 'none',
              duration: 1000
            });
            that.setData({
              orderOk: true
            })
          }

        } else {
          wx.showModal({
            title: '提示',
            content: '发生未知错误，请联系管理员'
          });
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})