// pages/book-detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  flag: true,
  isFold: true,
  bookDetail: {},
  token: wx.getStorageSync('token') || '',
  userId: wx.getStorageSync('userId'),
  from: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取到图书的isbn
  const isbn = options.isbn;
  this.setData({
    from: options.from
  })

  console.log(`bookDetail: ${isbn}`);
  wx.showLoading({
    title: '加载中',
    mask: true,
  })

  this.queryBookDetail(isbn).then((result) => {
    this.setData({
      bookDetail: result
    })
    wx.hideLoading();
  })
  },
  /**
   * 获取图书详情
   */
  queryBookDetail(isbn) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://library.jessechiu.com/api/v1/public/books/isbn/${isbn}`,
        // url: 'https://library.jessechiu.com/api/v1/public/books/',
        header: {
          'Authorization': `Bearer ${this.data.token}`,
        },
        // data: {
        //   title: isbn
        // },
        success: (res) => {
          console.log(res)
          resolve(res.data.data)
        },
        fail: (err) => {
          reject(err);
        }
      })
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

  /**
   * 用户借书
   */
  borrowBook: function() {
    const _self = this;
    new Promise(function(resolve, reject) {

      wx.showModal({
        title: '提示',
        content: '请问您确定要将某书收入囊中么？',
        success: (res) => {
          console.log(res);
          // console.log('success');
          res.cancel === false ? resolve('success') : reject('fail')
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
    .then(item => {
      console.log(item);
      const currentTime = new Date();
      wx.request({
        url: `https://library.jessechiu.com/api/v1/borrowed/${this.data.userId}`,
        method: 'PUT',
        header: {
          'Authorization': `Bearer ${this.data.token}`
        },
        data: {
          borrowingTime: currentTime,
          returnTime: new Date(1000*60*60*24*20 + currentTime.valueOf()),
          isbn10: this.data.bookDetail.isbn10,
          isbn13: this.data.bookDetail.isbn13
          // isbn10: '7115275793',
          // isbn13: '9787115275790',
        },
        success: result => {
          console.log('what');
          console.log(result);
          return result
        },
        fail: err => {
          console.log(err)
          Promise.reject(err)
        }
      })
      })
      .then(item => {
        wx.showToast({
          title: '借阅成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function() {
            setTimeout(function(){
              if (_self.data.from === 'personal') {
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
              } else if(_self.data.from === 'list') {
                wx.switchTab({
                  url: '/pages/book_list/list',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            },2000);
          }
        })
      })
    .catch(err => console.log(err))
  },
  /**
   * 扩展开详情
   */
  expandSummary() {
    this.setData({
      isFold: false
    })
  }
})