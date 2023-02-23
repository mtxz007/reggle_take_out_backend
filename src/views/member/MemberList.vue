<template>
  <div class="dashboard-container" id="member-app">
    <div class="container">
      <div class="tableBar">
        <div>
          <el-input
              v-model="input"
              placeholder="请输入员工姓名"
              style="width: 250px"
              clearable
              @keyup.enter.native="handleQuery"
          >
            <i
                slot="prefix"
                class="el-input__icon el-icon-search"
                style="cursor: pointer"
                @click="handleQuery"
            ></i>
          </el-input>
          <el-button
              type="primary"
              style="margin-left: 5px"
              @click="handleQuery">
            查询
          </el-button>
        </div>
        <el-button
            type="primary"
            @click="addMemberHandle('add')"
        >
          + 添加员工
        </el-button>
      </div>

      <el-table
          :data="tableData"
          stripe
          class="tableBox"
      >
        <el-table-column
            prop="name"
            label="员工姓名"
        ></el-table-column>
        <el-table-column
            prop="username"
            label="账号"
        ></el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
        ></el-table-column>
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            {{ String(scope.row.status) == '0' ? '已禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="160"
            align="center"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="blueBug"
                @click="addMemberHandle(scope.row.id)"
                :class="{notAdmin:user !== 'admin'}"
            >
              编辑
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="statusHandle(scope.row)"
                v-if="user === 'admin'"
            >
              {{ scope.row.status == '1' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pageList"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          :current-page.sync="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import MemberApi from "@/api/member";
  export default {
    name:'MemberList',
    data() {
      return {
        input: '',
        counts: 0,
        page: 1,
        pageSize: 10,
        tableData : [],
        id : '',
        status : '',
        // user: '',
      }
    },
    computed: {},
    created() {
      this.init()
      this.user = JSON.parse(localStorage.getItem('userInfo')).data.username
    },
    mounted() {
      // console.log('@@@',this.user)
    },
    methods: {
      async init () {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          name: this.input ? this.input : undefined
        }
        await MemberApi.getMemberList(params).then(res => {
          if (String(res.data.code) === '1') {
            this.tableData = res.data.data.records || []
            this.counts = res.data.data.total
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      },
      handleQuery() {
        this.page = 1;
        this.init();
      },
      // 添加
      addMemberHandle (st) {
        if (st === 'add'){
          console.log('点击add')
          // window.parent.menuHandle({
          //   id: '2',
          //   url: '/home/memberadd',
          //   name: '添加员工'
          // },true)
          this.$store.state.memberUpdateId = ''
          this.$router.push('/home/memberadd')
        } else {
          // window.parent.menuHandle({
          //   id: '2',
          //   url: '/backend/page/member/add.html?id='+st,
          //   name: '修改员工'
          // },true)
          console.log('修改的id为：',st)
          this.$store.state.memberUpdateId = st
          this.$router.push('/home/memberupdate')
        }
      },
      //状态修改
      statusHandle (row) {
        this.id = row.id
        this.status = row.status
        this.$confirm('确认调整该账号的状态?', '提示', {
          'confirmButtonText': '确定',
          'cancelButtonText': '取消',
          'type': 'warning'
        }).then(() => {
          MemberApi.enableOrDisableEmployee({ 'id': this.id, 'status': !this.status ? 1 : 0 }).then(res => {
            console.log('enableOrDisableEmployee',res)
            if (String(res.data.code) === '1') {
              this.$message.success('账号状态更改成功！')
              this.handleQuery()
            }
          }).catch(err => {
            this.$message.error('请求出错了：' + err)
          })
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.init()
      },
      handleCurrentChange (val) {
        this.page = val
        this.init()
      }
    }
  }
</script>

<style scoped>
  .dashboard-container {
    padding: 20px;
  }
  .dashboard-container .container {
    background: #fff;
    position: relative;
    z-index: 1;
    padding: 30px 28px;
    border-radius: 4px;
  }
  .dashboard-container .container .tableBar {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  .dashboard-container .container .tableBox {
    width: 100%;
    border: solid 2px #f3f4f7;
    border-radius: 2px;
  }

  .dashboard-container .container .tableBox .el-image img {
    width: 40px;
    border-radius: 5px;
  }

  .dashboard-container .container .pageList {
    text-align: center;
    margin-top: 30px;
  }

  .dashboard-container .container .tableLab .span-btn {
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    padding: 0 20px;
    color: #818693;
    border-right: solid 1px #d8dde3;
  }

  .dashboard-container .container .tableLab .el-button {
    margin-left: 10px;
  }

  .el-table-column--selection .cell {
    padding-left: 10px;
  }

  /* 添加 */
  .addBrand-container .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .addBrand-container .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .addBrand-container .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .addBrand-container .avatar {
    width: 160px;
    height: 160px;
    display: block;
  }
  .addBrand-container .el-form--inline .el-form-item__content {
    width: 293px;
  }
  .addBrand-container .el-input {
    width: 293px;
  }

  .addBrand-container {
    margin: 30px;
  }
  .addBrand-container .container {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 30px;
    border-radius: 4px;
    min-height: 500px;
  }
  .addBrand-container .container .subBox {
    padding-top: 30px;
    text-align: center;
    border-top: solid 1px #f3f4f7;
  }

  .flavorBox {
    width: 777px;
  }
  .flavorBox .addBut {
    background: #ffc200;
    display: inline-block;
    padding: 0px 20px;
    border-radius: 3px;
    line-height: 40px;
    cursor: pointer;
    border-radius: 4px;
    color: #333333;
    font-weight: 500;
  }
  .flavorBox .flavor {
    border: solid 1px #dfe2e8;
    border-radius: 3px;
    padding: 15px;
    background: #fafafb;
  }
  .flavorBox .flavor .title {
    color: #606168;
  }
  .flavorBox .flavor .cont .items {
    display: flex;
    margin: 10px 0;
  }
  .flavorBox .flavor .cont .items .itTit {
    width: 150px;
    margin-right: 15px;
  }
  .flavorBox .flavor .cont .items .itTit input {
    width: 100%;
    line-height: 40px;
    border-radius: 3px;
    padding: 0 10px;
  }
  .flavorBox .flavor .cont .items .labItems {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    border-radius: 3px;
    min-height: 39px;
    border: solid 1px #d8dde3;
    background: #fff;
    padding: 0 5px;
  }
  .flavorBox .flavor .cont .items .labItems span {
    display: inline-block;
    color: #f19c59;
    margin: 5px;
    line-height: 26px;
    height: 26px;
    padding: 0 10px;
    background: #fdf4eb;
    border-radius: 3px;
    border: solid 1px #fae2cd;
  }
  .flavorBox .flavor .cont .items .labItems span i {
    cursor: pointer;
    font-style: normal;
  }
  .flavorBox .flavor .cont .items .labItems .inputBox {
    display: inline-block;
    width: 100%;
    height: 36px;
    line-height: 36px;
    overflow: hidden;
  }
  .flavorBox .flavor .cont .items .delFlavor {
    display: inline-block;
    padding: 0 10px;
    color: #f19c59;
    cursor: pointer;
  }

  .addBrand-container .address .el-form-item__content {
    width: 777px !important;
  }

  .el-button--text {
    font-weight: 400 !important;
    font-size: 13px !important;
  }

  .el-table td {
    font-size: 13px !important;
  }

  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding-left: 12px;
  }
</style>