<template>
  <el-container class="roomPage">
    <el-main>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="房价维护" name="first">
          <el-row>
            <el-col style="text-align: right">
              <el-button-group>
                <el-button type="primary" icon="el-icon-edit" @click="openBatchEditPriceDialog">批量修改</el-button>
                <!--<el-button type="primary" icon="el-icon-edit-outline" @click="openEditPriceDialog">修改房价/库存</el-button>-->
              </el-button-group>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-table
                :data="tableData"
                border
                highlight-current-row
                @current-change="handleChange"
                style="width: 100%">
                <el-table-column
                  label="序号"
                  width="60"
                  align="center"
                  type="index">
                </el-table-column>
                <el-table-column
                  prop="fxName"
                  label="房型名称">
                </el-table-column>
                <el-table-column
                  prop="roomPrice"
                  label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.roomStatus === '1'">在售</span>
                    <span v-if="scope.row.roomStatus === '2'">停售</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="operate"
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.roomStatus === '1'"
                      size="mini"
                      type="danger"
                      @click="stopFxInfo(scope.row.fxId, 2)">停售</el-button>
                    <el-button v-if="scope.row.roomStatus === '2'"
                               size="mini"
                               @click="stopFxInfo(scope.row.fxId, 1)">开售</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12" class="calendar">
              <ele-calendar
                :render-content="renderContent"
                :data="dateDef"
                :prop="prop"
                border
                @pick="clickPick"
                @date-change="changeDate"
              ></ele-calendar>
            </el-col>
          </el-row>

        </el-tab-pane>
        <el-tab-pane label="房型维护" name="second">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="dialogFormFn">新增房型</el-button>
          </el-row>
          <el-row>
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="fxId"
                label="房型ID"
                width="180">
              </el-table-column>
              <el-table-column
                prop="fxName"
                label="房型名称">
              </el-table-column>
              <el-table-column
                prop="fxArea"
                label="面积">
              </el-table-column>
              <el-table-column
                prop="bedTypeValue"
                label="床型">
              </el-table-column>
              <el-table-column
                prop="bedWidthValue"
                label="床宽">
              </el-table-column>
              <el-table-column
                prop="isBreakfastValue"
                label="早餐">
              </el-table-column>
              <el-table-column
                prop="fxFloor"
                label="楼层">
              </el-table-column>
              <el-table-column
                prop="operate"
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="dialogFormFn(scope.$index, scope.row)">修改</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <!-- 房价编辑弹窗 -->
    <el-dialog title="编辑房价/库存" :visible.sync="dialogPriceVisible" width="600px" :before-close="handlePriceClose" center :close-on-click-modal="false">
      <el-form :model="priceForm" :rules="rules" ref="priceForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="房型名称">
          <div>{{priceForm.fxName}}</div>
        </el-form-item>
        <el-form-item label="价格" prop="fxPrice">
          <el-input-number v-model="priceForm.fxPrice" controls-position="right" :min="1" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="fxNum">
          <el-input-number v-model="priceForm.fxNum" controls-position="right" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetPriceForm('priceForm')">取消</el-button>
          <el-button type="primary" @click="submitPriceForm('priceForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量房价编辑弹窗 -->
    <el-dialog title="批量设置房价/库存" :visible.sync="dialogBatchPriceVisible" width="800px" :before-close="handleBatchPriceClose" center :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form :model="batchPriceForm" :rules="rules" ref="batchPriceForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="选择房型">
            <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
            <el-radio-group v-model="batchPriceForm.fxId">
              <el-radio v-for="item in tableData" :key="item.fxId" :label="item.fxId">{{item.fxName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日期" prop="startTime">
            <el-date-picker v-model="batchPriceForm.startTime" :picker-options="startPickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            至
            <el-date-picker v-model="batchPriceForm.endTime" :picker-options="endPickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="batchPriceForm.price" controls-position="right" :min="1" :max="9999"></el-input-number>
          </el-form-item>
          <el-form-item label="库存" prop="num">
            <el-input-number v-model="batchPriceForm.num" controls-position="right" :min="1" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetBatchPriceForm('batchPriceForm')">取消</el-button>
            <el-button type="primary" @click="submitBatchPriceForm('batchPriceForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 房型编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="handleClose" center :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="房型名称" prop="fxName">
          <el-input v-model="ruleForm.fxName"></el-input>
        </el-form-item>
        <el-form-item label="面积" prop="fxArea">
          <el-input v-model="ruleForm.fxArea" class="w200"></el-input>
          <span>平方米</span>
        </el-form-item>
        <el-form-item label="楼层" prop="fxFloor">
          <el-input v-model="ruleForm.fxFloor" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="床型" prop="bedType">
          <el-select v-model="ruleForm.bedType" placeholder="请选择床型">
            <el-option v-for="item in optionsData.bed_type" :key="item.id" :label="item.dataValue" :value="item.dataKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="早餐" prop="isBreakfast">
          <el-select v-model="ruleForm.isBreakfast" placeholder="请选择早餐">
            <el-option v-for="item in optionsData.is_breakfast" :key="item.id" :label="item.dataValue" :value="item.dataKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="床宽" prop="bedWidth">
          <el-select v-model="ruleForm.bedWidth" placeholder="请选择床型">
            <el-option v-for="item in optionsData.bed_width" :key="item.id" :label="item.dataValue" :value="item.dataKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加床" prop="isBed">
          <el-select v-model="ruleForm.isBed" placeholder="请选择床型">
            <el-option v-for="item in optionsData.is_bed" :key="item.id" :label="item.dataValue" :value="item.dataKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="https://www.luoxingapp.com/order/fileImageController/uploadImage"
            :data="uploadParam"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUp"
            :file-list="fileList"
            :limit="2">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="saveFlag">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
  import { getDataDictionary, getRoomList, addRoomInfo, updateRoomInfo, deleteRoomInfo,
    getRoomInfo, getCalendarList, editPriceCalender, batchEditPriceCalender, stopFxInfo } from '@/api/room'
  import { addZero } from '@/utils/index'
  import { Message } from 'element-ui'
  import eleCalendar from 'ele-calendar'
  let currentDate = new Date()
  export default {
    name: 'index',
    data() {
      return {
        activeName: 'first',
        saveFlag: false,
        dialogFormVisible: false,
        dialogPriceVisible: false,
        dialogBatchPriceVisible: false,
        dialogTitle: '新增房型',
        uploadParam: {
          type: 1
        },
        tableData: [],
        ruleForm: {
          fxName: '',
          fxArea: '',
          bedType: '',
          bedWidth: '',
          fxFloor: ''
        },
        rules: {
          fxName: [
            { required: true, message: '请输入房型名称', trigger: 'blur' }
          ],
          fxArea: [
            { required: true, message: '请输入房间面积', trigger: 'blur' }
          ],
          bedType: [
            { required: true, message: '请选择床型', trigger: 'change' }
          ],
          bedWidth: [
            { required: true, message: '请输入床宽', trigger: 'change' }
          ],
          isBed: [
            { required: true, message: '请选择加床方式', trigger: 'change' }
          ],
          fxFloor: [
            { required: true, message: '请输入楼层', trigger: 'blur' }
          ],
          isBreakfast: [
            { required: true, message: '请选择早餐', trigger: 'blur' }
          ],
          fxPrice: [
            { required: true, message: '请填写价格', trigger: 'change' }
          ],
          fxNum: [
            { required: true, message: '请填写库存数量', trigger: 'change' }
          ],
          startTime: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          price: [
            { required: true, message: '请填写价格', trigger: 'change' }
          ],
          num: [
            { required: true, message: '请填写库存数量', trigger: 'change' }
          ]
        },
        roomId: -1,
        fileList: [],
        optionsData: {
          is_breakfast: [],
          bed_type: [],
          bed_width: [],
          is_bed: []
        },
        priceForm: {
          fxId: -1,
          fxName: '',
          calendarId: '',
          fxPriceCalendarId: '',
          fxPrice: '',
          fxNum: ''
        },
        batchPriceForm: {
          fxId: -1,
          price: '',
          num: '',
          startTime: '',
          endTime: ''
        },
        roomIdList: [],
        checkAll: false,
        isIndeterminate: false,
        dateDef: [],
        prop: 'date', // 对应日期字段名
        currentCalendarObj: null, // 选择的日期对象
        startPickerOptions: {
          disabledDate(date) {
            return date <= new Date()
          }
        },
        endPickerOptions: {
          disabledDate: (date) => {
            if (!this.batchPriceForm.startTime) {
              return true
            }
            return date <= new Date(this.batchPriceForm.startTime)
          }
        }
      }
    },
    components: {
      eleCalendar
    },
    created() {
      this.getRoomList()
      this.getDataDictionary('is_breakfast')
      this.getDataDictionary('bed_type')
      this.getDataDictionary('bed_width')
      this.getDataDictionary('is_bed')
    },
    methods: {
      // 编辑房型弹窗
      dialogFormFn(index, row) {
        this.fileList = []
        if (row) { // 修改
          this.roomId = row.fxId
          this.getRoomInfo(row.fxId)
          this.dialogTitle = '修改房型'
        } else { // 新增
          this.roomId = -1
          this.dialogTitle = '新增房型'
        }
        this.dialogFormVisible = true
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 简单拷贝对象
            const tempObj = JSON.parse(JSON.stringify(this.ruleForm))
            tempObj.fileImages = []
            this.fileList.map(item => {
              tempObj.fileImages.push({
                filePath: item.response.result,
                fileType: 2,
                associatedId: this.roomId > 0 ? this.roomId : null
              })
            })
            if (this.roomId > 0) { // 修改
              updateRoomInfo(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.dialogFormVisible = false
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.getRoomList()
                  this.$refs['ruleForm'].resetFields()
                } else {
                  this.$message({
                    type: 'error',
                    message: response.msg
                  })
                }
              })
            } else {
              tempObj.fxId = null
              addRoomInfo(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.dialogFormVisible = false
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.getRoomList()
                  this.$refs['ruleForm'].resetFields()
                } else {
                  this.$message({
                    type: 'error',
                    message: response.msg
                  })
                }
              })
            }
          } else {
            return false
          }
        })
      },
      // 删除房型
      handleDelete(index, row) {
        const msg = '是否确定要删除"' + row.fxName + '"房型?'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoomInfo(row.fxId).then(res => {
            if (res.returnCode === '200') {
              this.getRoomList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        }).catch(() => {

        })
      },
      // 房型dialog取消
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.dialogFormVisible = false
      },
      // 房型dialog关闭
      handleClose(done) {
        this.$refs['ruleForm'].resetFields()
        done()
      },
      // 房价dialog取消
      resetPriceForm(formName) {
        this.$refs[formName].resetFields()
        this.dialogPriceVisible = false
      },
      // 房价dialog关闭
      handlePriceClose(done) {
        this.$refs['priceForm'].resetFields()
        done()
      },
      // 批量修改房价dialog取消
      resetBatchPriceForm(formName) {
        this.$refs[formName].resetFields()
        this.dialogBatchPriceVisible = false
      },
      // 批量修改房价dialog关闭
      handleBatchPriceClose(done) {
        this.$refs['batchPriceForm'].resetFields()
        done()
      },
      // 切换tab页
      handleClick() {
        //
      },
      // 上传之前拦截
      handleBeforeUp(file) {
        this.saveFlag = true
        return true
      },
      // 图片上传成功回调
      handleSuccess(response, file, fileList) {
        //
        this.fileList = fileList
        this.saveFlag = false
      },
      // 图片删除
      handleRemove(file, fileList) {
        //
        this.fileList = fileList
      },
      // 获取房型列表
      getRoomList() {
        const paramObj = {
          pageNo: 1,
          pageSize: 10,
          shopId: 1
        }
        getRoomList(paramObj).then(response => {
          this.tableData = response.list

          this.roomIdList.length = 0
          response.list.map(item => {
            this.roomIdList.push(item.fxId)
          })
        })
      },
      stopFxInfo(fxId, state) {
        stopFxInfo(fxId, state).then(response => {
          if (response.returnCode === '200') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getRoomList()
          } else {
            this.$message({
              type: 'success',
              message: response.msg
            })
          }
        })
      },
      // 获取单个房型信息
      getRoomInfo(id) {
        getRoomInfo(id).then(response => {
          if (response.returnCode === '200') {
            this.ruleForm = response.result
            if (response.result.fileImages.length > 0) {
              response.result.fileImages.map(item => {
                this.fileList.push({
                  response: {
                    result: item.filePath
                  },
                  url: 'https://www.luoxingapp.com/images/' + item.filePath + '_600x600.jpg'
                })
              })
            }
          }
        })
      },
      // 获取下拉数据
      getDataDictionary(type) {
        getDataDictionary(type).then(response => {
          this.optionsData[type] = response
        })
      },
      // 日历渲染
      renderContent(h, parmas) {
        const loop = data => {
          return (
            data.defvalue.value ? (
              <div>
                <div class='g-date'>{data.defvalue.text}</div>
                <div class='g-mark'><span style='font-size: 10px;margin-right: 10px;'>价格:</span><span class='f-red'>￥{data.defvalue.value.price || 0}</span></div>
                <div class='g-mark'><span style='font-size: 10px;margin-right: 10px;'>库存:</span><span class='f-green'>{data.defvalue.value.num || 0}间</span></div></div>)
              : (<div class='g-date'>{data.defvalue.text}</div>)
          )
        }
        return (<div style='min-height: 55px'>{loop(parmas)}</div>)
      },
      // 点击日历
      clickPick(data, event, row, node) {
        this.currentCalendarObj = JSON.parse(JSON.stringify(row.value))
        if (new Date(data) < new Date()) {
          return
        }
        if (row.type !== 'normal' && this.priceForm.fxId > 0) {
          currentDate = new Date(data)
          this.getCalendarList(this.priceForm.fxId, currentDate.getFullYear(), addZero(currentDate.getMonth() + 1))
        } else if (row.type === 'normal' && this.priceForm.fxId > 0) {
          this.openEditPriceDialog()
        }
      },
      // 切换日历年、月
      changeDate(data) {
        currentDate = new Date(data)
        if (this.priceForm.fxId > 0) {
          this.getCalendarList(this.priceForm.fxId, currentDate.getFullYear(), addZero(currentDate.getMonth() + 1))
        }
      },
      // 获取价格日历
      getCalendarList(fxId, calendarYear, calendarMonth) {
        const obj = {
          fxId: fxId,
          calendarYear: calendarYear,
          calendarMonth: calendarMonth
        }
        getCalendarList(obj).then(response => {
          if (response.returnCode === '200') {
            this.dateDef.length = 0
            if (response.result.list.length > 0) {
              response.result.list.map(item => {
                this.dateDef.push({
                  calendarId: item.calendarId,
                  fxPriceCalendarId: item.fxPriceCalendarId,
                  date: item.calendarTime,
                  price: item.fxPrice,
                  num: item.fxNum
                })
              })
            }
          }
        })
      },
      // 选择行
      handleChange(currentRow, oldCurrentRow) {
        if (currentRow) {
          this.priceForm.fxId = currentRow.fxId
          this.priceForm.fxName = currentRow.fxName
          this.getCalendarList(currentRow.fxId, currentDate.getFullYear(), addZero(currentDate.getMonth() + 1))
        }
      },
      // 显示价格弹框
      openEditPriceDialog() {
        if (this.priceForm.fxId < 0) {
          this.$message({
            type: 'warning',
            message: '请先选择左侧的房型'
          })
          return
        }
        if (!this.currentCalendarObj) {
          this.$message({
            type: 'warning',
            message: '请点击要修改的日期'
          })
          return
        }
        this.priceForm.fxPrice = this.currentCalendarObj.price
        this.priceForm.fxNum = this.currentCalendarObj.num
        this.dialogPriceVisible = true
      },
      // 修改房价/库存
      submitPriceForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 简单拷贝对象
            const tempObj = JSON.parse(JSON.stringify(this.priceForm))
            tempObj.calendarId = this.currentCalendarObj.calendarId
            tempObj.fxPriceCalendarId = this.currentCalendarObj.fxPriceCalendarId
            const obj = {
              fxPriceCalendars: [tempObj]
            }
            editPriceCalender(obj).then(response => {
              if (response.returnCode === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.dialogPriceVisible = false
                this.getCalendarList(this.priceForm.fxId, currentDate.getFullYear(), addZero(currentDate.getMonth() + 1))
              } else {
                this.$message({
                  type: 'error',
                  message: '修改失败'
                })
              }
            })
          }
        })
      },
      // 批量修改房价弹框
      openBatchEditPriceDialog() {
        this.dialogBatchPriceVisible = true
      },
      // 选择checked
      handleCheckedChange(value) {
        console.log(value)
        const checkedCount = value.length
        this.checkAll = checkedCount === this.roomIdList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roomIdList.length
      },
      // 全选
      handleCheckAllChange(val) {
        this.batchPriceForm.fxId = val ? this.roomIdList : []
        this.isIndeterminate = false
      },
      // 批量修改房价/库存
      submitBatchPriceForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const tempObj = JSON.parse(JSON.stringify(this.batchPriceForm))
            batchEditPriceCalender(tempObj).then(response => {
              if (response.returnCode === '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.dialogBatchPriceVisible = false
                this.getCalendarList(this.priceForm.fxId, currentDate.getFullYear(), addZero(currentDate.getMonth() + 1))
              }
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .roomPage{

    .el-row{
      margin-bottom:20px;
    }
    .w200{
      width: 200px;
    }

    .el-button {
      margin: 0 !important;
    }

    .calendar{
      button, html [type="button"], [type="reset"], [type="submit"] {
        -webkit-appearance: none;
      }
      .el-picker-panel-calendar{
        box-shadow: none !important;
        margin: 0 !important;
      }
      .el-picker-panel-calendar__icon-btn {
        padding: 0 10px !important;
        margin-right: 10px !important;
      }
      .el-picker-panel-calendar{
        border-color: #ebeef5 !important;
      }
      .el-date-table-calendar{
        font-size: 14px !important;
      }
      .g-date{
        text-align: left;
        line-height: 15px;
        font-size: 16px;
        margin-left: 20px;
        margin-top: 10px;
      }
      .g-mark{
        text-align: left;
        line-height: 20px;
        margin-left: 20px;
      }
      .f-red {
        color: red;
      }
      .f-green{
        color: green;
      }
      .current span {
        color: #fff;
      }
    }
    .dialog-content{
      max-height: 550px;
      min-height: 400px;
      overflow: auto;
    }
    .el-radio{
      display: block;
      margin: 10px 0;
    }
  }
</style>
