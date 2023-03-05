<template>
  <div class="dashboard-container" id="order-app" v-loading="loading">
    <div class="container">
      <!-- 搜索项 -->
      <div class="tableBar">
        <el-input v-model="input" placeholder="请输入订单号" style="width: 250px">
          <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
        </el-input>
        <el-date-picker v-model="orderTime"
                        clearable
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placeholder="选择日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        style="width: 400px;margin-left: 20px;"
        ></el-date-picker>
        <el-button type="primary" class="search-btn" @click="init">查询</el-button>
      </div>

      <el-table :data="tableData" stripe class="tableBox">
        <el-table-column prop="number" label="订单号" min-width="110"></el-table-column>
        <el-table-column prop="订单状态" label="订单状态">
          <template slot-scope="{ row }">
            <span>{{ getOrderType(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" min-width="100"></el-table-column>
        <el-table-column prop="amount" label="实收金额">
          <template slot-scope="{ row }">
            <span>￥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="btn" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goDetail2(row.orderDetails)" class="blueBug">
              详情
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="goDetail(row)" class="blueBug">
              查看
            </el-button>
            <el-divider v-if="row.status === 2" direction="vertical"></el-divider>
            <el-button v-if="row.status === 2" type="text" @click="cancelOrDeliveryOrComplete(3, row.id)" class="blueBug">
              派送
            </el-button>
            <el-divider v-if="row.status === 3" direction="vertical"></el-divider>
            <el-button v-if="row.status === 3" type="text" @click="cancelOrDeliveryOrComplete(4, row.id)" class="blueBug">
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pageList"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :current-page.sync="page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 查看详情弹框部分 -->
    <el-dialog
        title="订单详细信息"
        :visible.sync="dialogVisible2"
        width="30%"
        :before-close="handleClose2"
    >
      <div class="info-box">
        <div class="item-box" v-for="(item,index) in diaForm2" :key="index">
          <span class="label">{{ item.name }}</span>
          <span class="des">{{ item.dishFlavor }}</span>
          <span class="number">{{ item.number }}份</span>
        </div>
      </div>
    </el-dialog>

    <!-- 查看弹框部分 -->
    <el-dialog
        title="订单信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
      <div class="info-box">
        <div class="item-box">
          <span class="label">订单号：</span>
          <span class="des">{{ diaForm.number }}</span>
        </div>
        <div class="item-box">
          <span class="label">订单状态：</span>
          <span class="des">{{ getOrderType(diaForm) }}</span>
        </div>
        <div class="item-box">
          <span class="label">收货人：</span>
          <span class="des">{{ diaForm.consignee }}</span>
        </div>
        <div class="item-box">
          <span class="label">联系电话：</span>
          <span class="des">{{ diaForm.phone }}</span>
        </div>
        <div class="item-box">
          <span class="label">地址：</span>
          <span class="des">{{ diaForm.address }}</span>
        </div>
        <div class="item-box">
          <span class="label">支付金额：</span>
          <span class="des">{{ diaForm.amount }}</span>
        </div>
        <div class="item-box">
          <span class="label">下单时间：</span>
          <span class="des">{{ diaForm.orderTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import OrderApi from "@/api/order";
  export default {
    name: "OrderList",
    data() {
      return {
        input: '',
        orderTime: '',
        beginTime: '',
        endTime: '',
        counts: 0,
        page: 1,
        pageSize: 10,
        tableData : [],
        dialogVisible: false,
        dialogVisible2:false,
        diaForm: {},
        diaForm2:{},
        loading: false
      }
    },
    computed: {},
    watch:{
      orderTime (val) {
        if (val && val.length >= 2) {
          this.beginTime = val[0]
          this.endTime = val[1]
        } else {
          this.beginTime = ''
          this.endTime = ''
        }
      }
    },
    created() {
      this.init()
    },
    mounted() {
      // this.loading = false
    },
    methods: {
      async init () {
        OrderApi.getOrderDetailPage({ page: this.page, pageSize: this.pageSize, number: this.input || undefined, beginTime: this.beginTime || undefined, endTime: this.endTime || undefined }).then(res => {
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
      getOrderType (row) {
        let str = ''
        switch(row.status){
          case 1:
            str =  '待付款'
            break;
          case 2:
            str =  '正在制作'
            break;
          case 3:
            str =  '正在派送'
            break;
          case 4:
            str =  '已完成'
            break;
          case 5:
            str =  '已取消'
            break;

        }
        return str
      },
      // 查看详情
      goDetail (row) {
        this.diaForm = {}
        this.dialogVisible = true
        this.diaForm = { ...row }
      },
      // 查看详细信息
      goDetail2 (row) {
        this.diaForm2 = {}
        this.dialogVisible2 = true
        this.diaForm2 = { ...row }
      },
      // 取消，派送，完成
      cancelOrDeliveryOrComplete (status, id) {
        this.$confirm('确认更改该订单状态?', '提示', {
          'confirmButtonText': '确定',
          'cancelButtonText': '取消',
          'type': 'warning'
        }).then(() => {
          OrderApi.editOrderDetail(params).then(res => {
            if (res.data.code === 1) {
              this.$message.success(status === 3 ? '订单已派送' : '订单已完成')
              this.init()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          }).catch(err => {
            this.$message.error('请求出错了：' + err)
          })
        })
        const params = {
          status,
          id
        }
      },
      handleClose () {
        this.dialogVisible = false
      },
      handleClose2 () {
        this.dialogVisible2 = false
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
  .search-btn {
    margin-left: 20px;
  }
  .tableBar{
    justify-content: flex-start !important;
  }
  .info-box{
    margin: -15px 30px 20px;
  }
  .info-box .item-box{
    display: flex;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    text-align: left;
    margin-bottom: 14px;
  }
  .info-box .item-box:last-child{
    margin-bottom: 0;
  }
  .info-box .item-box .label{
    width: 96px;
  }
  .info-box .item-box .des{
    flex: 1;
    color: #333333;
  }
  .info-box .item-box .number{

  }
</style>