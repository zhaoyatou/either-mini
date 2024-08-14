const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
//去除数组中的重复元素  仅限于 去除  字符串 或者 数字 这种 基本类型的数组
const removeRepeat = (arr) => {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
};
//得到一个两个值  之间的   随机数
const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

// 时间戳转日期格式
const formatDate = (time, fmt = "yyyy-MM-dd hh:mm:ss") => {
  let _date = new Date(time)
  console.log
  let o = {
    "M+": _date.getMonth() + 1, //月份
    "d+": _date.getDate(), //日
    "h+": _date.getHours(), //小时
    "m+": _date.getMinutes(), //分
    "s+": _date.getSeconds(), //秒
    "q+": Math.floor((_date.getMonth() + 3) / 3), //季度
    "S": _date.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
const formatPrice = (price) => {
  // 将价格转换为字符串并去除可能存在的逗号
  price = price.toString().replace(',', '');

  // 使用正则表达式添加逗号
  price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return price;
}

module.exports = {
  formatTime,
  removeRepeat,
  randomNum,
  formatDate,
  formatPrice
}