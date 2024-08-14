//七牛云上传图片


(function () {
  var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null
  }
  module.exports = {
    init: init,
    upload: upload,
  }

  function init(options) {
    config = {
      qiniuRegion: '',
      qiniuImageURLPrefix: '',
      qiniuUploadToken: '',
      qiniuUploadTokenURL: '',
      qiniuUploadTokenFunction: null
    };
    updateConfigWithOptions(options);
  }

  function updateConfigWithOptions(options) {
    if (options.region) {
      config.qiniuRegion = options.region;
    } else {
      console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
      config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
      config.qiniuUploadTokenURL = options.uptokenURL;
    } else if (options.uptokenFunc) {
      config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
      config.qiniuImageURLPrefix = options.domain;
    }
  }

  function upload(filePath, success, fail, options) {
    if (null == filePath) {
      console.error('qiniu uploader need filePath to upload');
      return;
    }
    if (options) {
      init(options);
    }
    if (config.qiniuUploadToken) {
      doUpload(filePath, success, fail, options);
    } else if (config.qiniuUploadTokenURL) {
      getQiniuToken(function () {
        doUpload(filePath, success, fail, options);
      });
    } else if (config.qiniuUploadTokenFunction) {
      config.qiniuUploadToken = config.qiniuUploadTokenFunction();
    } else {
      console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
      return;
    }
  }

  function doUpload(filePath, success, fail, options) {
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
      fileName = options.key;
    }
    var formData = {
      'token': config.qiniuUploadToken,
      'key': fileName
    };
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        var dataString = res.data
        var dataObject = JSON.parse(dataString);
        //do something
        var imageUrl = config.qiniuImageURLPrefix + dataObject.key;
        dataObject.imageURL = imageUrl;
        if (success) {
          success(dataObject);
        }
      },
      fail: function (error) {
        if (fail) {
          fail(error);
        }
      }
    })
  }

  function getQiniuToken(callback) {
    wx.request({
      url: config.qiniuUploadTokenURL,
      success: function (res) {
        var token = res.data.uptoken;
        config.qiniuUploadToken = token;
        if (callback) {
          callback();
        }
      },
      fail: function (error) {}
    })
  }

  function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch (code) {
      case 'ECN':
        uploadURL = 'https://up-z1.qiniup.com';
        break;
      case 'NCN':
        uploadURL = 'https://up-z0.qiniup.com';
        break;
      case 'SCN':
        uploadURL = 'https://up-z2.qbox.me';
        break;
      case 'NA':
        uploadURL = 'https://up-na0.qbox.me';
        break;
      default:
        console.error('please make the region is with one of [ECN, SCN, NCN, NA]');
    }
    return uploadURL;
  }

})();