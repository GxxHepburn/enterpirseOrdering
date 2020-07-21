App({

  /**
   * 全局变量
   */
  data:{
    realUrl: "http://www.donghuastar.com",
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

    tableName: '',
    tabTypeName: '',
    remark: '',

    alreadyOrders: [],
    orderSearchId: '',
    orderTime: '',
    isAdd: false,

    appPayStatus: false
  },
  
  /**
   * 抽出modal方法
   */
  failLoadModal: function (that) {
    wx.showModal({
      title: '登陆',
      content: '登陆出错，请重试',
      success: function (repeatRes){
        if(repeatRes.confirm) {
          that.loadByTxServer();
        } else {
          //虽然违背用户意愿（取消登陆）但是仍然强制登陆，因为不登陆系统就没办法正常运行
          wx.showToast({
            title: '选择就餐人数后，点击"开始点菜"按钮继续',
            icon: 'none',
            duration: 3500
          })
        }
      }
    });
  },
  /**
   * 抽出登陆方法
   */
  loadByTxServer: function () {
    let that = this;
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.data.realUrl + "/wechat/login",
            method: 'POST',
            data: {
              code: res.code
            },
            success(resMy) {
              //登陆成功
              if (resMy.statusCode == 200) {
                that.data.loadStatus = true;
                that.data.openid = resMy.data;
                console.log("app.js_loadByTxServer: ");
                console.log(that.data);
              }
            }
          })
        }
      }
    })
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.loadByTxServer();
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
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
