<template>
    <div class="main">
        <div>
            <router-view></router-view>
        </div>
        <van-tabbar v-model="activeName" active-color="#000ff" inactive-color="#000">
            <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :icon="item.icon" :to="item.path"
                :name="item.name" replace>
                <span>{{ item.title }}</span>
                <template #icon="props">
                    <img :src="props.active ? item.activeImg : item.inactiveImg" alt="">
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
export default {
    name: "Main",
    data() {
        return {
            activeName: "Home",
            // 底部导航栏的数据
            tabbarData: [
                {
                    title: "首页",
                    icon: "home-o",
                    // 标签的名称 路由名称
                    name: "Home",
                    path: "/main/home",
                    // 选中的图片
                    activeImg: require("../assets/images/home_active.png"),
                    inactiveImg: require("../assets/images/home.png"),
                },
                {
                    title: "菜单",
                    icon: "search",
                    // 标签的名称 路由名称
                    name: "Menu",
                    path: "/main/menu",
                    // 选中的图片
                    activeImg: require("../assets/images/menu_active.png"),
                    inactiveImg: require("../assets/images/menu.png")
                },
                {
                    title: "购物袋",
                    icon: "friend-o",
                    // 标签的名称 路由名称
                    name: "Shopbag",
                    path: "/main/Shopbag",
                    // 选中的图片
                    activeImg: require("../assets/images/shopbag_active.png"),
                    inactiveImg: require("../assets/images/shopbag.png")
                },
                {
                    title: "我的",
                    icon: "setting-o",
                    // 标签的名称 路由名称
                    name: "My",
                    path: "/main/My",
                    // 选中的图片
                    activeImg: require("../assets/images/my_active.png"),
                    inactiveImg: require("../assets/images/my.png")
                },
            ]
        }
    }
}
</script>