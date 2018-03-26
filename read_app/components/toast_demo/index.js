/**toast.js */
module.exports = {
  showToast(title, timeout) {
  var Toast = this.data.Toast || {};
  clearTimeout(Toast.timer);
  Toast = {
    show: true,
    title
  };

  this.setData({
    Toast
  });

  var timer = setTimeout(() => {
    this.clearToast();
  },timeout || 2000);

  this.setData({
    'Toast.timer':timer,
  });
  
},

clearToast(){
  var Toast = this.data.Toast || {};
  clearTimeout(Toast.timer);

  this.setData({
    'Toast.show':false,
  })
}
}