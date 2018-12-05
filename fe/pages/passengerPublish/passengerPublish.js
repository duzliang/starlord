const service = require('../../utils/service');
const app = getApp();
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login: false,
    tags: [
      { value: 'passenger_no_smoke', label: '不抽烟' },
      { value: 'passenger_last_mile', label: '要求接送到家' },
      { value: 'passenger_goods', label: '纯捎货' },
      { value: 'passenger_can_drive', label: '愿意换开车' }, 
      { value: 'passenger_chat', label: '健谈' },
      { value: 'passenger_luggage', label: '有大件行李' },
      { value: 'passenger_pet', label: '有宠物' },
      { value: 'passenger_no_carsickness', label: '不晕车' },
    ],
    trip_id: null,
    begin_date: null,
    begin_time: null,
    startLocation: null,
    endLocation: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    options = options || {};
    this.setData({
      is_login: app.globalData.is_login,
      trip_id: options.trip_id || null
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

  chooseLocation: function (e) {
    var locationType = e.currentTarget.dataset.location;
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        if (locationType == 'start') {
          that.setData({
            startLocation: res
          });
        } else {
          that.setData({
            endLocation: res
          });
        }
      },
    })
  },
  bindDateChange: function (e) {
    this.setData({
      begin_date: e.detail.value
    });
  },
  bindTimeChange: function (e) {
    this.setData({
      begin_time: e.detail.value
    });
  },

  /**
   * 微信授权获取个人信息
   */
  getUserInfo: (e) => {
    service.userCompleteUser(e.detail, app, self);
  },

  formSubmit: function (e) {
    const { detail } = e;
    const { value, target } = detail;
    const submitType = target.dataset.type;
    console.error(submitType);
    const { trip_id, begin_date, begin_time, startLocation, endLocation } = self.data;
    if (!begin_date) {
      wx.showToast({
        icon: 'none', title: '日期不能为空',
      });
    } else if (!begin_time) {
      wx.showToast({
        icon: 'none', title: '时间不能为空',
      });
    } else if (!startLocation) {
      wx.showToast({
        icon: 'none', title: '请选择始发点',
      });
    } else if (!endLocation) {
      wx.showToast({
        icon: 'none', title: '请选择终点',
      });
    } else {
      const params = {
        trip_id: trip_id,
        begin_date, begin_time,
        start_location_name: startLocation.name,
        start_location_address: startLocation.address,
        start_location_point: `(${startLocation.latitude},${startLocation.latitude})`,
        end_location_name: endLocation.name,
        end_location_address: endLocation.address,
        end_location_point: `(${endLocation.latitude},${endLocation.latitude})`,
        route: value.route,
        price_everyone: value.price_everyone,
        people_num: value.people_num,
        tips: value.tips,
      };
      const callback = (success, tripInfo) => {
        if (success) {
          wx.showToast({
            title: '提交成功'
          });
          if (submitType == 'publish') {
            wx.navigateTo({
              url: `/pages/creareFindCarInfo/passengerPublishInfo?trip_id=${tripInfo.trip_id}`,
            });
          } else {
            wx.navigateBack({
              delta: 1
            });
          }
        }
      }

      if (submitType == 'publish') {
        service.passengerPublish(params, callback);
      } else {
        service.passengerSave(params, callback);
      }
    }
  }
})