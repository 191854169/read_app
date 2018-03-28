// pages/personal/personal.js
let Toast = require('../../components/toast/index.js');

Page(Object.assign({},Toast,{

  /**
   * 页面的初始数据
   */
  data: {
  name: '',
  bookNum: '',
  userId: '',
  token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loginFlag = wx.getStorageSync('loginFlag');
  if(!loginFlag){
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
    const token = wx.getStorageSync('token');
    const userId = wx.getStorageSync('userId');
      let temp = wx.getStorageSync('userId');
      if(temp != ''){
      this.setData({
        name: temp,
        userId: userId,
        token: token
      })
    }
    
    if(userId && token) {
      wx.request({
        url: `https://library.jessechiu.com/api/v1/borrowed/count/${this.data.userId}`,
        header: {
          'Authorization': `Bearer ${this.data.token}`
        },
        success: result => {
          console.log(result);
          this.setData({
            bookNum: result.data.data
          })
        },
        fail: err => {
          console.log(err)
        }
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
  console.log('it is bottom')
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
        console.log(res.result);
        wx.navigateTo({
          url: `/pages/book-detail/detail?isbn=${res.result}&from=personal`,
        })

        // wx.showModal({
        //   title: '提示',
        //   content: '请问您确定要将某书收入囊中么？',
        //   success: (res) => {
        //     console.log(res);
        //   },
        //   fail: (err) => {
        //     console.log(err);
        //   }
        // })
        
      },
      fail: (err) => {
        console.log(err);
        // this.showToast('已取消', 2000);
      }
    })
  },
  borrowNum(e){
    let id = e.currentTarget.dataset.id;
    console.log(id);
   wx.navigateTo({
     url: '/pages/book_empty_list/index?from=personal',
   })
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
  },
  /**
   * 还书
   */
  deleteBook() {
    const _self = this;
    new Promise(function(resolve, reject) {
      wx.scanCode({
        success: (res) => {
          console.log(res);
          resolve(res.result)
        },
        fail: (err) => {
          reject(err);
          console.log(err);
          _self.showToast('已取消', 2000);
         }
      })
    })
    .then(result => {
      const aIsbn = [];
       wx.showModal({
        title: '提示',
        content: '您确认归还该书？',
        success: res => {
          if (res.cancel === false) {
            wx.request({
              url: `https://library.jessechiu.com/api/v1/borrowed/${this.data.userId}`,
              method: 'DELETE',
              header: {
                'Authorization': `Bearer ${this.data.token}`
              },
              data: {
                // isbn10: '', result为isbn13
                isbn: JSON.stringify(['9787115275790']),
              },
              success: res => {
                console.log(res)
                wx.showToast({
                  title: '归还成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true
                })
              },
              fail: err => {
                Promise.reject(err);
              }
            })
          }
        }
      })
    })
    .catch(err => {
      _self.showToast(err.errMsg,2000);
    })
  }
}))