<template>
    <div class="Pay">  
        <van-nav-bar title="订单结算" left-text="返回" fixed left-arrow @click-left="back" />
        <div class="pay-box">
            <div class="select-address">
                <div class="span">
                    <span  @click="showSelectAddressList">选择地址  ></span>
                    <van-icon class-prefix="arrow" name="arrow"/>
                </div>
                
                <div class="user-box">
                    <div class="user-name">{{currentAddress.name}}</div>
                    <div class="user-phone" >{{currentAddress.tel}}</div>
                    <div class="default-address" v-if="currentAddress.isDefault">默认</div>
                </div>
                <div class="detail-address">{{currentAddress.address}}</div>
            </div>
        </div>

        <div class="order-info" style="font-size:20px;">
            <OrderList info-title-left="订单信息"  :count="productInfo.count" :total="productInfo.total">
                <OrderItem v-for="(item,index) in products" :key="index" :item="item">
                </OrderItem>
                <br>
            </OrderList>
        </div>

        <div class="btn-box">
            <van-button type="primary" block round color="#1A73E8" @click="payBox">立即结算</van-button>
        </div>

        <van-popup is-link position="bottom" closeable v-model="isOpen">
            <div class="address-title"> 选择地址</div>
            <van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="newAddress"
                @select="selectAddress" />
        </van-popup>
    </div>
    
</template>

<script>

import OrderItem from '@/components/OrderItem.vue'
import OrderList from '@/components/OrderList.vue'
export default {
    components:{OrderItem,OrderList},
    data() {
        return {
            isOpen: false,
            //选择地址id
            chosenAddressId: "",
            //选择当前地址
            currentAddress: [],
            //购物袋sid
            sid: [],
            products: [],
            //商品数量和订单总价
            productInfo: {
                count: 0,
                total: 0,
            },
            //地址
            list: [],
            NewAddress: ""
        };
    },
    created() {
        this.sids = this.$route.query.sids.split("-");
        this.getAddressData();
        this.getShopbagBySids();
        
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        //新增地址
        newAddress() {
            this.$router.push({ name: "NewAddress" });
        },
        //选择地址
        selectAddress(item, index) {
            this.isOpen = false;
            this.currentAddress = item;
        },
        //展示选择地址的列表
        showSelectAddressList() {
            this.isOpen = true;
        },
        //获取地址列表数据
        getAddressData() {
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" });
            }
            this.$toast.loading({
                message: "加载中……",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "GET",
                url: "/findAddress",
                params: {
                    appkey: this.appkey,
                    tokenString
                }
            })
                .then((result) => {
                this.$toast.clear();
                
                console.log('地址数据',result);
                if (result.data.code == 700) {
                    this.$router.push({ name: "Login" });
                }
                else if (result.data.code = 20000) {
                    result.data.result.map((v) => {
                        v.isDefault = Boolean(v.isDefault);
                        v.id = v.aid;
                        v.address = `${v.province}${v.city}${v.county}${v.addressDetall}`;
                        if (v.isDefault) {
                            this.chosenAddressId = v.aid;
                            this.currentAddress = v;
                        }
                    });
                    this.list = result.data.result;
                }
            })
                .catch((err) => {
                this.$toast.clear();
            });
        },
        //根据sids获取购物袋的数据
        getShopbagBySids() {
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                // 没有token跳回登录页面
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" });
            }
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "GET",
                url: "/commitShopcart",
                params: {
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids),
                },
            })
                .then((result) => {
                console.log("订单数据", result);
                this.$toast.clear();
                if (result.data.code == 700) {
                    this.$router.push({ name: "Login" });
                }
                else if (result.data.code == 50000) {
                    if (result.data.result.length == 0) {
                        return this.$router.push({ name: "Home" });
                    }
                    result.data.result.map((v) => {
                        this.productInfo.count += v.count;
                        this.productInfo.total += v.count * v.price;
                    });
                    this.products = result.data.result;
                }
                else {
                    this.$toast(result.data.msg);
                }
            })
                .catch((err) => {
                this.$toast.clear();
            });
        },
        //结算订单
        pay() {
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" });
            }
            this.$toast.loading({
                message: "加载中……",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/pay",
                data: {
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids),
                    phone: this.currentAddress.tel,
                    address: this.currentAddress.address,
                    recevier: this.currentAddress.name,
                },
            })
                .then((result) => {
                this.$toast.clear();
                console.log(result);
                if (result.data.code == 700) {
                    this.$router.push({ name: "Login" });
                }
                else {
                    this.$toast(result.data.msg);
                    setTimeout(() => {
                        this.$router.push({ name: "Order" });
                    });
                }
            })
                .catch((err) => {
                this.$toast.clear();
            });
        },
        //结算提示
        payBox() {
            if (!this.chosenAddressId) {
                this.$toast("请选择收货地址");
                return;
            }
            this.$dialog.confirm({
                title: "确认订单",
                message: "是否立即结算",
            })
                .then(() => {
                this.pay();
            }).catch(err => { });
        }
    },
    components: {
    OrderItem,
    OrderList, OrderItem }
}
</script>

<style lang="less" scoped>
.select-address{
    background-color: #fff;
    padding: 10px;
    margin-right: 20px;
    margin-bottom: 6px;
    margin-left:  5px;
    margin-right: 5px;
}
.span{
    margin-top: 15%;
    font-size: 16px;
    font-weight: 400;
}
.user-box{
    margin-top: 4%;
    color: black;
}
.order-info{
    margin-top: 5%;
}

.user-box{
    display: flex;
    justify-content: space-between;
    flex-direction: left;
    .user-name{
        font-weight: bold;
        font-size: 16px;
    }
    .user-phone{
        font-size: 16px;

    }
    .default-address{
        width: 28px;
        font-size: 12px;
        color: aliceblue;
        border-radius:6px ;
        text-align: center;
        background-color: rgb(0, 47, 255);
    }
    
}
.detail-address{
        font-size: 14px;
    }
</style>