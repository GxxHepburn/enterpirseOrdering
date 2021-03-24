// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,
    totalNum: 0,
    menuForNum: [],
    orders: [],
    menu: [],

    alreadyOrders: [],
    alreadyTotalPrice: 0,
    touchConfirmDisabled: false
  },
  //下单
  touchConfirm: function() {
    var app = getApp();
    let that = this;
    // 先检查订单数目，订单总价为0，不能下单
    if(this.data.totalPrice==0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 检查是不是重复下单
    if (this.data.touchConfirmDisabled == true) {
      wx.showToast({
        title: '正在拼命为您下单，请不要重复下单...',
        icon: 'none',
        duration: 5000
      })
      return
    }
    this.data.touchConfirmDisabled = true
    wx.request({
      url: app.data.realUrl + "/wechat/loggedIn/add",
      method: 'POST',
      header: {
        'mid': app.data.res
      },
      data: {
        openid: app.data.openid,
        orders: this.data.orders,
        totalNum: this.data.totalNum,
        totalPrice: this.data.totalPrice,
        mid: app.data.res,
        tid: app.data.table,
        orderSearchId: app.data.orderSearchId
      },
      success(resMy) {
        // 先检查商家是否正常营业，如果是，则ok，如果不是，则弹窗提示，同时return
        if (resMy.statusCode == 403) {
          wx.showToast({
            title: '对不起，商家已歇业休息，无法加菜',
            icon: 'none',
            duration: 3500
          });
          return
        }
        if(resMy.data==0) {
          //错误,报错，提示联系管理员
          wx.showToast({
            title: '未知错误，请联系管理员',
            icon: 'none',
            duration: 3500
          });
        } else if (resMy.data.meta != undefined && (resMy.data.meta.status == 410 || resMy.data.meta.status == 420)) {
          wx.showToast({
            title: resMy.data.data.waringMsg,
            icon: 'none',
            duration: 3500
          })
        } else {
          app.data.menu = resMy.data.menu;
          for(var i=0; i<that.data.orders.length; i++) {
            app.data.alreadyOrders.push(that.data.orders[i]);
          }
          app.data.totalPrice=0;
          app.data.menuForNum=[];
          wx.reLaunch({
            url: '../../pages/success/success'
          });
        }
      }
    });
  },
  //购物车 加菜
  cartPlus: function(item) {
    var cartTouchFood2 = item.currentTarget.dataset.carttouchfood;
    var outIndex = cartTouchFood2.outIndex;
    var index = cartTouchFood2.index;
    var inIndex = cartTouchFood2.inIndex;
    var app = getApp();
    //先判断是否超库存，如果超了就弹窗提示，如果没超就根据是否有属性规格，分类处理、
    if(this.data.menuForNum[outIndex][index][0].num==app.data.menu[outIndex].foods[index].stock) {
      wx.showToast({
        title: '超出库存',
        icon: 'none',
        duration: 800
      });
    } else {
      if(this.hasProOrSpec(outIndex, index)) {
        this.data.menuForNum[outIndex][index][inIndex].num +=1;
      }
      this.data.menuForNum[outIndex][index][0].num +=1;
      this.data.totalNum +=1;
    }
    this.setData({
      menuForNum: this.data.menuForNum,
      totalNum: this.data.totalNum
    });

    
    this.createOrders();
    this.countTotalPrice();
    this.countTotalNum();

    //修改app中内容
    app.data.menuForNum = this.data.menuForNum;
    app.data.orders = this.data.orders;
    app.data.totalPrice = this.data.totalPrice;
    var typeNum = 0;
    for(var i=0; i<this.data.menuForNum[outIndex].length; i++) {
      typeNum+=this.data.menuForNum[outIndex][i][0].num;
    }
    app.data.typeForNum[outIndex] = typeNum;
  },
  //购车减菜
  cartReduce: function(item) {
    var cartTouchFood2 = item.currentTarget.dataset.carttouchfood;
    var outIndex = cartTouchFood2.outIndex;
    var index = cartTouchFood2.index;
    var inIndex = cartTouchFood2.inIndex;
    var app = getApp();
    //先判断数目是否为0
    if(cartTouchFood2.num==0) {
      wx.showToast({
        title: '菜品不能低于0',
        icon: 'none',
        duration: 800
      });
    } else {
      if(this.hasProOrSpec(outIndex, index)) {
        this.data.menuForNum[outIndex][index][inIndex].num -=1;
      }
      this.data.menuForNum[outIndex][index][0].num -=1;
      this.data.totalNum -=1;
    }
    //清理num为0的food
    for(var i=1; i<this.data.menuForNum[outIndex][index].length; i++) {
      if(this.data.menuForNum[outIndex][index][i].num == 0) {
        this.data.menuForNum[outIndex][index].splice(i, 1);
      }
    }

    this.setData({
      menuForNum: this.data.menuForNum,
      totalNum: this.data.totalNum
    });
    this.createOrders();
    this.countTotalPrice();
    this.countTotalNum();
    //修改app中内容
    app.data.menuForNum = this.data.menuForNum;
    app.data.orders = this.data.orders;
    app.data.totalPrice = this.data.totalPrice;
    var typeNum = 0;
    for(var i=0; i<this.data.menuForNum[outIndex].length; i++) {
      typeNum+=this.data.menuForNum[outIndex][i][0].num;
    }
    app.data.typeForNum[outIndex] = typeNum;
  },
  //转化成购物车中的食品结构
  menuForNumFood2realFood: function(outIndex, index, inIndex) {
    var food = {};
    var realFood = this.data.menu[outIndex].foods[index];
    var abbrFood = this.data.menuForNum[outIndex][index][inIndex];
    
    var price = 0;
    var property = [];
    var specs = '';
    if(inIndex==0) {
      price = realFood.price;
    } else {
      if(realFood.specs.length==0) {
        price = realFood.price;
      } else {
        price = realFood.price + realFood.specs[abbrFood.specs].value;
        specs = realFood.specs[abbrFood.specs].name;
      }
      for(var i=0; i<abbrFood.property.length; i++) {
        if(abbrFood.property[i]==0) {
          property.push(realFood.property[i].valueOne);
        } else if(abbrFood.property[i]==1) {
          property.push(realFood.property[i].valueTwo);
        } else if(abbrFood.property[i]==2) {
          property.push(realFood.property[i].valueThree);
        } else if(abbrFood.property[i]==3) {
          property.push(realFood.property[i].valueFour);
        } else if(abbrFood.property[i]==4) {
          property.push(realFood.property[i].valueFive);
        }
      }
    }

    food = {
      "id": realFood.id,
      "name": realFood.name,
      "price": price,
      "property": property,
      "specs": specs,
      "num": abbrFood.num,
      "outIndex": outIndex,
      "index": index,
      "inIndex": inIndex
    }
    return food;
  },
  //生成订单数组
  createOrders: function() {

    var orders2 = new Array();
    for(var i=0; i<this.data.menuForNum.length; i++) {
      for(var j=0; j<this.data.menuForNum[i].length; j++) {
        //先判断第一个num是否为0.判断是否有属性规格，有就循环，没有就直接判断加入
        if(this.data.menuForNum[i][j][0].num!=0) {
          if(this.hasProOrSpec(i,j)) {
            for(var k=1; k<this.data.menuForNum[i][j].length; k++) {
              orders2.push(this.menuForNumFood2realFood(i,j,k));
            }
          } else {
            orders2.push(this.menuForNumFood2realFood(i,j,0));
          }
        }
      }
    }
    this.setData({
      orders: orders2
    });
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
      totalPrice: totalPrice2.toFixed(2)
    });
  },
  //计算总数量
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
  //计算already总价
  countAlreadyTotalPrice: function() {
    var totalPrice2 = 0;
    for(var i=0; i<this.data.alreadyOrders.length; i++) {
      totalPrice2 += this.data.alreadyOrders[i].num * this.data.alreadyOrders[i].price;
    }
    this.setData({
      alreadyTotalPrice: totalPrice2
    });
  },
  //计算already总数
  countAlreadyNum: function() {
    var totalPrice2 = 0;
    for(var i=0; i<this.data.alreadyOrders.length; i++) {
      totalPrice2 += this.data.alreadyOrders[i].num;
    }
    this.setData({
      alreadyTotleNum: totalPrice2
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    var app = getApp();
    this.setData({
      menuForNum: app.data.menuForNum,
      orders: app.data.orders,
      alreadyOrders: app.data.alreadyOrders,
      menu: app.data.menu
    });
    this.countTotalPrice();
    this.countTotalNum();
    this.countAlreadyTotalPrice();
    this.countAlreadyNum();
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
    var app = getApp();
    return app.data.globalShareInfo
  }
})