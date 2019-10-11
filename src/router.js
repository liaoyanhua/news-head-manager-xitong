import Vue from 'vue'
import Router from 'vue-router'

//导入组件
import Login from '@/views/Login'
import Index from '@/views/Index'
import PostAdd from '@/views/PostAdd'
import Welcome from '@/views/Welcome'
import PostList from '@/views/PostList'
import PostEdit from '@/views/PostEdit'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path:'/login',component:Login},
    {path:'/',meta:'头条后台',component:Index,children:[
      {path:'post-add',meta:'发布文章',component:PostAdd},
      {path:'index',meta:'首页',component:Welcome},
      {path:'post-list',meta:'文章列表',component:PostList},
      {path:'post-edit/:id',meta:'编辑文章',component:PostEdit}
    ]}
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
