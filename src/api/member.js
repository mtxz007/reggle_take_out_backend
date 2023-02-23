import axios from "axios";

const MemberApi = {
  /*
  * member.js
  */
  getMemberList (params) {
    return axios({
      url: '/employee/page',
      method: 'get',
      params
    })
  },
  // 修改---启用禁用接口
  enableOrDisableEmployee (params) {
    return axios({
      url: '/employee',
      method: 'put',
      data: {...params}
    })
  },
  // 新增---添加员工
  addEmployee (params) {
    return axios({
      url: '/employee',
      method: 'post',
      data: { ...params }
    })
  },
  // 修改---添加员工
  editEmployee (params) {
    return axios({
      url: '/employee',
      method: 'put',
      data: { ...params }
    })
  },
  // 修改页面反查详情接口
  queryEmployeeById (id) {
    return axios({
      url: `/employee/${id}`,
      method: 'get'
    })
  }
}

export default MemberApi