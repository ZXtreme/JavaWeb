<template>
  <div class="update">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="rules">
      <el-form-item label="需要修改的商品" prop="user">
        <el-input v-model.number="formInline.user" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="data" v-if="targetInfo.length > 0">
      <el-table :data="solve(targetInfo)" style="width: 100%">
        <el-table-column label="商品编号">
          <template slot-scope="scope">
            {{ scope.row.goodsname }}
          </template>
        </el-table-column>
        <el-table-column label="商品描述" width="180">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="180">
          <template slot-scope="scope">
            <img :src="'http://127.0.0.1/goods/' + scope.row.goodsname + '.png'" alt=""
              style="width:150px;border-radius: 10px;">
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column label="存货量">
          <template slot-scope="scope">
            {{ scope.row.store_num }}
          </template>
        </el-table-column>
        <el-table-column label="销售量">
          <template slot-scope="scope">
            {{ scope.row.sold_num }}
          </template>
        </el-table-column>
        <el-table-column label="是否在售">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.selling" active-color="#13ce66" inactive-color="#ff4949" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>

    <div class="add" v-if="targetInfo.length > 0">
      <el-form :model="ruleForm" :rules="rules_plus" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品编号" prop="name" label-width="100px">
          <el-input v-model.number="ruleForm.name" style="width: 50%" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input type="textarea" style="width: 70%" v-model="ruleForm.desc"></el-input>
        </el-form-item>
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
        <el-form-item label="商品销售量" prop="sold">
          <el-input v-model.number="ruleForm.sold" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="是否在售" prop="selling">
          <el-switch v-model="ruleForm.selling"></el-switch>
        </el-form-item>
        <el-form-item>
          <slot>
            <el-button type="primary" @click="submitAdd('ruleForm')">确认修改</el-button>
          </slot>
          <el-button @click="resetForm('ruleForm')" style="margin-left: 100px;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      formInline: {
        user: ''
      },
      targetInfo: [],
      rules: {
        user: [
          { required: true, message: '请输入商品编号', trigger: 'blur' },
          { type: 'integer', min: 0, message: '商品编号应大于 0 且为整数', trigger: 'blur' }
        ]
      },
      ruleForm: {
        name: '',
        store: '',
        selling: false,
        sold: '',
        price: '',
        desc: ''
      },
      rules_plus: {
        name: [
          { required: true, message: '请输入商品编号', trigger: 'blur' },
          { type: 'integer', min: 0, message: '商品编号应大于 0 且为整数 ', trigger: 'blur' }
        ],
        store: [
          { required: true, message: '请输入商品存货量', trigger: 'blur' },
          { type: 'integer', min: 0, max: 999999, message: '存货量在 0 到 999999 之间且为整数', trigger: 'blur' }
        ],
        sold: [
          { required: true, message: '请输入商品销售量', trigger: 'blur' },
          { type: 'integer', min: 0, max: 999999, message: '销售量在 0 到 999999 之间且为整数', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', min: 0, max: 999999, message: '价格在 0 到 999999 之间', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写商品描述', trigger: 'blur' },
          { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['goods'])
  },
  methods: {
    ...mapMutations(['setgoods']),
    onSubmit() {
      // 遍历整个商品对象数组，逐个查找
      for (const k in this.goods) {
        if (this.goods[k].goodsname === this.formInline.user) {
          this.targetInfo = [this.goods[k]]
          this.ruleForm = {
            name: this.goods[k].goodsname,
            store: this.goods[k].store_num,
            selling: this.goods[k].selling === 1,
            sold: this.goods[k].sold_num,
            price: this.goods[k].price,
            desc: this.goods[k].description
          }
          return
        }
      }
      alert('不存在该商品编号对应的商品,请输入正确的商品编号')
    },
    submitAdd(formName) {
      // 将填写的所有信息根据上述规则进行严格校验
      this.$refs[formName].validate(async (valid) => {
        // 校验通过
        if (valid) {
          const file = document.querySelector('.el-upload__input').files[0]
          const fd = new FormData()
          fd.append('goodsname', this.ruleForm.name)
          fd.append('description', this.ruleForm.desc)
          fd.append('price', this.ruleForm.price)
          fd.append('store_num', this.ruleForm.store)
          fd.append('sold_num', this.ruleForm.sold)
          fd.append('selling', this.ruleForm.selling ? 1 : 0)
          // 判断是否需要更新图片
          if (file) {
            fd.append('file', file)
          }
          // 发送post请求
          const { data } = await this.$http({
            method: 'POST',
            url: '/update',
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
            // 更新成功后，获取最新的商品信息
            this.targetInfo = []
            this.formInline.user = ''
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
      this.ruleForm = {
        name: '',
        store: '',
        selling: false,
        sold: '',
        price: '',
        desc: ''
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    solve(val) {
      const arr = []
      for (let i = 0; i < this.targetInfo.length; i++) {
        const obj = {}
        for (const k in val[i]) {
          obj[k] = val[i][k]
        }
        obj.selling = obj.selling === 1
        arr.push(obj)
      }
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
.update {
  margin: 0 5%;

  .demo-form-inline {
    margin-top: 20px;
    text-align: center;
  }

  .add {
    margin-top: 20px;
  }
}
</style>
