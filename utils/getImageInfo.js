import qiniuUploader from "./qiniuUploader";
import {
  formatDate,
  randomNum
} from "./util";
import {
  getStorage
} from "./utilities";
import wxs from "./wxs";

const getImageInfo = async (arr) => {
  let that = this;
  return new Promise(async function (resolve, reject) {
    let keys = [];
    for (let i = 0; i < arr.length; i++) {
      let src = arr[i].src;
      if (!src.startsWith('https://cdn.eithergo.com')) {
        keys.push(await getImageInfoItem(src))
      } else {
        keys.push(src)
      }
    }

    resolve(keys);

  })
};
const getImageInfoItem = (src) => {
  return new Promise(function (resolve) {
    wx.getImageInfo({
      src: src,
      success: (res) => {
        let width = res.width;
        let height = res.height;
        geToken().then(({
          data
        }) => {
          let token = data.uploadToken;
          let filename = `image/${formatDate(new Date(), 'yyyy-MM-dd')}/${ getImageName(width, height)}`;
          var options = {
            region: 'ECN',
            key: filename,
            uptoken: token,
            domain: 'https://cdn.eithergo.com/'
          };
          qiniuUploader.upload(src, (data) => {
            resolve(data.key)
          }, (error) => {}, options);
        })
      }
    })
  })
}
const geToken = () => {
  return wxs.request({
    url: 'api/v1/upload/qiniu/token',
    method: "post"
  });
};
const getImageName = (width, height) => {
  let a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const len = a.length - 1;
  const num1 = a[randomNum(0, len)];
  const num2 = a[randomNum(0, len)];
  const num3 = a[randomNum(0, len)];
  const num4 = a[randomNum(0, len)];
  let userImg = getStorage('userid') + "_w_" + width + "_h_" + height + "_" + parseInt(+new Date() / 1000) + "_" + num1 + num2 + num3 + num4;
  return userImg;
}

module.exports = {
  getImageInfo
}