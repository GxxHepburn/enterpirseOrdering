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

    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    confirmModalStatus: false,
    totalPrice: 0,
    totalNum: 0,
    menuForNum: [],

    orders: [],
    userImage: '',
    userNickName: ''
  },
  /**
   * 根据outIndex、index判断菜品是否有属性和规格
   */
  hasProOrSpec: function (outIndex, index) {
    var app = getApp();
    var food = app.data.menu[outIndex].foods[index];
    if(food.property.length>0||food.specs.length>0){
      return true;
    } else {
      return false;
    }
  },
  //计算总数量
  countTotalPrice: function () {
    var totalPrice2 = 0;
    for(var i=0; i<this.data.menuForNum.length; i++) {
      for(var j=0; j<this.data.menuForNum[i].length; j++) {
        if(this.hasProOrSpec(i, j)) {
          var intotalPrice = 0;
          for(var k=1; k<this.data.menuForNum[i][j].length; k++) {
            intotalPrice += this.data.menuForNum[i][j][k].num * this.data.menuForNum[i][j][k].price;
          }
          totalPrice2 += intotalPrice;
        } else {
          totalPrice2 += this.data.menuForNum[i][j][0].num * this.data.menuForNum[i][j][0].price;
        }
      }
    }
    this.setData({
      totalPrice: totalPrice2
    });
  },
  //计算总价
  countTotalNum: function() {
    var totalNum2 = 0;
    for(var i=0; i<this.data.menuForNum.length; i++) {
      for(var j=0; j<this.data.menuForNum[i].length; j++) {
        totalNum2+=this.data.menuForNum[i][j][0].num;
      }
    }
    this.setData({
      totalNum: totalNum2
    })
  },
  //单选框选择
  radioChange: function (e) {
    this.setData({
      numberOfDiners: e.detail.value
    });
    var app = getApp();
    app.data.numberOfDiners = this.data.numberOfDiners;
    this.confirmHideModal();
  },
  //隐藏弹窗
  confirmHideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.scale3d(0,0,0).step()
    this.setData({
      confirmAnimationData: animation.export(),
    });
    setTimeout(function () {
      animation.scale3d(1,1,1).step()
      this.setData({
        confirmAnimationData: animation.export(),
        confirmModalStatus: false
      })
    }.bind(this), 200)
  },
  //显示弹窗
  confirmShowModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.scale3d(0,0,0).step()
    this.setData({
      confirmAnimationData: animation.export(),
      confirmModalStatus: true
    })
    setTimeout(function () {
      animation.scale3d(1,1,1).step()
      this.setData({
        confirmAnimationData: animation.export()
      })
    }.bind(this), 200)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //根据app的res和table，请求得tabTypeName，和tabName
    let that = this;
    var app = getApp();
    this.setData({
      numberOfDiners: app.data.numberOfDiners,
      menuForNum: app.data.menuForNum,
      orders: app.data.orders
    });
    this.countTotalPrice();
    this.countTotalNum();
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