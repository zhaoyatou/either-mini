import {
  linkRevert
} from "../../utils/pathurl";

Component({
  data: {
    current: 0,
  },
  properties: {
    list: {
      type: Array,
      value: []
    },
  },
  methods: {
    preview(e) {
      const {
        index
      } = e.currentTarget.dataset;
      const {
        list
      } = this.data;
      if (list[index].targetUrl) {
        wx.navigateTo({
          url: linkRevert(list[index].targetUrl)
        })
      } else {
        let urls = [];
        list.map(i => {
          urls.push(i.image)
        })
        wx.previewImage({
          urls,
          current: urls[index]
        })
      }
    },
    changeCurrent(e) {
      this.setData({
        current: e.detail.current
      })
    }
  }
})