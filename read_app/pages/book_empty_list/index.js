// pages/book_empty_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  styleHeight: 0,
  listData: [],
  timer: null,
  token: wx.getStorageSync('token'),
  userId: wx.getStorageSync('userId'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        let temp = res.windowHeight + 'px';
        that.setData({
          styleHeight: temp
        })
      },
    })
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
    wx.request({
      url: `https://library.jessechiu.com/api/v1/borrowed/${this.data.userId}`,
      header: {
        'Authorization': `Bearer ${this.data.token}`
      },
      success: (result) => {
        console.log(result);
      },
      fail: err => {
        console.log(err)
      }
    })
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

  onFocus() {
    
  },

  queryBook(e) {
    console.log(e.detail.value)
    let configObj = {
      // author: e.detail.value,
      title: e.detail.value,
      // category: e.detail.value,
      start: 0,
      count: 10
    }
    wx.request({
      url: 'https://library.jessechiu.com/api/v1/public/books/',
      header: {
        'Authorization': `Bearer ${this.data.token}`
      },
      data: configObj
      ,
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          console.log(res.data.data.data)
          this.setData({
            listData: res.data.data.data
          })
        } else {
          console.log(res.errMsg);
        }
      }
    })
  },

  /**
   * 图书搜索函数
   */
  search(e) {
    let _self = this;
    clearTimeout(this.data.timer);

    this.setData({
      timer: setTimeout(_self.queryBook.bind(_self, e), 1000)
    })
  },

/**
 * 条形码扫描函数
 */
  scanner() {
    let _self = this;
    wx.scanCode({
      success: (res) => {
        if(res.errMsg === 'scanCode:ok') {
          wx.request({
            url: 'http://localhost:3000/search/book',
            data: {
              sendData: res.data  //假设这里扫描条形码得到的时书的ISBN
            },
            method: "POST",
            success: (res) => {
              console.log(res)
              _self.setData({
                listData: res.data
              })
            }
          })
        }
      }
    })
  },
  
  /**
   * 进入详细页面函数
   */
  enterItem(e) {
    console.log(e);
    let isbn = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/book-detail/detail?isbn=' + isbn,
    })
  },

  /**
   * 触碰时出现黑色的背景
   */
  touchStart() {
    this.setData({
      is_checked: true,
    })
  },

  /**
   * 触碰结束时黑色背景消失
   */
  touchEnd() {
    this.setData({
      is_checked: false,
    })
  },
})