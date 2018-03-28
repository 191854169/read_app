
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情详情',
    timer: null,
    listData: [],
    totalData: [],
    is_checked: false,
    styleHeight: 0,
    start: 0,
    token: wx.getStorageSync('token') || '',
    userId: wx.getStorageSync('userId'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('listData', this.data.listData);
    const that = this;
    //设置高度
    wx.getSystemInfo({
      success: function(res) {
        let temp = res.windowHeight + 'px';
        that.setData({
          styleHeight: temp
        })
      },
    });
    

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
    const currentTime = wx.getStorageSync('currentTime') || 0;
    if (this.data.listData.length === 0) {
      this.requestBookData(this.data.start).then(result => {
        this.setData({
          listData: result
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
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
    const requestCount = this.data.start + 20;
    const _self = this;
    console.log('it is bottom!');
    clearTimeout(this.data.timer);
    let temp = setTimeout(function(){
      _self.requestBookData(requestCount).then(result => {
      let currentListData = [..._self.data.listData,...result];
      _self.setData({
        listData: currentListData
      })
    })
    .catch(err => {
      console.log(err)
    })},2000)

    this.setData({
      timer: temp
    })
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
    clearTimeout(this.data.timer)
    console.log(e);
    let isbn = e.currentTarget.dataset.isbn;
    wx.navigateTo({
      url: `/pages/book-detail/detail?isbn=${isbn}&from=list`,
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
  },
   requestBookData(start,count = 20) {
     const _self = this;
     return new Promise(function(resolve, reject) {
       wx.request({
         url: `https://library.jessechiu.com/api/v1/public/books/?start=${start}&count=${count}`,
         header: {
           'Authorization': `Bearer ${_self.data.token}`
         },
        //  data: {
        //    params: {
        //      start: start,
        //      count: count
        //    }
        //  },
         success: (res) => {
           console.log(res.data.data);
           let binaryInfo = res.data.data;  //返回来的图书馆数据对象
           let bookInfo = binaryInfo.data;  //所有的图书信息
           resolve(bookInfo);
         },
         fail: err => {
           reject(err);
         }
       })
     })
   }
})