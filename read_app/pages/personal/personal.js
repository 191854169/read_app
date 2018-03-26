// pages/personal/personal.js
let Toast = require('../../components/toast/index.js');

Page(Object.assign({},Toast,{

  /**
   * 页面的初始数据
   */
  data: {
  flag: true,
  name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  if(this.data.flag !== true){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

  let temp = wx.getStorageSync('name');
  // if(temp != ''){
    // console.log(temp);
    this.setData({
      name: temp,
    })
  // }
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
      let temp = wx.getStorageSync('name');
      if(temp != ''){
      console.log(temp);
      this.setData({
        name: temp,
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  borrowBook(){
    wx.scanCode({
      success: (res) => {
        console.log(res);
        console.log('success');

        wx.showModal({
          title: '提示',
          content: '请问您确定要将某书收入囊中么？',
          success: (res) => {
            console.log(res);
          },
          fail: (err) => {
            console.log(err);
          }
        })
        // this.showToast('已借出',2000);
      },
      fail: (err) => {
        console.log(err);
        this.showToast('已借出', 2000);
      }
    })
  },
  borrowNum(e){
    let id = e.currentTarget.dataset.id;
    console.log(id);
  },

  /**
   * 跳转到添加书籍界面
   */
  addBook() {
    wx.navigateTo({
      url: '/pages/addBook/index',
    })
  },

  /**
   * 这里是添加书籍的扫码函数
   */
  scanBook() {
    wx.scanCode({
      onlyFromCamera:true,
      success: (res) => {
        console.log(res);
        if(res.errMsg = "scanCode:ok") {
          //假设这里扫描数据的条形码获得的时数据的ISBN号，这里需要跳转到添加数据界面
          wx.navigateTo({
            url: '/pages/addBook/index' + res.data,
          })
        }
      },
      fail: (err) => {
        console.log(err);
      }
    })
  }
}))