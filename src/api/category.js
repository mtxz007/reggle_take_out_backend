import axios from "axios";

const CategoryApi = {
  // 查询列表接口
  getCategoryPage (params) {
    return axios({
      url: '/category/page',
      method: 'get',
      params
    })
  },
  // 编辑页面反查详情接口
  queryCategoryById(id) {
    return axios({
      url: `/category/${id}`,
      method: 'get'
    })
  },
  // 删除当前列的接口
  deleCategory(id) {
    return axios({
      url: '/category',
      method: 'delete',
      params: { id }
    })
  },
  // 修改接口
  editCategory(params) {
    return axios({
      url: '/category',
      method: 'put',
      data: { ...params }
    })
  },
  // 新增接口
  addCategory(params) {
    return axios({
      url: '/category',
      method: 'post',
      data: { ...params }
    })
  }
}

export default CategoryApi