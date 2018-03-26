//index.js
//获取应用实例
const app = getApp();
const Toast = require('../../components/toast/index.js');

Page(Object.assign({},Toast,{

  /**
   * 页面的初始数据
   */
  data: {
    timer: null,

    //图书状态的一些变量
    selectStatus: ['请选择', '在库', '借出'],
    index: 0,
    borrow_status: false,
    is_exist: false,  //判断书库是否有我们要添加的书

    //这些事form中的字段
    img_url: '',  //图片的URL
    isbn: Number,  //图书的ISBN
    id: Number,  //图书的编号
    bookName: '',  //图书的名字
    author: '',  //图书的作者
    category: '',  //图书的种类
    detail: '',  //图书的简介
    status:'',  //图书的状态：1、在库 2、借出
    borrower: '',  //借书的人

    startTime: '',  //借书的开始时间
    endTime: '',  //借书的结束时间
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
    let date = new Date();
    let startTime = date.toLocaleDateString().replace(/(\/)/g,'-');
    let endTime = date.toLocaleDateString().replace(/(\/)/g,'-');
    console.log(startTime);
    this.setData({
      startTime: startTime,
      endTime: endTime,
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

  /**
   * 开始时间选择触发函数
   */
  bindStartTimeChange(e) {
    if (!this.judgeTime(e.detail.value, this.data.endTime)) {
      this.showToast('开始时间不能晚于结束时间', 2000);
    } else {
      this.setData({
        startTime: e.detail.value
      })
    }
  },

  /**
   * 结束时间选择触发函数
   */
  bindEndTimeChange(e) {
    if(!this.judgeTime(this.data.startTime, e.detail.value)) {
      this.showToast('开始时间不能晚于结束时间', 2000);
    } else {
      this.setData({
        endTime: e.detail.value
      })
    }
  },

  /**
   * 时间判断函数
   */
  judgeTime(startTime, endTime) {
    // let startTime = startTime;
    // let endTime = endTime;
    let temp = new Date(startTime);
    let temp1 = new Date(endTime);
    if (temp.getTime() > temp1.getTime()) {
      return false;
    }
    return true;
  },

  /**
   * 表单提交函数
   */
  formSubmit(e) {
    console.log(e);
    let _self = this;
    let formData = e.detail.value;
    let sendData = formData;
    sendData.status = this.data.selectStatus[sendData.status];
    if(sendData.status === '请选择' || sendData.status === '在库') {
      sendData.startTime = '';
      sendData.endTime = '';
      sendData.dateTime = '';
      sendData.borrower = '';
    } else {
      sendData.dateTime = formData.startTime.replace(/(\-)/g, '/') + '-' + formData.endTime.replace(/(\-)/g, '/');
    }
    sendData.img_url = this.data.img_url;

    if(this.data.is_exist) {
      _self.showToast('书库中已有该书哟！',3000);
    } else if (!this.judgeTime(sendData.startTime, sendData.endTime)) {
      _self.showToast('开始时间不能晚于结束时间哦！', 3000);
    } else {
      wx.request({
        url: 'http://127.0.0.1:3001/book/save',
        method: "POST",
        data: {
          sendData: sendData
        },
        success: (res) => {
          console.log(res);
          _self.showToast(res, 2000);
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  /**
   * 返回上一界面函数/重置函数
   */
  formReset() {
    console.log('退出')
    wx.navigateBack({
      delta:1,
    })
  },

  /**
   * 图书查询函数
   */
  isbnInput(e) {
    //9787111479123
    clearTimeout(this.data.timer);
    let _self = this;
    let data = e.detail.value;
    let bookRequest = function () {
      //在这里进行判断，数据库中是否已经存在该图书
      new Promise(function(resolve, reject) {
        wx.request({
          url: 'http://127.0.0.1:3001/book/search',
          data: {
            sendData: data
          },
          method: "POST",
          success: (res) => {
            resolve(res.data);
          },
          fail: (err) => {
            reject(err);
          }
        })
      })
      .then((result) => {
        if (result.length <= 0) {
          _self.setData({
            is_exist: false
          })
          let url = 'https://api.douban.com/v2/book/isbn/:' + data;
          wx.request({
            url: url,
            header: {
              "Content-Type": "json"
            },
            success: (res) => {
              let bookData = res.data;
              console.log(res.data);
              _self.dealData(bookData, _self);
            }
          })
        } else {
          _self.showToast('书库中已经有该书了哟！', 3000);
          _self.setData({
            is_exist: true
          })
        }
      })
      .catch((err) => {
        console.log(err);
        _self.showToast(err, 3000);
      })
    }

    //这里进行防抖动操作
    let temp = setTimeout(bookRequest, 1000);

    this.setData({
      timer:temp
    })
  },

  /**
   * 处理从豆瓣获取到的图书数据
   */
  dealData(bookData ,_self) {
    let bookName = '';
    //这里是判断是不是会有副标题
    if (bookData.title != '' && bookData.subtitle != '') {
      bookName = bookData.title + ' : ' + bookData.subtitle;
    } else {
      bookName = bookData.title;
    }
    let author = bookData.author;
    let detail = bookData.summary;
    let img_url = bookData.images.medium;
    _self.setData({
      bookName: bookName,
      author: author,
      detail: detail,
      img_url: img_url
    })
  },

  /**
   * 当状态改变选择的时候触发
   */
  selectChange(e) {
    console.log(e.detail);
    this.setData({
      index: e.detail.value,
      status: this.data.selectStatus[e.detail.value]
    })
    if(this.data.status === '在库' || this.data.status === '请选择') {
      this.setData({
        borrow_status: false,
      })
    }

    if(this.data.status === '借出') {
      this.setData({
        borrow_status: true
      })
    }
  }
}))
