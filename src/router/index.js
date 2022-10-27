import Vue from 'vue'
import VueRouter from 'vue-router'




Vue.use(VueRouter)

const routes = [
  //  一级路由
  {
    path: "/main",
    name: "Main",
    component: () => import("../views/main.vue"),
    children: [{
        path: "home",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("../views/Menu.vue"),
      },
      {
        path: "Shopbag",
        name: "Shopbag",
        component: () => import("../views/Shopbag.vue"),
      },
      {
        path: "My",
        name: "My",
        component: () => import("../views/My.vue"),
      }
    ]
  },
  {
    path: "/detall:pid",
    name: "Detall",
    component: () => import("../views/Detall.vue")
  },
  {
    path: "*",
    redirect: {
      name: "Home"
    }
  },
  {
    path: "/Search",
    name: "Search",
    component: () => import("../views/Search.vue")
  },
  {
    path: "/Forget",
    name: "Forget",
    component: () => import("../views/Forget.vue")
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/Account",
    name: "Account",
    component: () => import("../views/Account.vue")
  },
  {
    path: "/Order",
    name: "Order",
    component: () => import("../views/Order.vue")
  },
  {
    path: "/NewAddress",
    name: "NewAddress",
    component: () => import("../views/NewAddress.vue")
  },
  {
    path: "/Like",
    name: "Like",
    component: () => import("../views/Like.vue")
  },
  {
    path: "/Secure",
    name: "Secure",
    component: () => import("../views/Secure.vue")
  },
  {
    path: "/Address",
    name: "Address",
    component: () => import("../views/Address.vue")
  },
  {
    path: "/Pay",
    name: "Pay",
    component: () => import("../views/Pay.vue")
  },
  {
    path: "/Track",
    name: "Track",
    component: () => import("../views/Track.vue")
  },

]

const router = new VueRouter({
  routes
})

export default router