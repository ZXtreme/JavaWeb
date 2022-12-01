## 华南理工大学网络应用开发课程实验
```
姓名：郑瑞成
学号：202030444063
班级：20计科1班
实验：设计并实现一个电子商务网站的开发和在线部署
```

### 在线部署网址
<http://119.91.63.11>


### 技术栈
```
html、css、js、mysql、axios、vue、nodejs
```

### 目录树
```
│  README.md 
│
├─server                  # 后端
│  │  server.js           # 创建服务器的主文件
│  ├─goods_images         # 存储商品图片的文件夹
│  ├─router               
│  │      login-register.js  # 登录与注册路由
│  └─utils
│          mysql.js       # mysql基本配置工具
│
└─web                     # 前端
    └─src
        │  App.vue       # 根组件
        │  main.js
        ├─assets         # 静态资源，如：图片等
        ├─components     # 可复用组件
        │      AboutGoods.vue   # 商品信息组件
        │      AboutLogging.vue # 日志信息组件
        │      AddGoods.vue     # 新增商品信息组件
        │      DataChart.vue    # 商品表格组件
        │      DeleteGoods.vue  # 删除商品信息组件
        │      GoodsManage.vue  # 商品管理组件
        │      PageHeader.vue   # 页面头部组件
        │      UpdateGoods.vue  # 更新商品信息组件
        ├─router         # vue-router
        │      index.js
        ├─store          # vuex
        │      index.js
        └─views          # 路由组件
               AboutLogin.vue  # 登录组件
               GoodsDetail.vue # 商品详情组件
               MainPage.vue    # 购物主页面
               ManagePage.vue  # 商品总管理页面
```
