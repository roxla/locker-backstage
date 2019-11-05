import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/test'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Menu from '@/components/Menu'
// nav1
import Index from '@/components/nav1/Index'
// nav2
import Order from '@/components/nav2/Order'
import Open from '@/components/nav2/Open'
// nav3
import CaseSet from '@/components/nav3/CaseSet'
import CaseCost from '@/components/nav3/CaseCost'
// nav4
import MonCount from '@/components/nav4/MonCount'
import Charge from '@/components/nav4/Charge'
// nav5
import Coupon from '@/components/nav5/Coupon'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/hello',
      name: 'hello',
      component: HelloWorld
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      meta: {
        requrireAuth: true
      },
      children:[
        // nav1
        {
          path: 'index',
          name: 'index',
          component: Index,
          meta: {
            requrireAuth: true,
            title: "存柜信息"
          }
        },
        // nav2
        {
          path: 'order',
          name: 'order',
          component: Order,
          meta: {
            requrireAuth: true,
            title: "订单信息"
          }
        },
        {
          path: 'open',
          name: 'open',
          component: Open,
          meta: {
            requrireAuth: true,
            title: "开柜申请"
          }
        },
        // nav3
        {
          path: 'caseset',
          name: 'caseset',
          component: CaseSet,
          meta: {
            requrireAuth: true,
            title: "智能柜设置"
          }
        },
        {
          path: 'casecost',
          name: 'casecost',
          component: CaseCost,
          meta: {
            requrireAuth: true,
            title: "柜门价格设置"
          }
        },
        // nav4
        {
          path: 'moncount',
          name: 'moncount',
          component: MonCount,
          meta: {
            requrireAuth: true,
            title: "月度统计"
          }
        },
        {
          path: 'charge',
          name: 'charge',
          component: Charge,
          meta: {
            requrireAuth: true,
            title: "充值核销记录"
          }
        },
        // nav5
        {
          path: 'coupon',
          name: 'coupon',
          component: Coupon,
          meta: {
            requrireAuth: true,
            title: "代金券设置"
          }
        }
      ]
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
      meta: {
        requrireAuth: true
      },
    }
  ]
})

// router.beforeEach((to, from ,next) => {
//   if(to.path == '/'){
//     next();
//   }else if(to.meta.requrireAuth){
//     let user = sessionStorage.getItem("OpenId");
//     if(user){
//       next();
//     }else{
//       next({
//         path:'/'
//       });
//     }
//   }else{
//     next();
//   }
// })

export default router;