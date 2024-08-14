import wxs from "../../utils/wxs"
Component({
  data: {
    typeList: ['全部', '全新', '二手', '求购'],
    sortList: [],
    sortIndex: [],
    regionIndex: [],
    areas: [],
    regionList: [],
  },
  properties: {
    region: {
      type: String,
      value: ""
    },
    typeIndex: {
      type: Number,
      value: 0,
    },
    categoryName: {
      type: String,
      value: ''
    },
  },
  pageLifetimes: {
    show() {}
  },
  attached() {
    wxs.request({
      url: "api/v1/machine/category/top/list",
    }).then(({
      data: categoryTopList
    }) => {
      categoryTopList.unshift({
        name: '全部'
      })
      if (categoryTopList[0].id) {
        wxs.request({
          url: `api/v1/machine/category/${categoryTopList[0].id}/child/list`
        }).then(({
          data: categoryChildList
        }) => {
          this.setData({
            sortList: [categoryTopList, categoryChildList]
          })
        })
      } else {
        this.setData({
          sortList: [categoryTopList, [{
            name: '全部'
          }]]
        })
      }


    })
    wxs.request({
      url: 'api/v1/website/areas',
      data: {
        areaLevel: 2
      }
    }).then(({
      data
    }) => {
      const {
        areas
      } = data;
      areas.unshift({
        name: "全部",
        children: [{
          name: "全部"
        }]
      })
      this.setData({
        areas,
        regionList: [areas, areas[0].children]
      })
    })
  },
  methods: {
    bindRegionChange(e) {
      let that = this;
      that.setData({
        region: e.detail.value
      })
      that.triggerEvent('searchList', {
        city: e.detail.value[1]
      })
    },
    bindPickerChange(e) {
      let that = this;
      that.setData({
        typeIndex: e.detail.value
      })
      that.triggerEvent('searchList', {
        degreeType: e.detail.value
      })
    },
    bindMultiPickerChange(e) {
      let that = this;
      const {
        sortList
      } = that.data;
      const value = e.detail.value;
      that.setData({
        sortIndex: value,
        categoryName: value[0] ? sortList[1][value[1]].name : ''
      })
      that.triggerEvent('searchList', {
        categoryId: String(sortList[1][value[1]].id || '0')
      })
    },
    bindMultiPickerColumnChange: async function (e) {
      const data = {
        sortList: this.data.sortList,
        sortIndex: this.data.sortIndex,
      };
      if (e.detail.value && data.sortList[0][e.detail.value].id) {
        let childId = data.sortList[0][e.detail.value].id;
        let result = await wxs.request({
          url: `api/v1/machine/category/${childId}/child/list`
        })
        data.sortList[1] = result.data;
        data.sortIndex[1] = 0;
      } else {
        data.sortList[1] = [{
          name: "全部"
        }];
      }
      data.sortIndex[e.detail.column] = e.detail.value;
      this.setData(data);
    },
    bindMultiCityChange(e) {
      let that = this;
      const {
        regionList
      } = that.data;
      const value = e.detail.value;
      that.setData({
        regionIndex: value,
        region: value[0] ? regionList[1][value[1]].name : ''
      })
      that.triggerEvent('searchList', {
        city: regionList[1][value[1]].name
      })
    },
    bindMultiCityColumnChange: async function (e) {
      const data = {
        areas: this.data.areas,
        regionList: this.data.regionList,
        regionIndex: this.data.regionIndex,
      };
      data.regionIndex[e.detail.column] = e.detail.value;
      if (e.detail.value && !e.detail.column) {
        data.regionList[1] = data.areas[e.detail.value].children;
        data.regionIndex[1] = 0;
      }
      if (!e.detail.value && !e.detail.column) {
        data.regionList[1] = data.areas[0].children;
        data.regionIndex[1] = 0;
      }
      this.setData(data);
    },
  }
})