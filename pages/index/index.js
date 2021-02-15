// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    touch: -1,
    openid: '',
    showLoading: false
  },

  /**
   * 选择人数按钮bind函数
   */
  searchPeopleNum: function(event) {
    var app = getApp();
    this.setData({
      touch: event.target.id,
      openid: app.data.openid
    });
    app.data.numberOfDiners = event.target.id;
  },

  /**
   * 加载菜单
   */
  startOrdering: function(event) {
    
    let that = this;
    var app = getApp();
    if(this.data.touch<=0) {
      wx.showToast({
        title: '请选择就餐人数',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if(app.data.inited == 1) {
      wx.navigateTo({
        url: '../../pages/menu/menu' 
      });
      return;
    }
    var OPENID = app.data.openid;
    
    //根据OPENID初始化菜单
    //调用初始化函数,参数包括openid,商家代码
    //先检查是否已经初始化过了，如果初始化过了，就直接进入界面，否则调用初始化方法
    that.initMenu(OPENID, app.data.res);
    app.data.inited = 1;
  },
  /**
   * 初始化菜单函数->发送请求
   */
  initMenu: function(openid, res){
    let that = this;
    var app = getApp();
    wx.request({
      url: app.data.realUrl + '/wechat/loggedIn/initMenu',
      data: {
        openid: openid,
        res: res
      },
      method: 'POST',
      responseType: "",
      success(resMy) {
        //初始化
        app.data.menu = resMy.data.menu;
        wx.navigateTo({
          url: '../../pages/menu/menu' 
        })
      }
    })
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
    this.setData({
      showLoading: true
    })
    var app = getApp();
    let that = this;
    wx.login({
      success(res) {
        if(res.code) {
          wx.request({
            url: app.data.realUrl + "/wechat/login",
            method: 'POST',
            data: {
              code: res.code
            },
            success(resMy) {
              if(resMy.statusCode == 200) {
                if (resMy.data == "0") {
                  that.UserBanTips()
                }

                app.data.loadStatus = true;
                app.data.openid = resMy.data;

                if(options.scene) {
                  that.initApp();
                  app.data.isScan = true;
                  var scene = decodeURIComponent(options.scene);
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
                } else {
                  app.data.isScan = false;
                }
                if(options.q) {
                  that.initApp();
                  app.data.isScan = true;
                  var q = decodeURIComponent(options.q);
                  var arrPara = q.split("&");
                  var arr = [];
                  for (var i in arrPara) {
                    arr = arrPara[i].split("=");
                    if (i == 0) {
                      app.data.res = arr[1];
                    } else {
                      app.data.table = arr[1];
                    }
                  }
                } else {
                  app.data.isScan = false;
                }
                //获得商家信息
                wx.request({
                  url: app.data.realUrl + "/wechat/loggedIn/getMer",
                  method: 'POST',
                  data: {
                    openid: app.data.openid,
                    mid: app.data.res
                  },
                  success: function(resMer) {
                    app.data.mer = resMer.data;
                  }
                });
              }
              that.setData({
                showLoading: false
              })
            }
          });
        }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var app = getApp()
    this.setData({
      touch: app.data.numberOfDiners
    });
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