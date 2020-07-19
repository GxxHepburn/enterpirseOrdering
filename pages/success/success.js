// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '五',
    openTime: 5,
    interval: {},

    return: false
  },
  //加菜按钮
  touchAdd: function() {
    clearInterval(this.data.interval);
    var app = getApp();
    app.data.isAdd = true;
    wx.navigateTo({
      url: '../../pages/menu/menu',
    });
  },

  //订单详情函数
  touchDetail: function() {
    clearInterval(this.data.interval);
    wx.reLaunch({
      url: '../../pages/detail/detail',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var app = getApp();
    var timeName = setInterval(() => {
      var openTime2 = that.data.openTime - 1;
      that.setData({
        openTime: openTime2
      });
      if(openTime2 == 4) {
        that.setData({
          time: '五'
        });
      } else if (openTime2 == 3) {
        that.setData({
          time: '四'
        });
      } else if (openTime2 == 2) {
        that.setData({
          time: '三'
        });
      } else if (openTime2 == 1) {
        that.setData({
          time: '二'
        });
      } else if (openTime2 == 0) {
        that.setData({
          time: '一'
        });
      } else {
        wx.reLaunch({
          url: '../../pages/detail/detail',
        });
        clearInterval(timeName);
      }
    }, 1000);
    this.setData({
      interval: timeName
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
    let that = this;
    var app = getApp();
    this.setData({
      openTime: 5,
      time: '五'
    });
    if(this.data.return) {
      var timeName = setInterval(() => {
        var openTime2 = that.data.openTime - 1;
        that.setData({
          openTime: openTime2
        });
        if(openTime2 == 4) {
          that.setData({
            time: '五'
          });
        } else if (openTime2 == 3) {
          that.setData({
            time: '四'
          });
        } else if (openTime2 == 2) {
          that.setData({
            time: '三'
          });
        } else if (openTime2 == 1) {
          that.setData({
            time: '二'
          });
        } else if (openTime2 == 0) {
          that.setData({
            time: '一'
          });
        } else {
          wx.reLaunch({
            url: '../../pages/detail/detail',
          });
          clearInterval(timeName);
        }
      }, 1000);
      this.setData({
        interval: timeName
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      return: true
    })
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