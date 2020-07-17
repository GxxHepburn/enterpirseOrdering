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
    userNickName: '',
    remark: ''
  },
  //下单-下单后要更新menu（销量）
  touchConfirm: function() {
    //发送请求，下单。
    //如果正常下单
      //传递给已下单order
      //原来的order，menufornum全部清空
      //更新menu（销量,库存）---------------------------------要不要在下单service中返回menu
    var app = getApp();
    let that = this;
    wx.request({
      url: app.data.realUrl + "/wechat/loggedIn/order",
      method: 'POST',
      data: {
        openid: app.data.openid,
        orders: this.data.orders,
        totalNum: this.data.totalNum,
        totalPrice: this.data.totalPrice,
        mid: app.data.res,
        tid: app.data.table,
        remark: this.data.remark
      },
      success(resMy) {
        if(resMy.data==0) {
          //错误,报错，提示联系管理员
          wx.showToast({
            title: '未知错误，请联系管理员',
            icon: 'none',
            duration: 3500
          });
        } else {
          app.data.menu = resMy.data.menu;
          for(var i=0; i<that.data.orders.length; i++) {
            app.data.alreadyOrders.push(that.data.orders[i]);
          }
          app.data.totalPrice = 0;
          app.data.remark = '';
          that.setData({
            orders: [],
            totalNum: 0,
            totalPrice: 0,
            remark: ''
          });
          app.data.menuForNum = [];
          //跳转到下单成功界面
        }
      }
    });
  },
  //获取备注
  getInputValue: function(e) {
    this.setData({
      remark: e.detail.value
    });
    var app = getApp();
    app.data.remark = this.data.remark;
  },
  //转化成购物车中的食品结构
  menuForNumFood2realFood: function(outIndex, index, inIndex) {
    var app = getApp();
    var food = {};
    var realFood = app.data.menu[outIndex].foods[index];
    var abbrFood = app.data.menuForNum[outIndex][index][inIndex];
    
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
      orders: app.data.orders,
      remark: app.data.remark
    });
    this.countTotalPrice();
    this.countTotalNum();
    //请求要携带openid
    if(app.data.tableName==''||app.data.tabTypeName=='') {
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
          app.data.tableName = tableName2;
          app.data.tabTypeName = tabTypeName2;
        }
      });
    } else {
      this.setData({
        tabTypeName: app.data.tabTypeName,
        tableName: app.data.tableName
      })
    }
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