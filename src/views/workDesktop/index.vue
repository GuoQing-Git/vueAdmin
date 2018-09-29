<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <i class="el-icon-tickets f-orange"></i>
        <span class="mr-10">待确认订单</span>
        <span class="f-orange">{{orderList.length}}</span>
      </el-col>
    </el-row>
    <el-row>
      <div class="order-item" v-for="item in orderList">
        <div class="order-info">
          <div class="tit">
            <div class="order-num">{{item.orderCode}}</div>
            <div>预订时间：{{item.odList[0].creatorDate}}</div>
          </div>
          <div class="info">
            <p>
              <span class="lab">产品名称</span>
              <span class="value">{{item.odList[0].roomInfo.fxName}}</span>
            </p>
            <p>
              <span class="lab">客人姓名</span>
              <span class="value">{{item.nickName}}</span>
            </p>
            <p>
              <span class="lab">电话</span>
              <span class="value">{{item.phoneNumber}}</span>
            </p>
            <p>
              <span class="lab">入离店</span>
              <span class="value">{{getTodayDate(item.liveTime).split(' ')[0]}}-{{getTodayDate(item.leaveTime).split(' ')[0]}}（{{item.dayNum}}晚）</span>
            </p>
            <p>
              <span class="lab">房间数</span>
              <span class="value">{{item.odList[0].productNum}}</span>
            </p>
            <p>
              <span class="lab">总价</span>
              <span class="value">RMB {{item.orderTotal}}</span>
            </p>
          </div>
        </div>
        <div class="bt">
          <el-button size="mini" @click="refusalOrder(item.orderId)">拒单</el-button>
          <el-button size="mini" type="success" @click="receiptOrder(item.orderId)">确认</el-button>
        </div>
      </div>
    </el-row>
    <el-row class="mt-30">
      <el-col :span="24">
        <i class="el-icon-document f-orange"></i>
        <span class="mr-10">今日汇总</span>
        <span class="f-orange">{{todayDate}}</span>
      </el-col>
    </el-row>
    <el-row>
      <div class="g-panel">
        <div class="g-title">今日订单</div>
        <div class="g-count"><span class="f-24 f-green">{{countObj.orderNum}}</span>个</div>
      </div>
      <div class="g-panel">
        <div class="g-title">今日入住</div>
        <div class="g-count"><span class="f-24 f-green">{{countObj.stayInNum}}</span>个</div>
      </div>
      <div class="g-panel">
        <div class="g-title">订单金额</div>
        <div class="g-count"><span class="f-24 f-green">{{countObj.orderTotal}}</span>元</div>
      </div>
    </el-row>
  </div>
</template>

<script>
  import { formatDay } from '@/utils/index'
  import { getOrderList, receiptOrder, refusalOrder, getCount } from '@/api/order'
  export default {
    name: 'workDesktop',
    data() {
      return {
        todayDate: this.getTodayDate(new Date()),
        orderList: [],
        countObj: {
          orderNum: 0,
          orderTotal: 0,
          stayInNum: 0
        }
      }
    },
    created() {
      this.getOrderList()
      // 今日统计
      getCount().then(response => {
        this.countObj = {
          orderNum: response.result.orderNum ? response.result.orderNum : 0,
          orderTotal: response.result.orderTotal ? response.result.orderTotal : 0,
          stayInNum: response.result.stayInNum ? response.result.stayInNum : 0
        }
      })
    },
    methods: {
      getTodayDate(time) {
        return formatDay(time)
      },
      // 获取订单列表
      getOrderList() {
        const obj = {
          pageNo: 1,
          platformType: 1,
          queryType: 1,
          orderState: 3
        }
        getOrderList(obj).then(response => {
          const stateMap = {
            1: '待支付',
            2: '已取消',
            3: '待确认',
            4: '已确认',
            5: '已成交',
            6: '退款中',
            7: '已退款',
            8: '已拒单'
          }
          if (response.list.length > 0) {
            response.list.map(item => {
              item.odList.map(itemb => {
                itemb.roomInfo = JSON.parse(itemb.productContent)
              })
              item.stateValue = stateMap[item.orderState]
            })
          }
          this.orderList = response.list
        })
      },
      // 接单
      receiptOrder(orderId) {
        receiptOrder(orderId).then(response => {
          if (response.returnCode === '200') {
            this.$message({
              type: 'success',
              message: '接单成功'
            })
            this.getOrderList()
          } else {
            this.$message({
              type: 'info',
              message: response.msg
            })
          }
        })
      },
      // 拒单
      refusalOrder(orderId) {
        this.$confirm('拒单后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refusalOrder(orderId).then(response => {
            if (response.returnCode === '200') {
              this.$message({
                type: 'success',
                message: '拒单成功!'
              })
              this.getOrderList()
            } else {
              this.$message({
                type: 'info',
                message: response.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拒单'
          })
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .f-orange{
    color: #ff845a;
  }
  .mr-10{
    margin: 0 10px;
  }
  .mt-30{
    margin-top: 30px;
  }
  .f-24{
    font-size: 24px;
  }
  .f-green{
    color: #4ec273;
  }
  .order-item{
    font-size: 12px;
    width: 328px;
    border: 1px solid #d1eedb;
    position: relative;
    float: left;
    margin-right: 5px;
    margin-bottom: 5px;
    margin-top: 10px;
    .order-info{
      display: block;
      color: #333;
      .tit{
        padding: 10px;
        border-bottom: 1px solid #e8f4ec;
        .order-num{
          margin-bottom: 5px;
          font-weight: bold;
          color: #666;
          font-size: 14px;
        }
      }
    }
    .info{
      height: 218px;
      padding-top: 10px;
      p{
        line-height: 18px;
        padding: 0 15px;
        overflow: hidden;
      }
      .lab{
        width: 70px;
        float: left;
        display: block;
        color: #666;
      }
      .value{
        display: block;
        margin-left: 70px;
      }
    }
    .bt{
      height: 49px;
      line-height: 49px;
      padding-left: 164px;
      border-top: 1px solid #e8f4ec;
    }
  }
  .g-panel{
    width: 330px;
    border-left: 1px solid #e6e6e6;
    float: left;
    margin-right: 5px;
    margin-bottom: 5px;
    margin-top: 30px;
    color: #666;
    font-size: 12px;
  }
  .g-title{
    line-height: 16px;
    position: relative;
    left: -1px;
    border-left: 4px solid #4ec273;
    padding-left: 5px;
  }
  .g-count{
    padding-left: 65px;
    padding-top: 25px;
  }
</style>
