import template from 'lodash.template'
import tempFile from 'html-loader!./template/containerTemp.ejs'
import robotFile from 'html-loader!./template/robotItemTemp.ejs'
import serviceFile from 'html-loader!./template/peopleItemTemp.ejs'
import staticItemFile from 'html-loader!./template/staticItemTemp.ejs'
import maskFile from 'html-loader!./template/maskTemp.ejs'
import popFile from 'html-loader!./template/popTemp.ejs'
import('./style/index.scss');

// 静态按钮数量
let staticNum = 0

const functionArr = {
  robotService: function(options) {
    // 渲染机器人咨询容器`
    const compiled = template(robotFile)
    const htmlStr = compiled(options)
    // 将html模板挂载到父级容器中
    const container = document.getElementById('im-container')
    const tag = document.createElement('div')
    tag.innerHTML = htmlStr
    container.appendChild(tag)
    tag.addEventListener('click', () => {
      window.open(options.robotUrl)
    })
  },
  peopleService: function(options) {
    createMask(options)
    // 渲染人工咨询容器`
    const compiled = template(serviceFile)
    const htmlStr = compiled(options)
    // 将html模板挂载到父级容器中
    const container = document.getElementById('im-container')
    const tag = document.createElement('div')
    tag.innerHTML = htmlStr
    container.appendChild(tag)
    tag.addEventListener('click', () => {
      checkQueueTime(options)
    })
  },
  timingFunc: function(options) {
    if (Storage.prototype.getExpire('popShow')) {
      Storage.prototype.setExpire('popShow', true, options.time)
      setTimeout(() => {
        createPop(options)
      }, options.delay)
    } else {
      console.log('不弹窗')
    }
  },
  staticShow: function(options) {
    staticNum ++
    // 渲染静态容器
    const compiled = template(staticItemFile)
    const htmlStr = compiled(options)
    // 将html模板挂载到父级容器中
    const container = document.getElementById('im-container')
    const tag = document.createElement('div')
    tag.innerHTML = htmlStr
    container.appendChild(tag)
    const popover = document.getElementById('popover' + options.id)
    const popoverArrow = document.getElementById('arrow' + options.id)
    tag.addEventListener('mouseover', () => {
      popover.style.display = 'block'
      popoverArrow.style.display = 'block'
    })
    tag.addEventListener('mouseout', () => {
      popover.style.display = 'none'
      popoverArrow.style.display = 'none'
    })
  }
};

function createPop(options) {
  // 渲染容器
  const compiled = template(popFile)
  const htmlStr = compiled(options)
  // 将html模板挂载到父级容器中
  const tag = document.createElement('div')
  tag.innerHTML = htmlStr
  document.body.appendChild(tag)
  const cancelBtn = document.getElementById('popCancelBtn')
  cancelBtn.addEventListener('click', () => {
    tag.style.display = 'none'
  })
  const confirmBtn = document.getElementById('popConfirmBtn')
  confirmBtn.addEventListener('click', () => {
    window.open(options.url)
  })
}

function createMask(options) {
  console.log('options', options)
  const compiled = template(maskFile)
  const htmlStr = compiled()
  // 将html模板挂载到父级容器中
  const tag = document.createElement('div')
  tag.innerHTML = htmlStr
  document.body.appendChild(tag)
  console.log(tag)
  const  mask = document.getElementById('container-mask')
  const cancelBtn = document.getElementById('maskCancelBtn')
  console.log(cancelBtn)
  cancelBtn.addEventListener('click', () => {
    mask.style.display = 'none'
  })
  const confirmBtn = document.getElementById('maskRobotBtn')
  console.log(confirmBtn)
  confirmBtn.addEventListener('click', () => {
    window.open(options.robotUrl)
  })
}

function createContainer() {
  // 渲染container容器
  const compiled = template(tempFile)
  const htmlStr = compiled({
    title: 'demo'
  })
  const el = document.createElement('div')
  el.id = 'demo-container'
  el.className = 'im-container'
  el.innerHTML = htmlStr
  document.body.appendChild(el)
}

// 原型上添加localstorage的添加方法
Storage.prototype.setExpire = (key, value, expire) => {
  const obj = {
    data: value,
    time: Date.now(),
    expire: expire // 过期时间,默认为小时
  }
  localStorage.setItem(key, JSON.stringify(obj))
}

// 原型上添加localstroage的读取方法 为true
Storage.prototype.getExpire = (key) => {
  let val = localStorage.getItem(key)
  if (!val) { // 不存在,则为true
    return true
  }
  val = JSON.parse(val)
  if (Date.now() - val.time > val.expire * 60 * 60 * 1000) {
    localStorage.removeItem(key)
    return true
  } else {
    return false
  }
}

// 检查是否在服务时间
function checkQueueTime(options) {
  const url = 'https://imccdev.lenovo.com.cn/api/csc/queue/check/serviceTime'
  const data = {
    skill: options.queueCode
  }
  ajaxApi('GET', data, url, function(data) {
    if (JSON.parse(data).statusCode === '2000' || JSON.parse(data).statusCode === 2000) {
      // todo 在服务时间,跳转点选页面或者直接进入队列
      // const mask = document.getElementById('mask')
      // mask.style.display = 'block'
      checkQueueInfo(options)
    } else {
      // todo 不在服务时间
      const mask = document.getElementById('container-mask')
      mask.style.display = 'block'
    }
  })
}

// 判断进入什么队列，携带什么参数
function checkQueueInfo(options) {
  if (options.chatQueueCode && options.chatQueueCode !== '' ) {
    console.log('进入指定队列')
    if (options.config && options.config !== {}) {
      console.log('登录模式进入')
      window.open('/webchat#/webchat?channel=webchat&type=2&isLogin=2&skill=' + options.chatQueueCode)
    } else {
      console.log('非登录模式进入')
      window.open('/webchat#/webchat?channel=webchat&type=2&isLogin=2&skill=' + options.chatQueueCode)
    }
  } else {
    window.open('/webchat#/chatQueue?screen=web')
  }
}

// ajax方法封装,使用回调函数获取返回值
function ajaxApi(method, data, url, success) {
  const ajaxUrl = url
  let ajax = null
  // const ajax = new XMLHttpRequest()
  if (window.XMLHttpRequest) {
    ajax = new XMLHttpRequest()
  } else if (window.ActiveXObject('Microsoft.XMLHTTP')) {
    ajax = new ActiveXObject('Microsoft.XMLHTTP')
  } else {
    alert('该浏览器不支持Ajax！')
  }
  const paramArray = []
  for (const key in data) {
    paramArray.push(key + '=' + data[key])
  }
  const dataPost = paramArray.join('&')
  // 第二步： 设置状态监听函数
  ajax.onload = function() {
    // console.log(ajax.readyState)
    // console.log(ajax.status)
    // 第五步：在监听函数中，判断readyState=4 && status=200表示请求成功
    if (ajax.readyState === 4 && ajax.status === 200) {
      // 第六步： 使用responseText、responseXML接受响应数据，并使用原生JS操作DOM进行显示
      // console.log(ajax.responseText)
      // console.log(ajax.responseXML) // 返回不是XML，显示null
      const result = ajax.responseText
      success(result)
    }
  }
  if (method.toUpperCase() === 'POST') {
    ajax.open(method, ajaxUrl, true)
    ajax.setRequestHeader('Content-type', 'application/json')
    ajax.setRequestHeader('charset', 'utf-8')
    ajax.send(dataPost)
  } else if (method.toUpperCase() === 'GET') {
    ajax.open(method, ajaxUrl + '?' + dataPost, true)
    ajax.setRequestHeader('Content-type', 'application/json')
    ajax.setRequestHeader('charset', 'utf-8')
    ajax.send()
  }
}

// 根据传入的方法名匹配对应方法,并传入options
function lenovoApi(name, options) {
  if (functionArr[name]) {
    functionArr[name](options)
  }
}

createContainer()

// 暴露给window
window.lenovoApi = lenovoApi
//
// export const init = 'init';
