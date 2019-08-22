import Vue from 'vue';
import App from './App.vue';
// import * as api from '../public/sdk.umd'

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');

window.lenovoApi('robotService', {
  name: 'yefan',
  title: '智能客服',
  robotUrl: 'https://imccdev.lenovo.com.cn/webchat#/webchat?channel=webchat&tab=chatRobot&type=1&isLogin=2',
  icon: 'http://js.90sjimg.com/images/commercial.png', // 只支持透明背景PNG格式, 非必传, 为空时为默认icon, 只能是链接
  hasIcon: true // 是否显示icon
})

window.lenovoApi('robotService', {
  name: 'yefan',
  title: '智能客服',
  robotUrl: 'https://imccdev.lenovo.com.cn/webchat#/webchat?channel=webchat&tab=chatRobot&type=1&isLogin=2',
  icon: '', // 只支持透明背景PNG格式, 非必传, 为空时为默认icon, 只能是链接
  hasIcon: true // 是否显示icon
})

window.lenovoApi('robotService', {
  name: 'yefan',
  title: '智能客服',
  robotUrl: 'https://imccdev.lenovo.com.cn/webchat#/webchat?channel=webchat&tab=chatRobot&type=1&isLogin=2',
  icon: '', // 只支持透明背景PNG格式, 非必传, 为空时为默认icon, 只能是链接,
  hasIcon: false // 是否显示icon
})

window.lenovoApi('peopleService', {
  name: 'yefan',
  title: '人工客服', // 需要展示的icon文字
  queueCode: 'webchat_5cf729a670368', // 指定判断时间的队列
  icon: '', // 只支持透明背景PNG格式, 非必传, 只能是链接
  config: {}, // 登录模式下给定的用户信息,无数据或者没传时为游客模式,
  chatQueueCode: '', // 人工客服进入的队列，为空或未传时进入点选页面
  robotUrl: 'https://imccdev.lenovo.com.cn/webchat#/webchat?channel=webchat&tab=chatRobot&type=1&isLogin=2',
  hasIcon: true
})

window.lenovoApi('staticShow', {
  name: 'yefan',
  title: '电话咨询', // 需要展示的icon文字
  text: '电话咨询：4000-800-9838', // 需要展示的额外文字
  icon: '', // 只支持透明背景PNG格式, 非必传, 只能是链接
  hasIcon: true,
  id: 1 // 静态展示ID，必填且ID唯一
})

window.lenovoApi('timingFunc', {
  name: 'yefan',
  title: '11121',
  delay: 1000, // 弹窗延迟时间
  time: 24, // localstorage有效时间,单位为小时
  url: 'https://imccdev.lenovo.com.cn/#/'
})
