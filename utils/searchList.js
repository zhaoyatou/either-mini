import {
  formatPrice
} from "./util"
import wxs from "./wxs"
const getList = (params) => {
  return new Promise((res, rej) => {
    wxs.request({
      url: `api/v1/market/machine/list`,
      data: params
    }).then(({
      data
    }) => {
      data.records.map((i) => {
        i.price = formatPrice(i.price)
      })
      res(data)
    })
  })
}



module.exports = {
  getList
}