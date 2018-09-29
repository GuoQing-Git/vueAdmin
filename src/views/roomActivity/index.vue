<template>
  <el-container class="activityClass">
    <el-main>
      <el-tabs v-model="activeName">
        <el-tab-pane label="设置促销" name="first">
          <el-form :model="activityForm" :rules="rules" ref="activityForm" label-width="100px">
            <el-form-item label="促销类型" prop="type">
              <el-select v-model="activityForm.type" @change="handleSelectChange">
                <el-option v-for="item in optionsData.promotionType" :key="item.dataKey" :label="item.dataValue" :value="item.dataKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="促销名称" prop="activityName">
              <el-input class="w200" v-model="activityForm.activityName" :disabled="activityForm.type !== '1'"></el-input>
              <span class="tips">最多6个字</span>
            </el-form-item>
            <el-form-item label="房型" prop="checkList" class="w620">
              <el-checkbox-group v-model="activityForm.checkList">
                <el-checkbox v-for="room in roomList" :label="room.fxId" :key="room.fxId">{{room.fxName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="促销有效期" prop="date">
              <div>
                <el-date-picker
                  v-model="activityForm.date"
                  type="daterange"
                  align="left"
                  value-format="yyyy-MM-dd"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
                <span class="tips">{{countDay}}天</span>
              </div>
            </el-form-item>
            <el-form-item label="促销折扣" prop="discountType">
              <el-radio-group v-model="activityForm.discountFile" @change="discountRadioChange">
                <el-radio v-for="item in optionsData.discountFile" :label="item.dataKey" :key="item.dataKey">{{item.dataValue}}</el-radio>
                <el-input class="w80" v-model="activityForm.discount" :disabled="activityForm.discountFile !== '6'" type="number"></el-input>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="促销房量" prop="limit">
              <el-radio-group v-model="activityForm.limit" @change="limitRadioChange">
                <el-radio label="-1">不限</el-radio>
                <el-radio label="1">限定房量</el-radio>
                <el-input class="w80" v-model="activityForm.num" :disabled="activityForm.limit === '-1'" type="number"></el-input>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('activityForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="已参加促销" name="second">
          <el-row>
            <el-table
              :data="tableData"
              border
              :row-class-name="tableRowClassName"
              style="width: 100%">
              <el-table-column
                prop="activityName"
                label="促销名称"
                :align="columnAlign">
              </el-table-column>
              <el-table-column
                label="促销房型"
                header-align="center"
                align="left">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.activityFxs"> - {{item.fxName}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="liveTime"
                label="促销有效期"
                :align="columnAlign">
                <template slot-scope="scope">
                  <div>{{scope.row.validityStare}} 至 {{scope.row.validityEnd}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="leaveTime"
                label="促销折扣"
                :align="columnAlign"
                width="100">
                <template slot-scope="scope">
                  <div>{{scope.row.discount}}折</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="num"
                label="促销房量"
                :align="columnAlign"
                width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.num > 0">{{scope.row.num}}间</div>
                  <div v-else>不限量</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="creatorDate"
                label="创建/修改时间"
                :align="columnAlign"
                width="160">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                :align="columnAlign"
                width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 1">已生效</div>
                  <div v-else>已取消</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="updateBy"
                label="操作人"
                :align="columnAlign"
                width="150">
              </el-table-column>
              <el-table-column
                label="操作"
                :align="columnAlign">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 1 && scope.row.isGq === 1">
                    <el-button
                      size="mini"
                      @click="updateActivity(scope.$index, scope.row)">修改</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="cancelActivity(scope.$index, scope.row)">取消</el-button>
                  </div>
                  <div v-else>--</div>
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
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import { getDataDictionary } from '@/api/util'
  import { getRoomList } from '@/api/room'
  import { addActivityInfo, updateActivityInfo, getActivityInfoList, getActivityInfo } from '@/api/activity'
  import { parseTime } from '@/utils/index'
  export default {
    name: 'index',
    data() {
      return {
        activeName: 'first',
        activityId: -1,
        activityForm: {
          type: '',
          activityName: '',
          date: this.getOneYearDate(),
          discountFile: '',
          limit: '-1',
          checkList: []
        },
        rules: {
          type: [
            { required: true, message: '请选择促销类型', trigger: 'change' }
          ],
          activityName: [
            { required: true, message: '请输入促销名称', trigger: 'blur' },
            { max: 6, message: '最多6个字', trigger: 'blur' }
          ],
          checkList: [
            { type: 'array', required: true, message: '请选择房型', trigger: 'change' }
          ]
        },
        optionsData: {
          promotionType: [],
          discountFile: []
        },
        roomList: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 182)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate(date) {
            if (new Date(parseTime(date, '{y},{m},{d}')).getTime() === new Date(parseTime(new Date(), '{y},{m},{d}')).getTime()) {
              return false
            }
            return date <= new Date()
          }
        },
        tableData: [],
        columnAlign: 'center',
        labelPosition: 'left',
        pageParam: {
          pageSize: 10,
          total: 0,
          currentPage: 1
        }
      }
    },
    created() {
      this.getDataDictionary('type', 'promotionType')
      this.getDataDictionary('discount_file', 'discountFile')
      this.getRoomList()
      this.getActivityInfoList()
    },
    computed: {
      countDay: function() {
        return this.activityForm.date.length > 0 ? (new Date(this.activityForm.date[1]).getTime() - new Date(this.activityForm.date[0]).getTime()) / (3600 * 1000 * 24) : 0
      }
    },
    methods: {
      // 查询字典表
      getDataDictionary(fileId, type) {
        getDataDictionary(fileId).then(response => {
          this.optionsData[type] = response
          if (type === 'discountFile') {
            this.activityForm.discountFile = response[0].dataKey
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
        })
      },
      // 获取从当前时间起一年的时间起止日期
      getOneYearDate() {
        const end = new Date()
        const start = new Date()
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 365)
        return [start, end]
      },
      // 下拉促销类型变化
      handleSelectChange(val) {
        if (val !== '1') {
          this.activityForm.activityName = this.optionsData.promotionType[(val - 1)].dataValue
        } else {
          this.activityForm.activityName = ''
        }
      },
      // 选择促销折扣
      discountRadioChange(val) {
        if (val !== '6') {
          this.activityForm.discount = ''
        }
      },
      // 选择限制房量
      limitRadioChange(val) {
        if (val < 0) {
          this.activityForm.num = ''
        }
      },
      // 保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const tempObj = {
              activityFxs: [],
              validityStare: '',
              validityEnd: '',
              num: '',
              ...this.activityForm
            }
            this.activityForm.checkList.map(item => {
              tempObj.activityFxs.push({
                fxId: item
              })
            })
            tempObj.validityStare = parseTime(new Date(this.activityForm.date[0]), '{y}-{m}-{d}')
            tempObj.validityEnd = parseTime(new Date(this.activityForm.date[1]), '{y}-{m}-{d}')
            if (this.activityForm.limit < 0) {
              tempObj.num = this.activityForm.limit
            }
            if (this.activityId < 0) {
              addActivityInfo(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.activeName = 'second'
                  this.activityId = -1
                  this.getActivityInfoList()
                  // 重置表单
                  this.$refs[formName].resetFields()
                  this.activityForm.num = ''
                  this.activityForm.discountFile = this.optionsData.discountFile[0].dataKey
                  this.$message({
                    type: 'success',
                    message: '新建促销成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '保存失败'
                  })
                }
              })
            } else {
              tempObj.activityId = this.activityId
              updateActivityInfo(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.activeName = 'second'
                  this.activityId = -1
                  this.getActivityInfoList()
                  // 重置表单
                  this.$refs[formName].resetFields()
                  this.activityForm.num = ''
                  this.activityForm.discountFile = this.optionsData.discountFile[0].dataKey
                  this.$message({
                    type: 'success',
                    message: '修改促销成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '保存失败'
                  })
                }
              })
            }
          }
        })
      },
      // 查询酒店促销活动列表
      getActivityInfoList() {
        const obj = {
          pageNo: this.pageParam.currentPage,
          pageSize: 10
        }
        getActivityInfoList(obj).then(response => {
          this.tableData = response.list
          this.pageParam.total = response.total
          this.pageParam.currentPage = response.pageNum
        })
      },
      // 改变页码时加载数据
      changeCurrentPage(val) {
        this.pageParam.currentPage = val
        this.getActivityInfoList()
      },
      // 行样式
      tableRowClassName({ row, rowIndex }) {
        if (row.status === 2 || row.isGq === 2) {
          return 'disabled-row'
        }
      },
      // 取消促销
      cancelActivity(index, row) {
        this.$confirm('取消促销后不可恢复，是否确认取消促销？', '提示', {
          confirmButtonText: '取消促销',
          cancelButtonText: '不取消促销',
          type: 'warning',
          center: true
        }).then(() => {
          updateActivityInfo({ activityId: row.activityId, status: 2 }).then(response => {
            if (response.returnCode === '200') {
              this.getActivityInfoList()
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            } else {
              this.$message({
                type: 'success',
                message: '操作失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      // 修改促销
      updateActivity(index, row) {
        this.activityId = row.activityId
        this.activeName = 'first'
        this.getActivityInfo()
      },
      // 获取单条促销明细
      getActivityInfo() {
        if (this.activityId > 0) {
          getActivityInfo(this.activityId).then(response => {
            const tempObj = {
              activityName: response.result.activityName,
              date: [new Date(response.result.validityStare), new Date(response.result.validityEnd)],
              type: response.result.type.toString(),
              limit: response.result.num > 0 ? '1' : '-1',
              num: response.result.num > 0 ? response.result.num : '',
              discountFile: response.result.discountFile ? response.result.discountFile.toString() : '',
              discount: response.result.discountFile === 6 ? response.result.discount : ''
            }
            this.activityForm = {
              ...this.activityForm,
              ...tempObj
            }
            if (response.result.activityFxs.length > 0) {
              const arr = []
              response.result.activityFxs.map(item => {
                arr.push(item.fxId)
              })
              this.activityForm.checkList = arr
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .activityClass {
    .w200{
      width: 200px;
    }
    .w620{
      width: 620px;
    }
    .w80{
      width: 80px;
      margin-left: 15px;
    }
    .tips {
      margin-left: 15px;
      color: #999999;
    }
    .el-checkbox{
      width: 160px;
      margin-left: 0px !important;
    }
    .disabled-row{
      color: #999999;
    }
  }
</style>
