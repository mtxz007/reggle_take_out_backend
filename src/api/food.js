import axios from "axios";

const FoodApi = {
  // 查询列表接口
  getDishPage(params) {
    return axios({
      url: '/dish/page',
      method: 'get',
      params
    })
  },
  // 删除接口
  deleteDish(ids) {
    return axios({
      url: '/dish',
      method: 'delete',
      params: { ids }
    })
  },
  // 修改接口
  editDish(params) {
    return axios({
      url: '/dish',
      method: 'put',
      data: { ...params }
    })
  },
  // 新增接口
  addDish(params) {
    return axios({
      url: '/dish',
      method: 'post',
      data: { ...params }
    })
  },
  // 查询详情
  queryDishById(id) {
    return axios({
      url: `/dish/${id}`,
      method: 'get'
    })
  },
  // 获取菜品分类列表
  getCategoryList(params) {
    return axios({
      url: '/category/list',
      method: 'get',
      params
    })
  },
  // 查菜品列表的接口
  queryDishList(params) {
    return axios({
      url: '/dish/list',
      method: 'get',
      params
    })
  },
  // 文件down预览
  commonDownload(params) {
    return axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      url: '/common/download',
      method: 'get',
      params
    })
  },
  // 起售停售---批量起售停售接口
  dishStatusByStatus(params) {
    return axios({
      url: `/dish/status/${params.status}`,
      method: 'post',
      params: { ids: params.id }
    })
  }
}

export default FoodApi