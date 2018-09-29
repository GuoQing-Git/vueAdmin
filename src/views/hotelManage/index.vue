<template>
  <el-container>
    <el-main>
      <el-tabs v-model="activeName">
        <el-tab-pane label="酒店信息" name="first">
          <el-form ref="formData" :rules="rules" :model="formData" label-width="80px">
            <el-form-item label="酒店名称" prop="shopName">
              <el-input placeholder="酒店名称" v-model="formData.shopName" clearable></el-input>
            </el-form-item>
            <el-form-item label="酒店电话" prop="telephone">
              <el-input placeholder="酒店电话" v-model="formData.telephone" clearable></el-input>
              <span class="tips">※注：座机</span>
            </el-form-item>
            <el-form-item label="接机号码" prop="phone">
              <el-input placeholder="接机号码" v-model="formData.phone" clearable></el-input>
              <span class="tips">※注：接机手机号</span>
            </el-form-item>
            <el-form-item label="酒店地址">
              <el-cascader
                :options="$store.getters.addressData"
                :props="optionProps"
                v-model="selectedOptions"
                clearable
                placeholder="省/市/县">
              </el-cascader>
              <el-input v-model="formData.addressDetail" placeholder="详细地址" clearable></el-input>
            </el-form-item>
            <el-form-item label="酒店介绍" prop="shopContent">
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入内容"
                v-model="formData.shopContent">
              </el-input>
            </el-form-item>
            <el-form-item label="开业时间">
              <el-date-picker type="date" placeholder="开业时间" v-model="formData.openDate" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="装修时间">
              <el-date-picker type="date" placeholder="装修时间" v-model="formData.recentlyDecorated" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="酒店政策">
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入内容"
                v-model="formData.shopPolicy">
              </el-input>
            </el-form-item>
            <el-form-item label="入住时间">
              <el-time-picker
                v-model="formData.checkInTime"
                picker-options="pickerOptions"
                value-format="HH:mm"
                placeholder="入住时间">
              </el-time-picker>
              <span class="tips">※注：入住日{{formData.checkInTime}}之后</span>
            </el-form-item>
            <el-form-item label="退房时间">
              <el-time-picker
                v-model="formData.checkOutTime"
                picker-options="pickerOptions"
                value-format="HH:mm"
                placeholder="退房时间">
              </el-time-picker>
              <span class="tips">※注：离店日{{formData.checkOutTime}}之前</span>
            </el-form-item>
            <el-form-item label="最晚取消">
              <el-time-picker
                v-model="formData.lateCancellation"
                picker-options="pickerOptions"
                value-format="HH:mm"
                placeholder="取消时间">
              </el-time-picker>
              <span class="tips">※注：入住日{{formData.lateCancellation}}之前</span>
              <!--入住前-->
              <!--<el-input-number-->
                <!--v-model="formData.lateCancellation"-->
                <!--controls-position="right"-->
                <!--:min="1"-->
                <!--:max="48">-->
              <!--</el-input-number>-->
               <!--个小时-->
            </el-form-item>
            <el-form-item class="btn-group">
              <el-button type="success" @click="updateHotelInfo('formData')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="设施服务" name="second">
          <el-form>
            <el-form-item v-for="item in showFacilitiesData" :key="item.key" :name="item.key" :label="item.name">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="option in item.lists" :key="option.key" :label="option.key">{{option.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="btn-group">
              <el-button type="success" @click="updateFacilities">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图片管理" name="thread">
          <el-row class="hr" v-for="item in allImageList" :key="item.fileTypeId">
            <el-col>
              <div class="tit">{{item.fileTypeName}}</div>
              <el-upload
                action="https://www.luoxingapp.com/order/fileImageController/uploadImage"
                :data="{type: 3}"
                list-type="picture-card"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUp"
                :file-list="item.fileImages"
                :limit="5">
                <i class="el-icon-plus" @click="setFileTypeId(item.fileTypeId)"></i>
              </el-upload>
            </el-col>
            <span class="tips">※注：每个分类最多上传五张图片,单张图片大于600*600且大小不超过5M</span>
          </el-row>
          <el-row class="btn-group">
            <el-button type="success" @click="addFileImage" :disabled="saveFlag">保存</el-button>
          </el-row>
        </el-tab-pane>
        <!--图片分类管理-->
        <el-tab-pane label="图片分类管理" name="fourth">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="dialogFormFn">新增类别</el-button>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-table :data="tableData" border style="width: 50%">
              <el-table-column prop="fileTypeId" label="分类编号" width="180"></el-table-column>
              <el-table-column prop="fileTypeName" label="分类名称"></el-table-column>
              <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                  <el-button size="mini" @click="dialogFormFn(scope.$index, scope.row)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>

        <!--弹框-->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="handleClose" center :close-on-click-modal="false">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item  v-if="fileTypeId>0" label="分类编号" prop="xcxOpenid">
              <span>{{fileTypeId}}</span>
            </el-form-item>
            <el-form-item label="分类名称" prop="fileTypeName">
              <el-input v-model="ruleForm.fileTypeName" width="200"></el-input>
            </el-form-item>
            <el-form-item align="center">
              <el-button @click="resetForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import { getHotelInfo, updateHotelInfo, getFacilitiesData, getImageTypeList, addFileImage,
    selectFileImageType, addFileImageType, updateFileImageType, getFileImageTypeList } from '@/api/hotel'
  import { getLocationByCity } from '@/api/util'
  import { Message } from 'element-ui'
  export default {
    name: 'index',
    data() {
      // 电话验证
      const validatTelephone = (rule, value, callback) => {
        const reg = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/
        if (!reg.test(value)) {
          callback(new Error('号码格式不正确'))
        } else {
          callback()
        }
      }
      return {
        activeName: 'first',
        saveFlag: false,
        dialogFormVisible: false,
        formData: {
          shopId: '',
          shopName: '',
          shopContent: '',
          telephone: '',
          phone: '',
          addressDetail: '',
          openDate: '',
          recentlyDecorated: '',
          shopPolicy: '',
          checkInTime: '',
          checkOutTime: '',
          latitude: '',
          longitude: '',
          isClose: 2
        },
        ruleForm: {
          fileTypeId: '',
          fileTypeName: ''
        },
        rules: {
          shopName: [
            { required: true, message: '请输入酒店名称', trigger: 'blur' }
          ],
          shopContent: [
            { required: true, message: '请输入酒店简介', trigger: 'blur' }
          ],
          telephone: [
            { validator: validatTelephone, trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入接机电话', trigger: 'blur' }
          ]
        },
        pickerOptions: {
          format: 'HH:mm'
        },
        selectedOptions: [],
        optionProps: {
          value: 'name',
          label: 'name',
          children: 'children'
        },
        shopFacilities: [],
        facilitiesData: [],
        checkList: [],
        uploadParam: {
          type: 3
        },
        allImageList: [],
        fileTypeId: -1,
        tableData: [],
        title: ''
      }
    },
    created() {
      this.getHotelInfo()
      this.getFacilitiesData()
      this.getImageTypeList()
      this.getFileImageTypeList()
    },
    computed: {
      showFacilitiesData: function() {
        const data = []
        this.facilitiesData.map(itema => {
          const temp = this.shopFacilities.filter(itemb => {
            return itema.key === itemb.key
          })
          if (temp.length > 0) {
            itema.lists.map(itemc => {
              temp[0].lists.map(itemd => {
                if (itemc.key === itemd.key) {
                  itemc.status = itemd.status
                }
              })
            })
          }
          data.push(itema)
        })
        return data
      }
    },
    methods: {
      // dialog取消
      resetForm(fileTypeName) {
        this.$refs[fileTypeName].resetFields()
        this.dialogFormVisible = false
      },
      // dialog关闭
      handleClose(done) {
        this.$refs['ruleForm'].resetFields()
        done()
      },
      // 弹框
      dialogFormFn(index, row) {
        if (row) { // 修改
          this.fileTypeId = row.fileTypeId
          this.selectFileImageType(row.fileTypeId)
          this.title = '修改'
        } else { // 新增
          this.fileTypeId = -1
          this.title = '新增'
        }
        this.dialogFormVisible = true
      },
      // 查询单条类别
      selectFileImageType(fileTypeId) {
        const paramObj1 = {
          fileTypeId: fileTypeId
        }
        selectFileImageType(paramObj1).then(response => {
          if (response.returnCode === '200') {
            this.ruleForm = response.result
          }
        })
      },
      // 提交
      submitForm(fileTypeName) {
        this.$refs[fileTypeName].validate((valid) => {
          if (valid) {
            // 简单拷贝对象
            const tempObj = JSON.parse(JSON.stringify(this.ruleForm))
            if (this.fileTypeId > 0) { // 修改
              updateFileImageType(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.dialogFormVisible = false
                  this.$refs['ruleForm'].resetFields()
                  Message({
                    message: response.result,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.getFileImageTypeList()
                  this.getImageTypeList()
                }
              })
            } else { // 新增
              delete tempObj.fileTypeId
              delete tempObj.shopId
              addFileImageType(tempObj).then(response => {
                if (response.returnCode === '200') {
                  this.dialogFormVisible = false
                  this.$refs['ruleForm'].resetFields()
                  Message({
                    message: response.result,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.getFileImageTypeList()
                  this.getImageTypeList()
                }
              })
            }
          }
        })
      },
      // 得到集合
      getFileImageTypeList() {
        const paramObj = {
          shopId: 0
        }
        getFileImageTypeList(paramObj).then(response => {
          if (response.returnCode === '200') {
            this.tableData = response.result
          }
        })
      },
      // 选择地址改变时获取经纬度
      handleChange(value) {
        let addressStr = ''
        if (value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            addressStr += value[i]
          }
          addressStr += this.formData.addressDetail
          getLocationByCity(addressStr).then(response => {
            if (response) {
              this.formData.latitude = response.lat
              this.formData.longitude = response.lng
              console.log(response)
            }
          })
        } else {
          this.formData.latitude = ''
          this.formData.longitude = ''
        }
      },
      // 明细地址改变时获取经纬度
      handleChangeDetail(value) {
        let addressStr = ''
        if (value) {
          addressStr += this.formData.province + this.formData.city + this.formData.area + value
          getLocationByCity(addressStr).then(response => {
            if (response) {
              this.formData.latitude = response.lat
              this.formData.longitude = response.lng
              console.log(response)
            }
          })
        } else {
          this.formData.latitude = ''
          this.formData.longitude = ''
        }
      },
      // 获取酒店信息
      getHotelInfo() {
        getHotelInfo().then(response => {
          if (response.returnCode === '200') {
            this.formData = response.result
            this.selectedOptions = [response.result.province, response.result.city, response.result.area]
            this.shopFacilities = JSON.parse(response.result.shopFacilities)

            // 设置设施选中项
            this.shopFacilities.map(item => {
              item.lists.map(itemb => {
                if (itemb.status === '1') {
                  this.checkList.push(itemb.key)
                }
              })
            })
          } else {
            this.$message({
              type: 'info',
              message: response.msg
            })
          }
        })
      },
      // 修改酒店信息
      updateHotelInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.selectedOptions.length > 0) {
              this.formData.province = this.selectedOptions[0]
              this.formData.city = this.selectedOptions[1]
              this.formData.area = this.selectedOptions[2]
            }
            updateHotelInfo(this.formData).then(response => {
              if (response.returnCode === '200') {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: response.msg
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请完善信息!'
            })
            return false
          }
        })
      },
      // 获取酒店设施数据
      getFacilitiesData() {
        getFacilitiesData().then(response => {
          this.facilitiesData = response
        })
      },
      // 修改基础设施
      updateFacilities() {
        const newFacilitiesData = JSON.parse(JSON.stringify(this.facilitiesData))
        newFacilitiesData.map(item => {
          item.lists.map(itemb => {
            console.log(this.checkList.indexOf(itemb.key))
            if (this.checkList.indexOf(itemb.key) >= 0) {
              itemb.status = '1'
            } else {
              itemb.status = '0'
            }
          })
        })
        this.formData.shopFacilities = JSON.stringify(newFacilitiesData)
        updateHotelInfo(this.formData).then(response => {
          if (response.returnCode === '200') {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
        })
      },
      getImageTypeList() {
        getImageTypeList().then(response => {
          if (response.returnCode === '200') {
            const arr = response.result
            arr.map(item => {
              item.fileImages.map(itemb => {
                itemb.url = 'https://www.luoxingapp.com/images/' + itemb.filePath + '_600x600.jpg'
                itemb.response = { result: itemb.filePath }
              })
            })
            this.allImageList = response.result
          }
        })
      },
      // 上传之前拦截
      handleBeforeUp(file) {
        this.saveFlag = true
        return true
      },
      // 移除图片
      handleRemove(file, fileList) {
        this.allImageList.map(item => {
          if (item.fileTypeId === file.associatedId) {
            item.fileImages = fileList
          }
        })
      },
      // 图片上传成功
      handleSuccess(response, file, fileList) {
        const tempFileList = fileList
        tempFileList.map(item => {
          if (!item.associatedId) {
            item.associatedId = this.fileTypeId
          }
        })
        this.allImageList.map(item => {
          if (item.fileTypeId === this.fileTypeId) {
            item.fileImages = fileList
          }
        })
        this.saveFlag = false
      },
      // 保存图片
      addFileImage() {
        const data = {
          fileImages: []
        }
        this.allImageList.map(item => {
          item.fileImages.map(itemb => {
            data.fileImages.push({
              fileType: 3,
              filePath: itemb.response.result,
              associatedId: itemb.associatedId
            })
          })
        })
        addFileImage(data).then(response => {
          if (response.returnCode === '200') {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存成功!'
            })
          }
        })
      },
      setFileTypeId(id) {
        this.fileTypeId = id
      }
    }
  }
</script>

<style scoped>
  .el-input{
    width: 400px;
  }
  .el-textarea{
    width: 600px;
  }
  .tips{
    font-size: 10px;
    color: #ff845a;
    margin-left: 10px;
  }
  .btn-group{
    margin-top: 60px;
    text-align: center;
  }
  .btn-group .el-button{
    padding: 10px 60px;
  }
  .el-icon-plus{
    width: 120px;
    height: 120px;
  }
  .tit{
    margin: 10px 0 20px 0;
  }

  .hr{
    border-bottom: 1px dashed #e6e6e6;
    padding-bottom: 10px;
    margin: 0 0 20px 0;
  }
</style>
