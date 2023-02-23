import axios from "axios";

const ComboApi = {
  // 查询列表数据
  getSetmealPage(params) {
    return axios({
      url: '/setmeal/page',
      method: 'get',
      params
    })
  },
  // 删除数据接口
  deleteSetmeal(ids) {
    return axios({
      url: '/setmeal',
      method: 'delete',
      params: { ids }
    })
  },
  // 修改数据接口
  editSetmeal(params) {
    return axios({
      url: '/setmeal',
      method: 'put',
      data: { ...params }
    })
  },
  // 新增数据接口
  addSetmeal(params) {
    return axios({
      url: '/setmeal',
      method: 'post',
      data: { ...params }
    })
  },
  // 查询详情接口
  querySetmealById(id) {
    return axios({
      url: `/setmeal/${id}`,
      method: 'get'
    })
  },
  // 批量起售禁售
  setmealStatusByStatus(params) {
    return axios({
      url: `/setmeal/status/${params.status}`,
      method: 'post',
      params: { ids: params.ids }
    })
  }
}

export default ComboApi