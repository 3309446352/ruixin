<template>
    <div class="menu">
        <div class="menu-nav">
            <!-- 搜索框 -->
            <div class="menu-search">
                <van-search placeholder="请输入搜索关键词" v-model="name" @click="goSearch"/>                
            </div>
            <!-- 分类菜单 -->
            <div class="menu-option">
                <!-- 一个选项 -->
                <div class="m-item" v-for="(item,index) in menuOption" :key="index"
                    @click="toggleMenu(index,item.type)">
                    <!-- 图标 -->
                    <div class="m-icon">
                        <img :src="menuIndex == index ? item.activeIcon : item.inactiveIcon" alt="">
                        <!-- 标题 -->
                        <div class="m-text">{{item.title}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="menu-porduct">
            <div class="m-pro-item clearfix" v-for="(item,index) in productData" :key="index">
                <div>
                    <img :src="item.smallImg" @click="goDetall(item.pid)" alt="" class="pro-img fl" />
                </div>
                <div class="text fl">
                    <div class="pro-name">{{item.name}}</div>
                    <div class="pro-enname">{{item.enname}}</div>
                </div>
                <div class="price fl">
                    ￥{{item.price}}
                </div>
            </div>
        </div>
        <!-- 空白 -->
        <div style="height:50px"></div>
    </div>

</template>
<script>
    // import "../assets/less/menu.less";
    export default {
        name: "Menu",
        data() {
            return {
                menuIndex: 0,
                menuOption: [{
                        title: "推荐",
                        activeIcon: require("../assets/images/icons_21.gif"),
                        inactiveIcon: require("../assets/images/icons_09.gif"),
                    },
                    {
                        title: "拿铁",
                        activeIcon: require("../assets/images/icons_19.gif"),
                        inactiveIcon: require("../assets/images/icons_05.gif"),
                    },
                    {
                        title: "咖啡",
                        activeIcon: require("../assets/images/icons_18.gif"),
                        inactiveIcon: require("../assets/images/icons_03.gif"),
                    },
                    {
                        title: "瑞纳冰",
                        activeIcon: require("../assets/images/icons_20.gif"),
                        inactiveIcon: require("../assets/images/icons_07.gif"),
                    },
                ],
                productData: [],
                name:''
            };
        },
        //点击切换
        methods: {
            toggleMenu(index, type) {
                if (this.menuIndex == index) {
                    return;
                }
                this.menuIndex = index;
                this.getProductByType(type);
            },
            //获取商品类型
            getType() {
                //发起注册请求
                this.axios({
                    method: "GET",
                    url: "type",
                    //请求参数
                    params: {
                        appkey: this.appkey,
                    },
                }).then((result) => {
                    console.log(result);
                    if (result.data.code == 400) {
                        let data = result.data.result;
                        console.log(data);
                        data.unshift({
                            type: "isHot",
                            typeDesc: "推荐",
                        });
                        this.menuOption.map(v => {
                            for (let i = 0; i < data.length; i++) {
                                if (v.title == data[i].typeDesc) {
                                    v.type = data[i].type;
                                    break;
                                }
                            }
                        });
                        let type = this.menuOption[this.menuIndex].type;
                        this.getProductByType(type);
                    }
                });
            },
            //根据商品类型获取数据
            getProductByType(type) {
                //请求参数
                let params = {
                    appkey: this.appkey,
                };
                if (type == "isHot") {
                    params.key = "isHot";
                    params.value = 1;
                } else {
                    params.key = "type";
                    params.value = type;
                }
                //发起请求
                this.axios({
                    method: "GET",
                    url: "/typeProducts",
                    //请求参数
                    params,
                }).then((result) => {
                    console.log(result.data.result);
                    if (result.data.code == 500) {
                        this.productData = result.data.result;
                    }
                });
            },
            goDetall(pid) {
                this.$router.push({name: "Detall",params: {pid}})
            },
            //搜素跳转
            goSearch(){
                this.$router.push({name: "Search"})
            }
        },
        created() {
            this.getType();
        }
    };
</script>
<style lang="less" scoped>
    .menu {
        padding: 10px;
        background-color: #fbfbfb;

        .menu-nav {

            .menu-option {
                display: flex;
                justify-content: space-around;

                .m-item {

                    .m-icon {
                        height: 12vh;
                        // background-color: aquamarine;

                        .m-text {
                            text-align: center;
                        }
                    }
                }
            }
        }

        .menu-porduct {

            .m-pro-item {
                .pro-img {
                    height: 80px;
                    width: auto;
                    padding: 10px;

                }

                .text {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    margin-top: 30px;

                    .pro-name {
                        color: black;
                        font-size: 16px;
                        width: 150px;
                    }

                    .pro-enname {
                        font-size: 16px;
                        width: 150px;
                        color: black;

                    }
                }

                .price {
                    width: 80px;
                    height: 90px;
                    float: right;
                    // background-color: aquamarine;
                    font-size: 16px;
                    color: rgb(36, 76, 239);
                    line-height: 90px;
                }
            }
        }

    }
</style>