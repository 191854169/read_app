
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情',
    timer: null,
    // listData: [],
    totalData: [],
    is_checked: false,
    styleHeight: 0,
    token: wx.getStorageSync('token') || ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('listData', this.data.listData);
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        let temp = res.windowHeight + 'px';
        that.setData({
          styleHeight: temp
        })
      },
    });

    // wx.request({
    //   url: 'http://localhost:3000/a/about',
    //   success: (res) => {
    //     console.log(res);
    //     let temp = res.data;
    //     // temp.forEach((item) => {
    //     //   item.src = '../../resource/image/' + item.ISBN + '.png';
    //     // })
    //     this.setData({
    //       listData: temp
    //     })
    //   }
    // })
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
    // console.log(this.data.token)
    // let token = wx.getStorageSync('token');
    // console.log(token)
    wx.request({
      url: 'https://library.jessechiu.com/api/v1/public/books/',
      header: {
        'Authorization': `Bearer ${this.data.token}`
      },
      data: {
        params: {
          start: 0,
          count: 20
        }
      },
      success: (res) => {
        console.log(res.data.data);
        let binaryInfo = res.data.data;  //返回来的图书馆数据对象
        let bookInfo = binaryInfo.data;  //所有的图书信息
        // temp.forEach((item) => {
        //   item.src = '../../resource/image/' + item.ISBN + '.png';
        // })
        this.setData({
          listData: bookInfo
        })
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
    console.log('xxx');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  getToken() {},
  upper(e){
  },
  lower(e){
    let listData = this.data.listData;
    let length = listData.length;
    let sliceData = this.data.totalData.slice(length,length+20);
    sliceData.forEach((item) => {
      listData.push(item);
    })
    this.setData({
      listData: listData,
    })
  },
  scroll(e){
    // console.log('scroll');
    // console.log(e);
  },

  enterItem(e){
    console.log(e);
    let isbn = e.currentTarget.dataset.isbn;
    wx.navigateTo({
      url: '/pages/book-detail/detail?isbn='+ isbn,
    })
  },

  scanner(){
    wx.scanCode({
      success: (res) => {
        console.log(res);
        if(res.errMsg == 'scanCode:ok'){
          let temp = res.result;
          //发一个获取书籍的请求连接，请求回来之后  

          //发出一个提示
          wx.showModal({
            title: '提示',
            content: '是否要将某书加入您的借阅小书库？',
            success: (res) => {
              console.log(res);
              if(res.cancel == true){
                console.log('我再考虑考虑');                
              }
              if(res.confirm == true){
                console.log('我考虑好了，加入吧');
              }
            },
            fail: () => {},
          })
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  search(e) {
    let temp = res.detail.value;
    clearTimeout(this.data.timer);

    this.setData({
      timer: setTimeout(() => {
        //发送一个书籍查询，查询到之后将data赋给listData
      }, 3000)
    })
  },

  touchStart() {
    this.setData({
      is_checked: true,
    })
  },

  touchEnd() {
    this.setData({
      is_checked: false,
    })
  },

  onFocus() {
    wx.navigateTo({
      url: '/pages/book_empty_list/index',
    })
  }
})