<template>
  <div class="addBrand-container" id="combo-add-app">
    <div class="container">
      <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          :inline="true"
          label-width="180px"
          class="demo-ruleForm"
      >
        <div>
          <el-form-item label="套餐名称:" prop="name" >
            <el-input v-model="ruleForm.name" placeholder="请填写套餐名称" maxlength="20"/>
          </el-form-item>
          <el-form-item label="套餐分类:" prop="idType">
            <el-select v-model="ruleForm.idType" placeholder="请选择套餐分类" @change="$forceUpdate()">
              <el-option v-for="(item, index) in setMealList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="套餐价格:" prop="price">
            <el-input v-model="ruleForm.price" placeholder="请设置套餐价格" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="套餐菜品:" class="setmealFood">
            <el-form-item>
              <div class="addDish">
                <span v-if="dishTable.length === 0" class="addBut" @click="openAddDish"> + 添加菜品</span>
                <div v-if="dishTable.length !== 0" class="content">
                  <div class="addBut" style="margin-bottom: 20px" @click="openAddDish">+ 添加菜品</div>
                  <div class="table">
                    <el-table :data="dishTable" style="width: 100%">
                      <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
                      <el-table-column prop="price" label="原价" width="180">
                        <template slot-scope="scope"> {{ Number(scope.row.price) / 100 }} </template>
                      </el-table-column>
                      <el-table-column prop="address" label="份数" align="center">
                        <template slot-scope="scope">
                          <el-input-number
                              v-model="scope.row.copies"
                              size="small"
                              :min="1"
                              :max="99"
                              label="描述文字"
                          ></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column prop="address" label="操作" width="180px;" align="center">
                        <template slot-scope="scope">
                          <el-button type="text" size="small" @click="delDishHandle(scope.$index)"> 删除 </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="套餐图片:" class="uploadImg">
            <el-upload
                class="avatar-uploader"
                action="/common/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-change="onChange"
                ref="upload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar"></img>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item label="套餐描述:">
            <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="套餐描述，最长200字" maxlength="200"/>
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()"> 取消 </el-button>
            <el-button type="primary" @click="submitForm('ruleForm', false)"> 保存 </el-button>
            <el-button
                v-if="actionType === 'add'"
                type="primary"
                class="continue"
                @click="submitForm('ruleForm', true)"
            >
              保存并继续添加套餐
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog
        title="添加菜品"
        class="addDishList"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
    >
<!--      <el-input-->
<!--          v-model="value"-->
<!--          class="seachDish"-->
<!--          placeholder="请输入菜品名称进行搜索"-->
<!--          style="width: 250px"-->
<!--          size="small"-->
<!--          clearable-->
<!--      >-->
<!--        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="seachHandle"></i>-->
<!--      </el-input>-->
      <!-- <AddDish ref="adddish" :check-list="checkList" :seach-key="seachKey" @checkList="getCheckList" /> -->

      <div class="addDishCon">
        <div class="leftCont">
          <div
              v-show="seachKey.trim() === ''"
              class="tabBut"
          >
              <span
                  v-for="(item, index) in dishType"
                  :key="index"
                  :class="{act:index === keyInd}"
                  @click="checkTypeHandle(index, item.id)"
              >{{ item.name }}</span>
          </div>
          <div class="tabList">
            <div class="table">
              <div v-if="dishAddList.length === 0" style="padding-left:10px">
                暂无菜品!
              </div>
              <el-checkbox-group
                  v-if="dishAddList.length > 0"
                  v-model="checkedList"
                  @change="checkedListHandle"
              >
                <div
                    v-for="(item, index) in dishAddList"
                    :key="index"
                    class="items"
                >
                  <el-checkbox :key="index" :label="item">
                    <div class="item">
                      <span style="flex: 3;text-align: left">{{ item.dishName }}</span>
                      <span>{{ item.status == 0 ? '停售' : '在售' }}</span>
                      <span>{{ Number(item.price)/100 }}</span>
                    </div>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="ritCont">
          <div class="tit">
            已选菜品({{ checkedList.length }})
          </div>
          <div class="items">
            <div
                v-for="(item, ind) in checkedList"
                :key="ind"
                class="item"
            >
              <span>{{ item.name }}</span>
              <span class="price">￥ {{ Number(item.price)/100 }} </span>
              <span
                  class="del"
                  @click="delCheck(ind)"
              >
                  <img
                      src="../../assets/images/icons/btn_clean@2x.png"
                      alt=""
                  >
                </span>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addTableList">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import ComboApi from "@/api/combo";
  import FoodApi from "@/api/food";
  export default {
    name: "ComboAdd",
    data() {
      return {
        id: this.$store.state.comboUpdateId,
        actionType: '',
        value: '',
        setMealList: [],
        seachKey: '',
        dishList: [],
        imageUrl: '',
        dishTable: [],
        dialogVisible: false,
        checkList: [],
        ruleForm: {
          name: '',
          categoryId: '',
          price: '',
          code: '',
          image: '',
          description: '',
          dishList: [],
          status: true,
          idType: '',
        },
        dishType: [],
        dishAddList: [],
        dishListCache: [],
        keyInd : 0,
        searchValue: '',
        checkedList: []
      }
    },
    computed: {
      rules() {
        return {
          name: {
            required: true,
            message: '请输入套餐名称',
            trigger: 'blur',
          },
          idType: {
            required: true,
            message: '请选择套餐分类',
            trigger: 'change',
          },
          price: {
            required: true,
            // 'message': '请输入套餐价格',
            validator: (rules, value, callback) => {
              if (!value) {
                callback(new Error('请填写菜品价格'))
              } else {
                const reg = /^\d+(\.\d{0,2})?$/
                if (reg.test(value)) {
                  if(value < 10000){
                    callback()
                  }else{
                    callback(new Error('菜品价格小于10000'))
                  }
                } else {
                  callback(new Error('菜品价格格式只能为数字,且最多保留两位小数'))
                }
              }
            },
            trigger: 'blur',
          },
        }
      },
    },
    watch:{
      seachKey(value){
        if (value.trim()){
          this.getDishForName(this.seachKey)
        }
      },
      checkList(value){
        this.checkedList = value
      }
    },
    created() {
      this.getDishTypeList()
      this.getDishType()
      this.init()
    },
    mounted() {

    },
    methods: {
      async init() {
        ComboApi.querySetmealById(this.id).then((res) => {
          if (String(res.data.code) === '1') {
            this.ruleForm = res.data.data
            this.ruleForm.status = res.data.data.status === '1'
            this.ruleForm.price = res.data.data.price / 100
            this.imageUrl = `/common/download?name=${res.data.data.image}`
            this.checkList = res.data.data.setmealDishes
            this.dishTable = res.data.data.setmealDishes
            this.ruleForm.idType = res.data.data.categoryId
            // this.ruleForm.password = ''
          } else {
            this.$message.error(res.data.msg || '操作失败')
          }
        })
      },
      seachHandle() {
        this.seachKey = this.value
      },
      // 获取套餐分类
      getDishTypeList() {
        FoodApi.getCategoryList({ type: 2, page: 1, pageSize: 1000 }).then((res) => {
          if (res.data.code === 1) {
            this.setMealList = res.data.data.map((obj) => ({ ...obj, idType: obj.id }))
          } else {
            this.$message.error(res.data.msg || '操作失败')
          }
        })
      },
      // 删除套餐菜品
      delDishHandle(index) {
        this.dishTable.splice(index, 1)
        this.checkList.splice(index, 1)
      },

      // 获取添加菜品数据
      getCheckList(value) {
        this.checkList = [...value]
        console.log('已添加菜品数据：',this.checkList)
      },

      // 添加菜品
      openAddDish() {
        this.seachKey = ''
        this.dialogVisible = true
        //搜索条件清空，菜品重新查询，菜品类别选第一个重新查询
        this.value = ''
        this.keyInd = 0
        this.getDishList(this.dishType[0].id)
      },
      // 取消添加菜品
      handleClose(done) {
        // this.$refs.adddish.close()
        this.dialogVisible = false
        // this.checkList = JSON.parse(JSON.stringify(this.dishTable))
        // this.dialogVisible = false
      },

      // 保存添加菜品列表
      addTableList() {
        this.dishTable = JSON.parse(JSON.stringify(this.checkList))
        this.dishTable.forEach((n) => {
          n.copies = 1
        })
        this.dialogVisible = false
        // 添加处理逻辑清空选中list
        this.checkList = []
      },
      submitForm(formName, st) {
        let prams = { ...this.ruleForm }
        prams.price *= 100
        prams.setmealDishes = this.dishTable.map((obj) => ({
          copies: obj.copies,
          dishId: obj.dishId,
          name: obj.name,
          price: obj.price,
        }))
        prams.status = this.ruleForm ? 1 : 0
        prams.categoryId = this.ruleForm.idType
        if(prams.setmealDishes.length < 1){
          this.$message.error('请选择菜品！')
          return
        }
        if(!this.imageUrl){
          this.$message.error('请上传套餐图片')
          return
        }
        delete prams.updateTime
        ComboApi.editSetmeal(prams)
            .then((res) => {
              if (res.data.code === 1) {
                this.$message.success('套餐修改成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            })
            .catch((err) => {
              this.$message.error('请求出错了：' + err)
            })
      },
      handleAvatarSuccess (response, file, fileList) {
        // this.imageUrl = response.data
        if(response.code === 0 && response.msg === '未登录'){
          window.top.location.href = '/backend/page/login/login.html'
        }else{
          this.imageUrl = `/common/download?name=${response.data}`
          this.ruleForm.image = response.data
        }
      },

      onChange (file) {
        if(file){
          const suffix = file.name.split('.')[1]
          const size = file.size / 1024 / 1024 < 2
          if(['png','jpeg','jpg'].indexOf(suffix) < 0){
            this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
            this.$refs.upload.clearFiles()
            return false
          }
          if(!size){
            this.$message.error('上传文件大小不能超过 2MB!')
            return false
          }
          return file
        }
      },
      goBack() {
        this.$router.back()
      },
      // 获取套餐分类
      getDishType () {
        FoodApi.getCategoryList({'type':1}).then(res => {
          if (res.data.code === 1) {
            this.dishType = res.data.data
            this.getDishList(res.data.data[0].id)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },

      // 通过套餐ID获取菜品列表分类
      getDishList (id) {
        FoodApi.queryDishList({categoryId: id}).then(res => {
          if (res.data.code === 1) {
            if (res.data.data.length === 0) {
              this.dishAddList = []
              return
            }
            let newArr = res.data.data;
            newArr.forEach((n) => {
              n.dishId = n.id
              n.copies = 1
              // n.dishCopies = 1
              n.dishName = n.name
            })
            this.dishAddList = newArr
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },

      // 关键词收搜菜品列表分类
      getDishForName (name) {
        FoodApi.queryDishList({name}).then(res => {
          if (res.data.code === 1) {
            let newArr = res.data.data
            newArr.forEach((n) => {
              n.dishId = n.id
              n.dishName = n.name
            })
            this.dishAddList = newArr
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },

      checkTypeHandle (ind,id) {
        this.keyInd = ind
        this.getDishList(id)
      },

      checkedListHandle (value) {
        this.getCheckList(this.checkedList)
      },

      open (done) {
        this.dishListCache = JSON.parse(JSON.stringify(this.checkList))
      },

      close (done) {
        this.checkList = this.dishListCache
      },

      // 删除
      delCheck (ind){
        this.checkedList.splice(ind, 1)
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
  .addDish .el-input {
    width: 130px;
  }
  .addDish .el-input-number__increase {
    border-left: solid 1px #FFE1CA;
    background: #fff3ea;
  }
  .addDish .el-input-number__decrease {
    border-right: solid 1px #FFE1CA;
    background: #fff3ea;
  }
  .addDish input {
    border: 1px solid #ffe1ca;
  }
  .addDish .table {
    border: solid 1px #EBEEF5;
    border-radius: 3px;
  }
  .addDish .table th {
    padding: 5px 0;
  }
  .addDish .table td {
    padding: 7px 0;
  }
  .addDishList .seachDish {
    position: absolute;
    top: 10px;
    right: 20px;
  }
  .addDishList .el-dialog__body {
    padding: 0;
    border-bottom: solid 1px #ccc;
  }
  .addDishList .el-dialog__footer {
    padding-top: 27px;
  }

  .addDish {
    width: 777px;
  }
  .addDish .addBut {
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
  .addDish .content {
    background: #fafafb;
    padding: 20px;
    border: solid 1px #ccc;
    border-radius: 3px;
  }
  .addDishCon {
    padding: 0 20px;
    display: flex;
    line-height: 40px;
  }
  .addDishCon .leftCont {
    display: flex;
    border-right: solid 2px #E4E7ED;
    width: 60%;
    padding: 15px;
  }
  .addDishCon .leftCont .tabBut {
    width: 110px;
  }
  .addDishCon .leftCont .tabBut span {
    display: block;
    text-align: center;
    border-right: solid 2px #f4f4f4;
    cursor: pointer;
  }
  .addDishCon .leftCont .act {
    border-color: #FFC200 !important;
    color: #FFC200 !important;
  }
  .addDishCon .leftCont .tabList {
    flex: 1;
    padding: 15px;
  }
  .addDishCon .leftCont .tabList .table {
    border: solid 1px #f4f4f4;
    border-bottom: solid 1px #f4f4f4;
  }
  .addDishCon .leftCont .tabList .table .items {
    border-bottom: solid 1px #f4f4f4;
    padding: 0 10px;
    display: flex;
  }
  .addDishCon .leftCont .tabList .table .items .el-checkbox, .addDishCon .leftCont .tabList .table .items .el-checkbox__label {
    width: 100%;
  }
  .addDishCon .leftCont .tabList .table .items .item {
    display: flex;
    padding-right: 20px;
  }
  .addDishCon .leftCont .tabList .table .items .item span {
    display: inline-block;
    text-align: center;
    flex: 1;
  }
  /*.addDishCon .leftCont .tabList .table .items span:nth-of-type(2) {*/
  /*  width: 100%;*/
  /*}*/

  .addDishCon .ritCont {
    width: 40%;
    padding: 0 15px;
  }
  .addDishCon .ritCont .item {
    box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.03);
    display: flex;
    text-align: center;
    padding: 0 10px;
    margin-bottom: 20px;
    border-radius: 6px;
    color: #818693;
  }
  .addDishCon .ritCont .item span:first-child {
    text-align: left;
    color: #20232A;
  }
  .addDishCon .ritCont .item .price {
    display: inline-block;
    flex: 1;
  }
  .addDishCon .ritCont .item .del {
    cursor: pointer;
  }
  .addDishCon .ritCont .item .del img {
    position: relative;
    top: 5px;
    width: 20px;
  }

  .addDishCon .el-checkbox__label{
    width: 100%;
  }
  #combo-add-app .setmealFood .el-form-item__label::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }

  #combo-add-app .uploadImg .el-form-item__label::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>