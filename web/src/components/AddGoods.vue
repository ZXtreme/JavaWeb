<template>
  <div class="add">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品编号" prop="name" label-width="100px">
        <el-input v-model.number="ruleForm.name" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="desc">
        <el-input type="textarea" style="width: 70%" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <!-- 商品图片只能上传png文件,且不超过500kb -->
      <el-form-item label="商品图片" prop="pic">
        <el-upload class="upload-demo" ref="upload" action="http://127.0.0.1/api" :auto-upload="false" accept=".png"
          :limit="1" :on-exceed="handleExceed">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传png文件,且不超过500kb,推荐图片宽高比为1:1</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        ¥&nbsp;&nbsp;<el-input v-model.number="ruleForm.price" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item label="商品存货量" prop="store">
        <el-input v-model.number="ruleForm.store" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item label="是否在售" prop="selling">
        <el-switch v-model="ruleForm.selling"></el-switch>
      </el-form-item>
      <el-form-item>
        <slot>
          <el-button type="primary" @click="submitAdd('ruleForm')">新增商品</el-button>
        </slot>
        <el-button @click="resetForm('ruleForm')" style="margin-left: 100px;">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        store: '',
        selling: false,
        price: '',
        desc: ''
      },
      rules: {
        // 商品编号应大于 0 且为整数
        name: [
          { required: true, message: '请输入商品编号', trigger: 'blur' },
          { type: 'integer', min: 0, message: '商品编号应大于 0 且为整数 ', trigger: 'blur' }
        ],
        // 存货量在 0 到 999999 之间且为整数
        store: [
          { required: true, message: '请输入商品存货量', trigger: 'blur' },
          { type: 'integer', min: 0, max: 999999, message: '存货量在 0 到 999999 之间且为整数', trigger: 'blur' }
        ],
        // 价格在 0 到 999999 之间
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', min: 0, max: 999999, message: '价格在 0 到 999999 之间', trigger: 'blur' }
        ],
        // 长度在 3 到 40 个字符
        desc: [
          { required: true, message: '请填写商品描述', trigger: 'blur' },
          { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setgoods']),
    submitAdd(formName) {
      // 将填写的所有信息根据上述规则进行严格校验
      this.$refs[formName].validate(async (valid) => {
        // 校验通过
        if (valid) {
          const file = document.querySelector('.el-upload__input').files[0]
          // 单独校验图片
          if (!file) {
            alert('未上传商品图片')
            return false
          }
          // 整理所有表单信息
          const fd = new FormData()
          fd.append('goodsname', this.ruleForm.name)
          fd.append('description', this.ruleForm.desc)
          fd.append('price', this.ruleForm.price)
          fd.append('store_num', this.ruleForm.store)
          fd.append('sold_num', 0)
          fd.append('selling', this.ruleForm.selling ? 1 : 0)
          fd.append('file', file)
          // 发送post请求
          const { data } = await this.$http({
            method: 'POST',
            url: '/insert',
            headers: {
              Authorization: localStorage.getItem('token')
            },
            data: fd,
            processData: false,
            contentType: false
          })
          // 展示结果
          alert(data.msg)
          if (data.status === 200) {
            this.resetForm('ruleForm')
            const { data } = await this.$http({
              method: 'get',
              headers: {
                Authorization: localStorage.getItem('token')
              },
              url: '/getfullgoods'
            })
            if (data.status === 200) {
              this.setgoods(data.goods)
            }
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  margin: 0 5%;
  padding-top: 20px;
}
</style>
