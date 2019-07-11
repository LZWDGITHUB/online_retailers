import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Welcome from "@/views/welcome/Welcome.vue";
import User from "@/views/user/User.vue";
import Rights from "@/views/right/Rights.vue";
import Roles from "@/views/right/Roles.vue";
import Category from "@/views/category/Category"
import Goods from "@/views/goods/Goods"
import Toadd from "@/views/goods/Toadd"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      redirect: { path: "welcome" },
      children: [
        {
          name: "Welcome",
          path: "welcome",
          component: Welcome
        },
        {
          name: "Users",
          path: "users",
          component: User
        },
        {
          name: "Rights",
          path: "rights",
          component: Rights
        },
        {
          name: "Roles",
          path: "roles",
          component: Roles
        },
        {
          name: "Category",
          path: "categories",
          component: Category
        },
        {
          name: "Goods",
          path: "goods",
          component: Goods
        },
        {
          name: "Toadd",
          path: "toadd",
          component: Toadd
        }
      ]
    }
  ]
});
