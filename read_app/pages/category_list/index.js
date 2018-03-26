// pages/category_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [{ id: 1, name: '传记' }, { id: 2, name: '绘本' }, { id: 3, name: '管理' }, { id: 4, name: '技术' }, { id: 5, name: '教育' },
    { id: 6, name: '经管' }, { id: 7, name: '科普' }, { id: 8, name: '历史' }, { id: 9, name: '励志' }, { id: 10, name: '旅行' },
    { id: 11, name: '期刊' }, { id: 12, name: '亲子' }, { id: 13, name: '散文' }, { id: 14, name: '设计' }, { id: 15, name: '社科' },
    { id: 16, name: '生活' }, { id: 17, name: '童话' }, { id: 18, name: '文学' }, { id: 19, name: '小说' }, { id: 20, name: '心理' },],
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let category = '';
    this.data.category.forEach((item) => {
      if (item.id == id) {
        category = item.name;
      }
    })
    console.log(category);
    wx.request({
      url: 'http://etc.landicorp.com:8080/Library/WeChat/WeChatGetBooks?BiaoQian=' + category + '&ShuMing=',
      success: (res) => {
        console.log(res);
        let temp = [];
        let arr = [];
        var pattern = new RegExp('<p.*?>(.*?)<\/p>', 'g');
        // temp = res.data.match(pattern);
        temp = pattern.exec(res.data);
        while (temp) {
          arr.push(temp[1]);
          temp = pattern.exec(res.data);
        }
        let obj = {};
        let data = [];
        arr.forEach((item, index) => {
          if (index % 6 == 0) {
            obj.num = item;
            if (index > 0) {
              data.push(obj);
            }
            obj = {};
          }
          if (index % 6 == 1) {
            obj.name = item;
          }
          if (index % 6 == 2) {
            obj.author = item;
          }
          if (index % 6 == 3) {
            obj.category = item;
          }
          if (index % 6 == 4) {
            obj.isBorrow = item;
          }
          if (index % 6 == 5) {
            obj.ISBN = item;
            obj.imgUrl = 'http://etc.landicorp.com:8080/Library/BooksP/' + item + '.jpg';
          }
        })
        this.setData({
          listData: data,
        })
      }
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
  
  }
})