// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalFood: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var modalFood2 = {};
        modalFood2 = {
          "id": 1,
          "price": 1,
          "num": 0,
          "property": [],
          "specs": -1
        };
        for(var i=0; i< 1;i++){
          modalFood2.property.push(-1);
        }

        this.setData({
          modalFood: modalFood2
        });
  },

  clickModalProp: function(e) {
    // console.log(e);
    this.data.modalFood.property[0] = e.currentTarget.dataset.index;
    this.setData({
      modalFood: this.data.modalFood
    });
    console.log(this.data.modalFood.property[0]);
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