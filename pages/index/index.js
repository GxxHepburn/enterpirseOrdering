// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    touch: -1,
    openid: ''
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
   * 错误弹窗
   */
  failLoadModal: function(that) {
    var app = getApp();
    wx.showModal({
      title: '登陆',
      content: '登陆出错，请重试',
      success: function (repeatRes){
        if(repeatRes.confirm) {
          that.loadByTxServer();
        } else {
          //虽然违背用户意愿（取消登陆）但是仍然强制登陆，因为不登陆系统就没办法正常运行
          app.loadByTxServer();
          wx.showToast({
            title: '选择就餐人数后，点击"开始点菜"按钮继续',
            icon: 'none',
            duration: 3500
          });
        }
      }
    });
  },

  /**
   * 登陆方法
   */
  loadByTxServer: function (){
    let that = this;
    var app = getApp();
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            timeout: 5000,
            url: app.data.realUrl + "/wechat/login",
            method: 'POST',
            data: {
              code: res.code
            },
            success(resMy) {
              if (resMy.statusCode == 200) {
                app.data.loadStatus = true;
                app.data.openid = resMy.data;
              } else {
                that.failLoadModal(that);
              }
            },
            fail() {
              that.failLoadModal(that);
            }
          })
        } else {
          that.failLoadModal(that);
        }
      },
      fail() {
        that.failLoadModal(that);
      }
    })
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
    if(OPENID == "0" || OPENID == "") {
      //登陆失败，要重新登陆
      wx.showModal({
        title: '登陆',
        content: '登陆出错，请重试',
        success: function (repeatRes){
          if(repeatRes.confirm) {
            that.loadByTxServer();
          } else {
            //虽然违背用户意愿（取消登陆）但是仍然强制登陆，因为不登陆系统就没办法正常运行
            app.loadByTxServer();
            wx.showToast({
              title: '选择就餐人数后，点击"开始点菜"按钮继续',
              icon: 'none',
              duration: 3500
            })
          }
        }
      });
    } else {
      //根据OPENID初始化菜单
      //调用初始化函数,参数包括openid,商家代码
      //先检查是否已经初始化过了，如果初始化过了，就直接进入界面，否则调用初始化方法
      that.initMenu(OPENID, app.data.res);
      app.data.inited = 1;
    }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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