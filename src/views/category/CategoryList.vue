<template>
  <div class="dashboard-container" id="category-app">
    <div class="container">
      <div class="tableBar">
        <el-button
            type="primary"
            class="continue"
            @click="addClass('class')"
        >
          + 新增菜品分类
        </el-button>
        <el-button
            type="primary"
            @click="addClass('meal')"
        >
          + 新增套餐分类
        </el-button>
      </div>
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
      >
        <el-table-column
            prop="name"
            label="分类名称"
        ></el-table-column>
        <el-table-column
            prop="type"
            label="分类类型"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '菜品分类': '套餐分类' }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="操作时间"
        >
          <template slot-scope="scope">
            {{scope.row.updateTime}}
          </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            label="排序"
        ></el-table-column>
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
                @click="editHandle(scope.row)"
            >
              修改
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="deleteHandle(scope.row.id)"
            >
              删除
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog
        :title="classData.title"
        :visible.sync="classData.dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
      <el-form
          class="demo-form-inline"
          label-width="100px"
      >
        <el-form-item label="分类名称：">
          <el-input
              v-model="classData.name"
              placeholder="请输入分类名称"
              maxlength="14"
          />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="classData.sort"  type="number" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <span
          slot="footer"
          class="dialog-footer"
      >
        <el-button
            size="medium"
            @click="classData.dialogVisible = false"
        >取 消</el-button>
        <el-button
            type="primary"
            size="medium"
            @click="submitForm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import CategoryApi from "@/api/category";
  export default {
    name: "CategoryList",
    data() {
      return {
        action: '',
        counts: 0,
        page: 1,
        pageSize: 10,
        tableData: [],
        type :'',
        classData: {
          'title': '添加菜品分类',
          'dialogVisible': false,
          'categoryId': '',
          'name': '',
          sort: ''
        }
      }
    },
    computed: {},
    created() {
      this.init()
    },
    mounted() {
    },
    methods: {
      async init () {
        await CategoryApi.getCategoryPage({'page': this.page, 'pageSize': this.pageSize}).then(res => {
          if (String(res.data.code) === '1') {
            this.tableData = res.data.data.records
            this.counts = Number(res.data.data.total)
          } else {
            this.$message.error(res.msg || '操作失败')
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
      addClass(st) {
        if (st === 'class') {
          this.classData.title = '新增菜品分类'
          this.type = '1'
        } else {
          this.classData.title = '新增套餐分类'
          this.type = '2'
        }
        this.action = 'add'
        this.classData.name = ''
        this.classData.sort = ''
        this.classData.dialogVisible = true
      },
      editHandle(dat) {
        this.classData.title = '修改分类'
        this.action = 'edit'
        this.classData.name = dat.name
        this.classData.sort = dat.sort
        this.classData.id = dat.id
        this.classData.dialogVisible = true
      },
      // 关闭弹窗
      handleClose() {
        this.classData.dialogVisible = false
      },
      //删除
      deleteHandle(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          'confirmButtonText': '确定',
          'cancelButtonText': '取消',
          'type': 'warning'
        }).then(() => {
          CategoryApi.deleCategory(id).then(res => {
            if (res.data.code === 1) {
              this.$message.success('删除成功！')
              this.handleQuery()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          }).catch(err => {
            this.$message.error('请求出错了：' + err)
          })
        })
      },
      //数据提交
      submitForm() {
        const classData = this.classData
        const valid = (classData.name === 0 ||classData.name)  && (classData.sort === 0 || classData.sort)
        if (this.action === 'add') {
          if (valid) {
            const reg = /^\d+$/
            if (reg.test(classData.sort)) {
              CategoryApi.addCategory({'name': classData.name,'type':this.type, sort: classData.sort}).then(res => {
                console.log(res)
                if (res.data.code === 1) {
                  this.$message.success('分类添加成功！')
                  this.classData.dialogVisible = false
                  this.handleQuery()
                } else {
                  this.$message.error(res.msg || '操作失败')
                }
              }).catch(err => {
                this.$message.error('请求出错了：' + err)
              })
            } else {
              this.$message.error('排序只能输入数字类型')
            }

          } else {
            this.$message.error('请输入分类名称或排序')
          }
        } else if (valid) {
          const reg = /^\d+$/
          if (reg.test(this.classData.sort)) {
            CategoryApi.editCategory({'id':this.classData.id,'name': this.classData.name, sort: this.classData.sort}).then(res => {
              if (res.data.code === 1) {
                this.$message.success('分类修改成功！')
                this.classData.dialogVisible = false
                this.handleQuery()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          } else {
            this.$message.error('排序只能输入数字类型')
          }
        } else {
          this.$message.error('请输入分类名称或排序')
        }
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