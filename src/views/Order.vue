<template>
    <div class="order">
        <van-nav-bar title="我的订单" left-text="返回" left-arrow fixed @click-left="back" />
        <BgBox>

            <van-tabs v-model="tabIndex" color="#1a73e8" title-active-color="#1a73e8" line-height="2"
                @change="changeTab">
                <van-tab :title="item.title" v-for="(item, index) in tabData" :key="index">
                    <div v-if="orderData.length > 0">
                        <div class="order-box" v-for="(v, k) in orderData" :key="v.oid">
                            <OrderList :info-title-left="v.oid" :date="v.date | formatDate('yyyy-MM-dd hh:mm:ss')"
                                :count="v.count" :total="v.total | decimal" :is-right="true"
                                @confirm-receive="confirmReceive(v, k)" @remove="removeOrder(v.oid, k)"
                                :is-receive="v.status == 2">
                                <OrderItem v-for="(value, idx) in v.data" :key="idx" :item="value">
                                </OrderItem>
                                <p>哈哈哈哈</p>
                            </OrderList>
                        </div>
                    </div>
                    <div v-else>
                        <van-empty description="泥沙啊，膜的订单" />
                    </div>
                </van-tab>
            </van-tabs>
            <!-- <div v-if="isHas">
            </div>
            <div v-else>
                <van-empty description="泥沙啊，膜的订单" />
            </div> -->
        </BgBox>
    </div>
</template>
<script>
import BgBox from "../components/BgBox.vue";
import OrderList from "../components/OrderList.vue";
import OrderItem from "../components/OrderItem.vue";
export default {
    name: "Order",
    components: {
        BgBox,
        OrderList,
        OrderItem,
    },
    data() {
        return {
            test: "2020-02-12T06:09:25.000Z",
            // 激活tab标签的下标
            tabIndex: 0,
            tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
            // 订单商品数据
            orderData: [],
            // 全部没有订单的数据
            isHas: true,
        };
    },
    created() {
        // 根据订单状态获取订单数据
        this.getOrderDataByStatus();
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 切换订单状态 0： 全部，1：进行中，2：已完成
        changeTab(name, title) {
            // 根据订单状态获取订单数据
            this.getOrderDataByStatus();
        },
        // 根据订单状态获取订单数据
        getOrderDataByStatus() {
            let tokenString = localStorage.getItem("token");

            if (!tokenString) {
                // 没有token跳回登录页面
                this.$toast("请先登录");
                this.$router.push({ name: "Login" });
                return;
            }
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "GET",
                url: "/findOrder",
                params: {
                    appkey: this.appkey,
                    tokenString,
                    status: this.tabIndex,
                },
            })
                .then((result) => {
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        // token无效，则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 70000) {
                        // 如果全部没有订单数据，则移除tab
                        if (this.tabIndex == 0 && result.data.result.length == 0) {
                            this.isHas = false;
                            return;
                        }
                        // 按照订单的编号oid进行分类
                        let orderDatas = [];
                        result.data.result.map((v) => {
                            // 查找orderDatas的订单数据，如果找到，则将商品存放在当前订单中,累加当前订单商品数量和当前订单的总金额
                            for (let i = 0; i < orderDatas.length; i++) {
                                if (orderDatas[i].oid == v.oid) {
                                    orderDatas[i].data.push(v);
                                    orderDatas[i].count += v.count;
                                    // 商品价格总数 = 数量X单价
                                    orderDatas[i].total += v.count * v.price;
                                    return;
                                }
                            }
                            // 如果找不到当前订单数据，则初始化当前订单数据
                            let o = {};
                            o.oid = v.oid;
                            o.count = v.count;
                            o.total = v.count * v.price;
                            o.status = v.status;
                            o.date = v.createdAt;
                            o.data = [v];
                            orderDatas.push(o);
                        });
                        this.orderData = orderDatas;
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                });
        },
        // 确认收货
        confirmReceive(item, index) {
            let tokenString = localStorage.getItem("token");

            if (!tokenString) {
                // 没有token跳回登录页面
                this.$toast("请先登录");
                this.$router.push({ name: "Login" });
                return;
            }
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/receive",
                data: {
                    appkey: this.appkey,
                    tokenString,
                    oid: item.oid,
                },
            })
                .then((result) => {
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        // token无效，则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 80000) {
                        if (this.tabIndex == 1) {
                            this.orderData.splice(index, 1);
                        }
                        item.status = 2;
                    }
                    this.$toast(result.data.msg);
                })
                .catch((err) => {
                    this.$toast.clear();
                });
        },
        // 删除订单
        removeOrder(oid, index) {
            let tokenString = localStorage.getItem("token");

            if (!tokenString) {
                // 没有token跳回登录页面
                this.$toast("请先登录");
                this.$router.push({ name: "Login" });
                return;
            }
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/removeOrder",
                data: {
                    appkey: this.appkey,
                    tokenString,
                    oid
                },
            })
                .then((result) => {
                    this.$toast.clear();
                    if (result.data.code == 700) {
                        // token无效，则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == 90000) {
                        this.orderData.splice(index, 1);
                    }
                    this.$toast(result.data.msg);
                })
                .catch((err) => {
                    this.$toast.clear();
                });
        },
    },
};
</script>