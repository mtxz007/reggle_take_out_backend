import axios from "axios";

const OrderApi = {
  // 查询列表页接口
  getOrderDetailPage(params) {
    return axios({
      url: '/order/page',
      method: 'get',
      params
    })
  },
  // 查看接口
  queryOrderDetailById(id) {
    return axios({
      url: `/orderDetail/${id}`,
      method: 'get'
    })
  },
  // 取消，派送，完成接口
  editOrderDetail(params) {
    return axios({
      url: '/order',
      method: 'put',
      data: { ...params }
    })
  }
}

export default OrderApi