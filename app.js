App({

  /**
   * 全局变量
   */
  data:{
    realUrl: "https://www.donghuastar.com",
    loadStatus: false,
    openid: "",
    numberOfDiners: -1,
    res: "",
    table: "",
    inited: 0,
    menu: [],

    menuForNum: [],
    typeForNum: [],
    orders: [],
    totalPrice: 0,

    returnTotalPrice: 0,
    hasReturn: 0,

    tableName: '',
    tabTypeName: '',
    remark: '',

    alreadyOrders: [],
    orderSearchId: '',
    orderTime: '',
    isAdd: false,
    isScan: false,
    menuReset: false,
    isOrder: false,
    mer: {},

    // 全局转发信息
    globalShareInfo: {
      title: '点菜宝-扫码点餐',
      path: '/pages/home/home',
      imageUrl: 'https://www.donghuastar.com/static/other-img/wechatglobalShare.jpg'
    }
  },
  
  
 
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    if(this.data.isScan==true) {
      this.data.isScan=false;
      this.data.menuReset = true;
    }
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
