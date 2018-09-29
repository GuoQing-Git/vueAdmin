<template>
  <el-container>
    <el-main>
      <!--标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="结算统计" name="first"></el-tab-pane>
        <!--<el-tab-pane label="配置管理" name="second"></el-tab-pane>-->
      </el-tabs>
      <!--表单-->
      <el-row :gutter="20">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="账单日期">
                <el-date-picker
                  v-model="formInline.date"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4" :offset="8">
            <div class="grid-content bg-purple">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <!--卡片-->
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="5">
          <div class="grid-content bg-purple-light"><el-card shadow="always">收入<span style="margin-left: 50%;color: red">￥+{{value1}}</span></el-card></div>
        </el-col>
        <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light"><el-card shadow="always">间夜量<span style="margin-left: 50%;color: red">{{value2}}</span></el-card></div>
        </el-col>
      </el-row>
      <!--表格-->
      <el-row style="margin-top: 20px;">
        <el-table :data="tableData" border >
          <el-table-column prop="productContent.fxName" label="房型名称" style="width: 10%" align="center"></el-table-column>
          <el-table-column prop="nickName" label="姓名" style="width: 10%" align="center"></el-table-column>
          <el-table-column prop="liveTime" label="入住日期" style="width: 10%" align="center"></el-table-column>
          <el-table-column prop="leaveTime" label="离店日期" style="width: 10%" align="center"></el-table-column>
          <el-table-column prop="orderTotal" label="金额" style="width: 45%" align="center"></el-table-column>
          <el-table-column prop="orderDate" label="订单日期" style="width: 10%" align="center"></el-table-column>
        </el-table>
      </el-row>
      <!--分页-->
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
    </el-main>
  </el-container>
</template>

<!--js-->
<script>
  import { getBillList, getSettlement } from '@/api/bills'
  export default {
    data() {
      return {
        activeName: 'first',
        formInline: {
          date: new Date().getFullYear().toString() + '-' + (new Date().getMonth().toString().length <= 1 ? ('0' + (new Date().getMonth() + 1).toString()) : (new Date().getMonth() + 1).toString())
        },
        value1: 0,
        value2: 0,
        // 表格数据
        tableData: [],
        pageParam: {
          pageSize: 10,
          total: 0,
          currentPage: 1
        }
      }
    },
    created() {
      this.getBillList()
      this.getSettlement()
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      onSubmit() {
        this.getBillList()
        this.getSettlement()
      },
      // 改变页码时加载数据
      changeCurrentPage(val) {
        this.pageParam.currentPage = val
        this.getBillList()
      },
      getBillList(flag) {
        const paramObj = {
          pageNo: flag ? 1 : this.pageParam.currentPage,
          pageSize: 10,
          ...this.formInline
        }
        getBillList(paramObj).then(response => {
          if (response.list.length > 0) {
            response.list.map(item => {
              item.productContent = JSON.parse(item.productContent)
            })
          }
          this.tableData = response.list
          this.pageParam.total = response.total
          this.pageParam.currentPage = response.pageNum
        })
      },
      getSettlement() {
        const paramObj = {
          ...this.formInline
        }
        getSettlement(paramObj).then(response => {
          if (response.returnCode === '200') {
            //
            this.value1 = response.result.income || 0
            this.value2 = response.result.num || 0
          }
        })
      }
    }
  }

</script>

<!--样式-->
<style>


</style>
