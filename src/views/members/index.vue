<template>
  <el-container class="members-class">
    <el-main>
      <!--标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="会员名单" name="first"></el-tab-pane>
      </el-tabs>
      <!--表单-->
      <el-row>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="会员名">
              <el-input v-model="formInline.nickName" placeholder="请输入会员名称或会员名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input v-model="formInline.phoneNumber" placeholder="请填写会员手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期">
              <el-date-picker v-model="formInline.creatorDateStart" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
              至
              <el-date-picker v-model="formInline.creatorDateEnd" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getMembersList">查询</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-button type="primary" @click="openCouponDialog">发送优惠券</el-button>
      </el-row>
      <!--表格-->
      <el-row style="margin-top: 20px">
        <el-table :data="tableData" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column prop="xcxOpenid" label="用户编码" align="center"></el-table-column>
          <el-table-column prop="ncname" label="微信昵称" align="center"></el-table-column>
          <el-table-column prop="nickName" label="会员姓名" align="center"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号" align="center"></el-table-column>
          <!--<el-table-column prop="detailedAddress" label="用户地址" align="center"></el-table-column>-->
          <el-table-column prop="creatorDate" label="注册日期" align="center"></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template  slot-scope="scope">
              <el-button size="mini" @click="edit(scope.$index, scope.row)">修改</el-button>
            </template>
          </el-table-column>
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
      <!-- 编辑用户信息弹框 -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible" :before-close="handleClose" center :close-on-click-modal="false">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户编号" prop="xcxOpenid">
            <span>{{ruleForm.xcxOpenid}}</span>
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="ruleForm.nickName" class="w200"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="ruleForm.phoneNumber" class="w200"></el-input>
          </el-form-item>
          <!--<el-form-item label="用户地址" prop="detailedAddress">-->
            <!--<el-input v-model="ruleForm.detailedAddress" class="w200"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item align="center" class="mar0">
            <el-button @click="resetForm('ruleForm')">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 发送优惠券弹框 -->
      <el-dialog class="coupon-dialog" title="发送优惠券" :visible.sync="dialogCouponVisible" :before-close="handleCouponClose" :center="true" :close-on-click-modal="false">
        <el-form :model="couponForm" :rules="rules" ref="couponForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="优惠券名称" prop="activityName">
            <el-input v-model="couponForm.activityName" class="w200"></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="type">
            <el-select v-model="couponForm.type" @change="couponTypeChange">
              <el-option v-for="item in optionsData.coupons" :key="item.id" :label="item.dataValue" :value="item.dataKey"></el-option>
            </el-select>
            <el-input-number v-model="couponForm.reducedAmount" v-if="couponForm.type == 1" controls-position="right"></el-input-number>
            <el-input-number v-model="couponForm.discount" v-if="couponForm.type == 2" :precision="2" :step="0.1" :max="10" controls-position="right"></el-input-number>
            <span>{{text[couponForm.type-1]}}</span>
          </el-form-item>
          <el-form-item label="房型" prop="checkList" class="w600">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="couponForm.checkList" @change="handleCheckedRoomChange">
              <el-checkbox v-for="room in roomList" :label="room.fxId" :key="room.fxId">{{room.fxName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="有效期" prop="validityStare">
            <el-date-picker v-model="couponForm.validityStare" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
            至
            <el-date-picker v-model="couponForm.validityEnd" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="试用条件" prop="fullReduction" v-if="couponForm.type == 1">
            <el-input-number v-model="couponForm.fullReduction"   controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item align="center" class="mar0">
            <el-button @click="resetCouponForm('couponForm')">取消</el-button>
            <el-button type="primary" @click="submitCouponForm('couponForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
  import { getMembersList, selectById, updateUserInfo, addActivityInfoYh } from '@/api/members'
  import { getRoomList } from '@/api/room'
  import { getDataDictionary } from '@/api/util'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        activeName: 'first',
        dialogFormVisible: false,
        dialogCouponVisible: false,
        formInline: {
          nickName: '',
          phoneNumber: '',
          creatorDateStart: '',
          creatorDateEnd: ''
        },
        value7: '',
        // 表格数据
        tableData: [],
        pageParam: {
          pageSize: 10,
          total: 0,
          currentPage: 1
        },
        ruleForm: {
          xcxOpenid: '',
          nickName: '',
          phoneNumber: '',
          detailedAddress: ''
        },
        rules: {
          type: [
            { required: true, message: '请选择优惠券类型', trigger: 'change' }
          ],
          activityName: [
            { required: true, message: '请输入优惠券名称', trigger: 'blur' },
            { max: 6, message: '最多6个字', trigger: 'blur' }
          ],
          checkList: [
            { type: 'array', required: true, message: '请选择房型', trigger: 'change' }
          ],
          validityStare: [
            { required: true, message: '请选择有效期', trigger: 'change' }
          ],
          fullReduction: [
            { required: true, message: '请填写试用条件', trigger: 'blur' }
          ]
        },
        userId: -1,
        multipleSelection: [],
        text: ['元', '折'],
        optionsData: {
          coupons: []
        },
        roomList: [],
        roomIdList: [],
        checkAll: false,
        isIndeterminate: true,
        couponForm: {
          activityName: '',
          type: '',
          validityStare: '',
          validityEnd: '',
          fullReduction: '',
          reducedAmount: '',
          discount: '',
          checkList: []
        }
      }
    },
    created() {
      this.getMembersList()
      this.getDataDictionary('coupons', 'coupons')
      this.getRoomList()
    },
    methods: {
      // dialog取消
      resetForm(nickName) {
        this.$refs[nickName].resetFields()
        this.dialogFormVisible = false
      },
      // dialog关闭
      handleClose(done) {
        this.$refs['ruleForm'].resetFields()
        done()
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      // 保存
      submitForm(nickName) {
        this.$refs[nickName].validate((valid) => {
          if (valid) {
            // 简单拷贝对象
            const tempObj = JSON.parse(JSON.stringify(this.ruleForm))
            if (this.userId > 0) { // 修改
              updateUserInfo(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.dialogFormVisible = false
                  Message({
                    message: response.result,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.getMembersList()
                }
              })
            }
          } else {
            return false
          }
        })
      },
      // 改变页码时加载数据
      changeCurrentPage(val) {
        this.pageParam.currentPage = val
        this.getMembersList()
      },
      getMembersList(flag) {
        const paramObj = {
          pageNo: flag ? 1 : this.pageParam.currentPage,
          pageSize: 10,
          ...this.formInline
        }
        getMembersList(paramObj).then(response => {
          this.tableData = response.list
          this.pageParam.total = response.total
          this.pageParam.currentPage = response.pageNum
        })
      },
      // 修改
      edit(index, row) {
        this.userId = row.userId
        this.selectById1(row.userId)
        this.dialogFormVisible = true
      },
      // 获取单个信息
      selectById1(userId) {
        const paramObj1 = {
          userId: userId
        }
        selectById(paramObj1).then(response => {
          if (response.returnCode === '200') {
            this.ruleForm = response.result
          }
        })
      },
      // 获取房型列表
      getRoomList() {
        const obj = {
          pageNo: 1,
          pageSize: 50
        }
        getRoomList(obj).then(response => {
          this.roomList = response.list
          response.list.map(item => {
            this.roomIdList.push(item.fxId)
          })
        })
      },
      // 复选框
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 新增优惠券dialog关闭
      handleCouponClose(done) {
        this.$refs['couponForm'].resetFields()
        done()
      },
      // 全选
      handleCheckAllChange(val) {
        this.couponForm.checkList = val ? this.roomIdList : []
        this.isIndeterminate = false
      },
      handleCheckedRoomChange(val) {
        const checkedCount = val.length
        this.checkAll = checkedCount === this.roomIdList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roomIdList.length
      },
      // 新增优惠券dialog取消
      resetCouponForm(formName) {
        this.$refs[formName].resetFields()
        this.dialogCouponVisible = false
      },
      // 发送优惠券按钮
      openCouponDialog() {
        console.log(this.multipleSelection)
        if (this.multipleSelection.length > 0) {
          this.dialogCouponVisible = true
        } else {
          this.$message({
            message: '请选择要发送的会员',
            type: 'warning'
          })
        }
      },
      // 优惠券类型改变
      couponTypeChange(val) {
        if (val === 1) { // 立减
          this.couponForm.discount = ''
        } else { // 折扣
          this.couponForm.fullReduction = ''
          this.couponForm.reducedAmount = ''
        }
      },
      // 查询字典表
      getDataDictionary(fileId, type) {
        getDataDictionary(fileId).then(response => {
          this.optionsData[type] = response
          if (fileId === 'coupons') {
            this.couponForm.type = response[0].dataKey
          }
        })
      },
      // 保存优惠券
      submitCouponForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.couponForm.type === '1') {
              if (!this.couponForm.reducedAmount) {
                this.$notify({
                  title: '警告',
                  message: '请填写立减金额',
                  type: 'warning'
                })
                return
              }
            } else {
              if (!this.couponForm.discount) {
                this.$notify({
                  title: '警告',
                  message: '请填写折扣值',
                  type: 'warning'
                })
                return
              }
            }
            // 简单拷贝对象
            const tempObj = JSON.parse(JSON.stringify(this.couponForm))
            // 房型ID集合
            const activityFxs = []
            this.couponForm.checkList.map(item => {
              activityFxs.push({
                fxId: item
              })
            })
            tempObj.activityFxs = activityFxs
            // 用户ID集合
            tempObj.userDiscounts = this.multipleSelection
            addActivityInfoYh(tempObj).then(response => {
              if (response.returnCode === '200') {
                this.$message({
                  message: '发送成功',
                  type: 'success'
                })
                this.dialogCouponVisible = false
                this.$refs['couponForm'].resetFields()
              } else {
                this.$message({
                  message: '发送失败',
                  type: 'warning'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .members-class{
    .w80{
      width: 80px;
    }
    .w200{
      width: 200px;
    }
    .w600{
      width: 600px;
    }
    .mar0{
      .el-form-item__content{
        margin: 0 !important;
      }
    }
    .coupon-dialog {
      .el-checkbox{
        width: 160px;
        margin-left: 0px !important;
      }
    }
  }
</style>
