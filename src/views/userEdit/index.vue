<template>
  <el-container>
    <el-main>
      <el-form :model="formData" ref="formData" :rules="rules" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" placeholder="旧密码" v-model="formData.oldPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" placeholder="新密码" v-model="formData.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="password2">
          <el-input type="password" placeholder="重复密码" v-model="formData.password2" clearable></el-input>
        </el-form-item>
        <el-form-item class="btn-group">
          <el-button @click="resetForm('formData')">重置</el-button>
          <el-button type="success" @click="updatePass('formData')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import { updatePass } from '@/api/members'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.formData.password !== '') {
            this.$refs.formData.validateField('password2')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.formData.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        formData: {
          password: '',
          password2: '',
          oldPassword: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度至少6位,最多16位', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度至少6位,最多16位', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          password2: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度至少6位,最多16位', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 修改密码
      updatePass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updatePass(this.formData).then(response => {
              if (response.returnCode === '200') {
                this.$message({
                  text: 'success',
                  message: response.msg
                })
                this.$store.dispatch('LogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              } else {
                this.$message({
                  text: 'success',
                  message: response.msg
                })
              }
            })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
  .el-input{
    width: 300px;
  }
</style>
