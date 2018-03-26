// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: [],
    category: [{ id: 1, name: '传记' }, { id: 2, name: '绘本' }, { id: 3, name: '管理' }, { id: 4, name: '技术' }, { id: 5, name: '教育' },
                {id: 6, name: '经管' }, { id: 7, name: '科普' }, { id: 8, name: '历史' }, { id: 9, name: '励志' },{ id: 10, name: '旅行' },
                { id: 11, name: '期刊' }, { id: 12, name: '亲子' }, { id: 13, name: '散文' }, { id: 14, name: '设计' }, { id: 15, name: '社科' },
                { id: 16, name: '生活' }, { id: 17, name: '童话' }, { id: 18, name: '文学' }, { id: 19, name: '小说' }, { id: 20, name: '心理' },
                { id: 21, name: '哲学' }, { id: 22, name: '职场' }, { id: 23, name: '其它' },],
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
    let arr = [];
    for(let i=1; i < 24; i++) {
      let temp = 'http://etc.landicorp.com:8080/Library/images/Tags_' + i + '.jpg';
      let id = 1;
      arr.push({url:temp, id: id});
      id = id + 1;
    }
    this.setData({
      imgData: arr
    })

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

  enterItem(e){
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/category_list/index?id=' + id,
    })
  }
})