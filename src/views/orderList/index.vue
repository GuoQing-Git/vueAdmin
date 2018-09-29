<template>
  <div class="app-container">
    <el-row>
      <el-form :model="queryFrom" :inline="true" :label-position="labelPosition" label-width="80px" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item label="日期">
              <el-select style="width: 120px" v-model="queryFrom.dateType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in dateType"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
              <el-date-picker clearable style="width: 160px" v-model="queryFrom.orderStartDate" value-format="yyyy-MM-dd"></el-date-picker>
              <el-date-picker clearable style="width: 160px" v-model="queryFrom.orderEndDate" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单号">
              <el-input v-model="queryFrom.orderCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="客人姓名">
              <el-input v-model="queryFrom.nickName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="客人电话">
              <el-input v-model="queryFrom.phoneNumber" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单状态">
              <el-select clearable v-model="queryFrom.orderState" placeholder="请选择">
                <el-option
                  v-for="item in orderState"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="3">
            <el-button type="primary" icon="el-icon-search" @click="getOrderList(true)">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        header-row-class-name="table-th"
        style="width: 100%">
        <el-table-column
          prop="orderCode"
          label="订单号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="入住人"
          width="100">
        </el-table-column>
        <el-table-column
          prop="liveTime"
          label="入住日期">
        </el-table-column>
        <el-table-column
          prop="leaveTime"
          label="离店日期">
        </el-table-column>
        <el-table-column
          prop="odList[0].productNum"
          label="房间数"
          width="100">
        </el-table-column>
        <el-table-column
          prop="odList[0].roomInfo.fxName"
          label="房型"
          width="160">
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="odList[0].creatorDate"
          label="预订时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="stateValue"
          label="订单状态">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope" v-if="scope.row.orderState == 3 || scope.row.orderState == 4">
            <el-button
              v-if="scope.row.orderState == 3"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">接单</el-button>
            <el-button
              v-if="scope.row.orderState == 3"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">拒单</el-button>
            <el-button
              v-if="scope.row.orderState == 4"
              size="mini"
              @click="handleConfirm(scope.$index, scope.row)">确认入住</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageParam.total"
        :current-page="pageParam.currentPage"
        :page-size="pageParam.pageSize"
        @current-change="changeCurrentPage"
        align="center">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import { getOrderList, receiptOrder, refusalOrder, updateRz } from '@/api/order'
  import { Message } from 'element-ui'
  export default {
    name: 'index',
    data() {
      return {
        labelPosition: 'left',
        queryFrom: {
          orderStartDate: '',
          orderEndDate: '',
          dateType: '',
          orderCode: '',
          orderSate: '',
          phoneNumber: '',
          nickName: ''
        },
        orderState: [
          {
            key: 1,
            value: '待支付'
          }, {
            key: 2,
            value: '已取消'
          }, {
            key: 3,
            value: '待确认'
          }, {
            key: 4,
            value: '已确认'
          }, {
            key: 5,
            value: '已成交'
          }, {
            key: 7,
            value: '已退款'
          }, {
            key: 8,
            value: '已拒单'
          }, {
            key: null,
            value: '全部'
          }
        ],
        dateType: [
          {
            key: 1,
            value: '入住日期'
          }, {
            key: 2,
            value: '离店日期'
          }, {
            key: 3,
            value: '预订日期'
          }
        ],
        tableData: [],
        pageParam: {
          pageSize: 5,
          total: 0,
          currentPage: 1
        }
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      // 查询
      onSubmit() {
        Message.info('查询')
      },
      // 接单
      handleEdit(index, row) {
        console.log(row)
        receiptOrder(row.orderId).then(response => {
          if (response.returnCode === '200') {
            this.$message({
              type: 'success',
              message: '接单成功'
            })
            this.getOrderList()
          } else {
            this.$message({
              type: 'info',
              message: response.result
            })
          }
        })
      },
      // 拒单
      handleDelete(index, row) {
        this.$confirm('拒单后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refusalOrder(row.orderId).then(response => {
            if (response.returnCode === '200') {
              this.$message({
                type: 'success',
                message: '拒单成功!'
              })
              this.getOrderList()
            } else {
              this.$message({
                type: 'info',
                message: response.result
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拒单'
          })
        })
      },
      // 确认入住
      handleConfirm(index, row) {
        this.$confirm('确认入住后订单会锁定, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateRz(row.orderId).then(response => {
            if (response.returnCode === '200') {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getOrderList()
            } else {
              this.$message({
                type: 'info',
                message: response.result
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认入住'
          })
        })
      },
      // 改变页码时加载数据
      changeCurrentPage(val) {
        this.pageParam.currentPage = val
        this.getOrderList()
      },
      // 获取订单列表
      getOrderList(flag) {
        const obj = {
          pageNo: flag ? 1 : this.pageParam.currentPage,
          platformType: 1,
          queryType: 1,
          ...this.queryFrom
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
          this.tableData = response.list
          this.pageParam.total = response.total
          this.pageParam.currentPage = response.pageNum
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-button {
    margin: 0 !important;
  }
  .el-input{
    width: 196px;
  }
</style>
