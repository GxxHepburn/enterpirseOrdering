// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [],
    menuInto: 0,
    menuForNum: [],
    top: [],
    scrollTop: 0,
    typeForNum: [],
    scrollInto: 0,

    showModalStatus: false,
    touchFood: {},
    modalFood: {},
    outIndex: 0,
    index: 0,

    showReduceModalStatus: false,
    exceptOneFoods: [],

    totalPrice: 0,

    cartModalStatus: false,

    orders: [],
    mer: {},

    popOutIndex: 0,
    popIndex: 0
  },
  //shopSign_phone按钮
  touchPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.mer.m_Phone,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //选好了按钮
  touchConfirm: function() {
    //总价为0不能下单
    if(this.data.totalPrice==0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var app = getApp();
    this.createOrders();
    app.data.orders = this.data.orders;
    if(app.data.isAdd) {
      wx.navigateTo({
        url: '../../pages/add/add',
      })
    } else {
      wx.navigateTo({
        url: '../../pages/orderConfirm/orderConfirm'
      });
    }
  },
  //购物车 加菜
  cartPlus: function(item) {
    var cartTouchFood2 = item.currentTarget.dataset.carttouchfood;
    var outIndex = cartTouchFood2.outIndex;
    var index = cartTouchFood2.index;
    var inIndex = cartTouchFood2.inIndex;
    //先判断是否超库存，如果超了就弹窗提示，如果没超就根据是否有属性规格，分类处理、
    if(this.data.menuForNum[outIndex][index][0].num==this.data.menu[outIndex].foods[index].stock) {
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
    }
    this.setData({
      menuForNum: this.data.menuForNum
    });
    this.createOrders();
    this.countTotalPrice();

    var typeNum = 0;
    for(var i=0; i<this.data.menuForNum[outIndex].length; i++) {
      typeNum+=this.data.menuForNum[outIndex][i][0].num;
    }
    this.data.typeForNum[outIndex] = typeNum;
    this.setData({
      typeForNum: this.data.typeForNum
    });
  },
  //购物车 减菜
  cartReduce: function(item) {
    var cartTouchFood2 = item.currentTarget.dataset.carttouchfood;
    var outIndex = cartTouchFood2.outIndex;
    var index = cartTouchFood2.index;
    var inIndex = cartTouchFood2.inIndex;
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
    }
    //清理num为0的food
    for(var i=1; i<this.data.menuForNum[outIndex][index].length; i++) {
      if(this.data.menuForNum[outIndex][index][i].num == 0) {
        this.data.menuForNum[outIndex][index].splice(i, 1);
      }
    }

    this.setData({
      menuForNum: this.data.menuForNum
    });
    this.createOrders();
    this.countTotalPrice();

    var typeNum = 0;
    for(var i=0; i<this.data.menuForNum[outIndex].length; i++) {
      typeNum+=this.data.menuForNum[outIndex][i][0].num;
    }
    this.data.typeForNum[outIndex] = typeNum;
    this.setData({
      typeForNum: this.data.typeForNum
    });
  },
  //初始化menuForm、typeForNum
  resetMenuAndTypeFormNum: function() {
    var menuForNum2 = new Array();
    var typeForNum2 = new Array();
    for(var i=0; i<this.data.menu.length; i++) {
      var menuForNume2In = new Array();
      for(var j=0; j<this.data.menu[i].foods.length; j++) {
        var foodObjArray = new Array();
        var obj = {};
        obj = {
          "id": this.data.menu[i].foods[j].id,
          "price": this.data.menu[i].foods[j].price,
          "num": 0,
          "property": [],
          "specs": []
        };
        foodObjArray.push(obj);
        menuForNume2In.push(foodObjArray);
      }
      typeForNum2.push(0);
      menuForNum2.push(menuForNume2In);
    }
    this.setData({
      menuForNum: menuForNum2,
      typeForNum: typeForNum2
    });
  },
  //清空
  reset: function() {
    let that = this;
    wx.showModal({
      title: '操作确认',
      content: '确定要清除购物车吗?',
      success: function (res) {
        if(res.confirm) {
          that.resetMenuAndTypeFormNum();
          that.countTotalPrice();
          that.cartHideModal();
        }
      }
    });
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
  //显示对话框---购物车
  cartShowModal: function () {
    if(this.data.cartModalStatus==true){
      this.cartHideModal();
      return;
    }
    
    //初始化订单foods
    this.createOrders();
    
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(500).step()
    this.setData({
      cartAnimationData: animation.export(),
      cartModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        cartAnimationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框--购物车
  cartHideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(500).step()
    this.setData({
      cartAnimationData: animation.export(),
    });
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        cartAnimationData: animation.export(),
        cartModalStatus: false
      })
    }.bind(this), 200)
  },
  //计算总价
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
  //减菜对话框，加按钮点击事件
  reduceTouchModalPlus: function(e) {
    var outIndex = this.data.outIndex;
    var index = this.data.index;
    var foodNum = e.currentTarget.dataset.index;
    var totalNum = 0;
    for(var i=0; i<this.data.exceptOneFoods.length; i++) {
      totalNum+=this.data.exceptOneFoods[i].num;
    }
    if(totalNum==this.data.menu[outIndex].foods[index].stock) {
      wx.showToast({
        title: '超出库存',
        icon: 'none',
        duration: 800
      });
    } else {
      this.data.exceptOneFoods[foodNum].num+=1;
      this.setData({
        exceptOneFoods: this.data.exceptOneFoods
      });
    }
  },
  //减菜对话框，减按钮点击事件
  reduceTouchModalReduce: function(e) {
    var outIndex = this.data.outIndex;
    var index = this.data.index;
    var foodNum = e.currentTarget.dataset.index;
    if(this.data.exceptOneFoods[foodNum].num!=0){
      this.data.exceptOneFoods[foodNum].num -= 1;
      this.setData({
        exceptOneFoods: this.data.exceptOneFoods
      })
    } else {
      wx.showToast({
        title: '菜品不能低于0',
        icon: 'none',
        duration: 800
      });
    }
  },
  //减菜对话框，确定按钮点击事件
  reduceTouchOk: function() {
    var outIndex = this.data.outIndex;
    var index = this.data.index;

    var totalNum = 0;
    for(var i=0; i<this.data.exceptOneFoods.length; i++) {
      totalNum+=this.data.exceptOneFoods[i].num;
      this.data.menuForNum[outIndex][index][i+1].num = this.data.exceptOneFoods[i].num;
    }
    this.data.menuForNum[outIndex][index][0].num = totalNum;
    this.setData({
      menuForNum: this.data.menuForNum
    });
    var typeNum = 0;
    for(var i=0; i<this.data.menuForNum[outIndex].length; i++) {
      typeNum+=this.data.menuForNum[outIndex][i][0].num;
    }
    this.data.typeForNum[outIndex] = typeNum;
    this.setData({
      typeForNum: this.data.typeForNum
    });
    //清理num为0的food
    for(var i=1; i<this.data.menuForNum[outIndex][index].length; i++) {
      if(this.data.menuForNum[outIndex][index][i].num == 0) {
        this.data.menuForNum[outIndex][index].splice(i, 1);
      }
    }
    //修改总价
    this.countTotalPrice();
    this.reduceHideModal();
  },
  //显示对话框----减菜
  reduceShowModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      reduceAnimationData: animation.export(),
      showReduceModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        reduceAnimationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框----减菜
  reduceHideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(500).step()
    this.setData({
      reduceAnimationData: animation.export(),
    });
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        reduceAnimationData: animation.export(),
        showReduceModalStatus: false
      })
    }.bind(this), 200)
  },
  //对话框，加按钮点击事件
  touchModalPlus: function() {
    var outIndex = this.data.outIndex;
    var index = this.data.index;
    if(this.data.modalFood.num == this.data.menu[outIndex].foods[index].stock-this.data.menuForNum[outIndex][index][0].num) {
      wx.showToast({
        title: '超出库存',
        icon: 'none',
        duration: 800
      });
    } else {
      this.data.modalFood.num+=1;
      this.setData({
        modalFood: this.data.modalFood
      });
    }
  },
  //对话框，减按钮点击事件
  touchModalReduce: function() {
    if(this.data.modalFood.num != 0) {
      this.data.modalFood.num -= 1;
      this.setData({
        modalFood: this.data.modalFood
      });
    } else {
      wx.showToast({
        title: '菜品不能低于0',
        icon: 'none',
        duration: 800
      });
    }
  },
  //对话框，确定按钮点击事件
  touchok: function(){
    var outIndex = this.data.outIndex;
    var index = this.data.index;
    if(this.data.modalFood.num ==0){
      this.hideModal();
      return;
    }
    
    var foodPropAndSpecsArray = this.data.menuForNum[outIndex][index];
    //修改价格
    this.data.modalFood.price=
      (this.data.touchFood.specs[0]==null?this.data.touchFood.price:this.data.touchFood.price+this.data.touchFood.specs[this.data.modalFood.specs].value);
    
    if(foodPropAndSpecsArray.length>1) {
      //除第一个外，比对，并在menuForNum中加入modalFood
      var same = false;
      for(var i=1; i< foodPropAndSpecsArray.length; i++){
        if(foodPropAndSpecsArray[i].property.toString()==this.data.modalFood.property.toString()
          &&foodPropAndSpecsArray[i].specs.toString()==this.data.modalFood.specs.toString()){
          foodPropAndSpecsArray[i].num+=this.data.modalFood.num;
          same = true;
          break;
        }
      }
      if(!same){
        this.data.menuForNum[outIndex][index].push(this.data.modalFood);
      }
    } else {
      this.data.menuForNum[outIndex][index].push(this.data.modalFood);
    }
    this.setData({
      menuForNum: this.data.menuForNum
    });
    //修改原菜单份数和菜单分类份数
    this.data.menuForNum[outIndex][index][0].num += this.data.modalFood.num;
    this.setData({
      menuForNum: this.data.menuForNum
    });
    //修改菜单分类数目
    this.data.typeForNum[outIndex] += this.data.modalFood.num;
    this.setData({
      typeForNum: this.data.typeForNum
    });
    //修改总价
    this.countTotalPrice();
    this.hideModal();
  },
  //对话框属性点击事件
  clickModalProp: function(e) {
    var propertyLocation = e.currentTarget.dataset.inindex;
    this.data.modalFood.property[propertyLocation] = e.currentTarget.dataset.index;
    this.setData({
      modalFood: this.data.modalFood
    });
  },
  clickModalSpec: function(e) {
    this.data.modalFood.specs = e.currentTarget.dataset.index;
    this.setData({
      modalFood: this.data.modalFood
    });
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
    });
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 根据outIndex、index判断菜品是否有属性和规格
   */
  hasProOrSpec: function (outIndex, index) {
    var food = this.data.menu[outIndex].foods[index];
    if(food.property.length>0||food.specs.length>0){
      return true;
    } else {
      return false;
    }
  },
  /**
   * 加菜按钮
   */
  touchPlus: function (e) {
    var outIndex = e.currentTarget.dataset.outindex;
    var index = e.currentTarget.dataset.index;

    this.setData({
      touchFood: this.data.menu[outIndex].foods[index],
      outIndex: outIndex,
      index: index,
      popOutIndex: outIndex,
      popIndex: index
    });
    //修改菜单
    if(this.data.menuForNum[outIndex][index][0].num == this.data.menu[outIndex].foods[index].stock) {
      wx.showToast({
        title: '超出库存',
        icon: 'none',
        duration: 800
      });
    } else {
      //先判断是否需要选择属性，规格，如果要选择， 那么就弹窗，如果不要选择，就直接操作
      if(this.hasProOrSpec(outIndex, index)) {
        var touchFood2 = this.data.touchFood;
        var modalFood2 = {};
        modalFood2 = {
          "id": this.data.menu[outIndex].foods[index].id,
          "price": this.data.menu[outIndex].foods[index].price,
          "num": 0,
          "property": [],
          "specs": 0
        };
        for(var i=0; i< touchFood2.property.length;i++){
          modalFood2.property.push(0);
        }
        this.setData({
          modalFood: modalFood2
        });
        
        this.showModal();
      } else {
        //菜品没有属性或者规格，直接操作
        this.data.menuForNum[outIndex][index][0].num += 1;
        this.setData({
          menuForNum: this.data.menuForNum
        });
        //修改菜单分类数目
        this.data.typeForNum[outIndex] +=1;
        this.setData({
          typeForNum: this.data.typeForNum
        });
        //修改总价
        this.countTotalPrice();
      }
    }
  },
  /**
   * 减菜按钮
   */
  touchReduce: function (e) {
    var outIndex = e.currentTarget.dataset.outindex;
    var index = e.currentTarget.dataset.index;

    this.setData({
      touchFood: this.data.menu[outIndex].foods[index],
      outIndex: outIndex,
      index: index,
      popOutIndex: outIndex,
      popIndex: index
    });
    //修改菜单
    if(this.data.menuForNum[outIndex][index][0].num != 0) {
      if(this.hasProOrSpec(outIndex, index)) {
        var exceptOneFoods2 = new Array();
        for(var i=1; i<this.data.menuForNum[outIndex][index].length;i++){
          exceptOneFoods2.push(JSON.parse(JSON.stringify(this.data.menuForNum[outIndex][index][i])));
        }

        for(var i=0; i<exceptOneFoods2.length;i++){
          for(var j=0; j<exceptOneFoods2[i].property.length;j++){
            // exceptOneFoods2[i].property[j] = ;
            if(exceptOneFoods2[i].property[j]==0) {
              exceptOneFoods2[i].property[j]=this.data.touchFood.property[j].valueOne;
            } else if (exceptOneFoods2[i].property[j]==1) {
              exceptOneFoods2[i].property[j]=this.data.touchFood.property[j].valueTwo;
            } else if (exceptOneFoods2[i].property[j]==2) {
              exceptOneFoods2[i].property[j]=this.data.touchFood.property[j].valueThree;
            } else if (exceptOneFoods2[i].property[j]==3) {
              exceptOneFoods2[i].property[j]=this.data.touchFood.property[j].valueFour;
            } else if (exceptOneFoods2[i].property[j]==4) {
              exceptOneFoods2[i].property[j]=this.data.touchFood.property[j].valueFive;
            }
          }
          
          for(var j=0; j<this.data.touchFood.specs.length; j++){
            if(j==exceptOneFoods2[i].specs) {
              exceptOneFoods2[i].specs=this.data.touchFood.specs[j].name;
            }
          }
        }
        this.setData({
          exceptOneFoods: exceptOneFoods2
        });

        this.reduceShowModal();
      } else {
        this.data.menuForNum[outIndex][index][0].num -= 1;
        this.setData({
          menuForNum: this.data.menuForNum
        });
        //修改菜单分类数目
        this.data.typeForNum[outIndex] -=1;
        this.setData({
          typeForNum: this.data.typeForNum
        });
        //修改总价
        this.countTotalPrice();
      }
    } else {
      wx.showToast({
        title: '菜品不能低于0',
        icon: 'none',
        duration: 800
      });
    }
  },
  /**
   * 按钮菜单点击函数
   */
  touchType: function (e) {
    this.setData({
      scrollInto: -1,
      menuInto: e.currentTarget.dataset.index
    });
  },
  /**
   * 右侧滑动，子项滑动到顶监听函数
   */
  scrollToUpper: function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop,
      menuInto: -1
    })
    var length = this.data.top.length;
    for(var i=0; i<this.data.top.length; i++) {
      if(this.data.top[i] - this.data.top[0] <= this.data.scrollTop &&
        (i < length-1 && this.data.top[i+1] -this.data.top[0] > this.data.scrollTop)) {
          if(this.data.menuInto != i) {
            this.setData({
              scrollInto: i
            });
          }
        }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      menu: app.data.menu,
      mer: app.data.mer
    });
    //先判断app中是否已经有订单详情
    if(app.data.menuForNum.length==0) {
      //初始化点菜数组和菜单类总点菜数目数组
      this.resetMenuAndTypeFormNum();
    } else {
      this.setData({
        menuForNum: app.data.menuForNum,
        typeForNum: app.data.typeForNum
      });
      this.countTotalPrice();
    }
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //初始化每个右侧菜单类距离顶部位置
    var top2 = new Array();
    for(var i =0; i <this.data.menu.length; i++) {
      wx.createSelectorQuery().select('#menu' + i).boundingClientRect(function (rect) {
        var isTop = Number(rect.top);
        top2.push(isTop);
      }).exec();
    }
    this.setData({
      top: top2
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //先判断app中是否已经有订单详情
    var app = getApp();
    this.setData({
      menu: app.data.menu
    });
    if(app.data.menuForNum.length==0) {
      //初始化点菜数组和菜单类总点菜数目数组
      this.resetMenuAndTypeFormNum();
    } else {
      this.setData({
        menuForNum: app.data.menuForNum,
        typeForNum: app.data.typeForNum,
      });
    }
    if(app.data.menuRest) {
      this.resetMenuAndTypeFormNum();
      app.data.menuReset=false;
    }
    this.countTotalPrice();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var app = getApp();
    app.data.menuForNum = this.data.menuForNum;
    app.data.typeForNum = this.data.typeForNum;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var app = getApp();
    if(this.data.menuForNum.length!=0&&app.data.isOrder!=true) {
      app.data.menuForNum = this.data.menuForNum;
      app.data.typeForNum = this.data.typeForNum;
      
      app.data.isOrder = false;
    }
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