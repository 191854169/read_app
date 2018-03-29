// pages/login/login.js
let Parser = require("../../utils/xmlParser/dom-parser");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  formSubmit: function(e){
    const userId = e.detail.value.username;
    const password = e.detail.value.password;
    const randomString = e.detail.value.randomString;
    wx.setStorageSync('userId', userId)
    
   /**
    * 首次登陆
    * 1、发送到我的服务器进行用户验证
      2、对数据库进行查找，如果找到用户则登陆成功，生成sessionId返给小程序。小程序将sessionId存储在localstorage
      3、在每次操作的时候进行sessionId验证。如果无则查找数据库，如果有则验证是否过期。
    */

    this.login(userId, password).then(result => {
      const currTime = +new Date();
      const expireTime = currTime + 60 * 60 * 24 * 7;
      wx.setStorageSync('expireTime', expireTime);
      wx.setStorageSync('token', result);
      wx.setStorageSync('loginFlag', true)
      wx.switchTab({
        url: '/pages/book_list/list',
      })
    })
    .catch(err => {
      console.log(err);
    })

  },

  /**
   * 用户登录
   */
  login(userId, password){
    return new Promise(function(resolve, reject) {
      wx.request({
        // url: 'https://library.jessechiu.com/api/v1/public/login',
        url: 'https://library.jessechiu.com/api/v1/public/client/login',
        method: 'POST',
        data: {
          userId: userId,
          password: password
        },
        success: (res) => {
          console.log(res)
          const userInfo = res.data.data.userInfo;
          const token = res.data.data.token;
          resolve(token);
        },
        fail: err => {
          console.log(err);
          reject(err);
        }
      })
    })
  },

  /**
   * 获取用户设备信息
   */
  getUserAgent() {
    wx.getSystemInfo({
      success: function(res) {
        return res.model;
      },
    })
  }
})