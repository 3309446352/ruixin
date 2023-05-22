<template>
    <div class="ShopInfo-box">
        <van-nav-bar title="商品详情" left-text="返回"  left-arrow @click-left="onClickLeft" @click-right="showShare = true">
            <template #right>
                <van-icon name="ellipsis" size="18" />
            </template>
        </van-nav-bar>
        <div>
            <img class="auto_img" :src="ChatDetail.large_img" />
        </div>
        <div class="Detail-box">
            <div class="info-box">
                <!-- 商品价格和名称 -->
                <div class="priceAndchatName-box clearfix">
                    <div class="fl">
                        <div class="chatName">{{ ChatDetail.name }}</div>
                        <div class="chatEnName">{{ ChatDetail.enname }}</div>
                    </div>
                    <div class="chatPrice">￥{{ ChatDetail.price }}</div>
                </div>
                <!-- 商品规格 -->
                <div class="rule-box" >
                    <div class="rule-item clearfix">
                        <div class="rule-title fl" :model="ruleData.rule.drink">温度</div>
                        <div class="fl">
                            <div class="r-item fl" :class="(ruleData.rule.drink == '冷') ? 'active':''"
                                @click="ruleData.rule.drink = '冷'">冷</div>
                            <div class="r-item fl" :class="(ruleData.rule.drink == '热') ? 'active':''"
                                @click="ruleData.rule.drink = '热'">热</div>
                        </div>
                    </div>
                    <div class="rule-item clearfix">
                        <div class="rule-title fl" :v-model=" ruleData.rule.sugar">糖</div>
                        <div class="fl">
                            <div class="r-item fl" :class="(ruleData.rule.sugar == '无糖') ? 'active':''"
                                @click="ruleData.rule.sugar = '无糖'">无糖</div>
                            <div class="r-item fl" :class="(ruleData.rule.sugar == '半糖') ? 'active':''"
                                @click="ruleData.rule.sugar = '半糖'">半糖</div>
                            <div class="r-item fl" :class="(ruleData.rule.sugar == '全糖') ? 'active':''"
                                @click="ruleData.rule.sugar = '全糖'">全糖</div>
                        </div>
                    </div>
                </div>
                <!-- 商品数量 -->
                <div class="c-box clearfix">
                    <div class="select-c fl">选择数量</div>
                    <div class="counts-box fr">
                        <van-stepper v-model="ruleData.count" theme="round" button-size="22" disable-input />
                    </div>
                </div>
                <!-- 商品描述 -->
                <div class="desc-box">
                    <div class="desc-title">商品描述</div>
                    <div class="desc-text">
                        <div class="context">
                            {{ChatDetail.desc}}
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- 底部购物操作nav -->
        <van-goods-action>
            <van-goods-action-icon :TO="{name:'shopbag'}" icon="bag" text="购物袋" @click="goshopbag" :badge="bagCount == 0 ? '': bagCount" :color="bagCount>0 ?'#1A73E8':'#646566'"/>
            <van-goods-action-icon icon="like" :text="isLike ? '已收藏':'收藏'" @click="toggleLikeproduct" :color="isLike ?'#1A73E8':'#646566'" />
            <van-goods-action-button type="warning" color="#6A91EC"  @click="addShopbag" text="加入购物车" />
            <!-- <van-goods-action-button type="danger" color="#1A73E8" text="立即购买"  @click="goPay(sids)"/> -->
        </van-goods-action>
    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    name: "Detall",
    data() {
        return {
            ChatDetail: {},
            ruleData: {
                count: 1,
                rule: {
                    sugar: '半糖',
                    drink: '冷'
                }
            },
            showShare: false,
            options: [
                [
                { name: '微信', icon: 'wechat' },
                { name: '朋友圈', icon: 'wechat-moents' },
                { name: '微博', icon: 'weibo' },
                { name: 'QQ', icon: 'qq' },
                ],

                [
                { name: '微信', icon: 'wechat' },
                { name: '微信', icon: 'wechat' },
                { name: '微信', icon: 'wechat' },
                { name: '微信', icon: 'wechat' },
                ],
            ],
            isLike:'',
            productDetail:{},
            bagCount:0,
            pid:''
        };
    },
    created() {
        this.pid = this.$route.params.pid;
        this.getChatDetail();
        this.findLike();
        this.shopBagCount();
        
    },
    computed: {
        
    },
    methods: {
        beforeMount() {
        this.getChatDetail();
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        onSelect(options) {
            Toast(options.name);
            this.showShare = false;
        },
        //获取商品详情数据
        getChatDetail() {
            // this.$toast.loading({
            //     message: "加载中……",
            //     forbidClick: true,
            //     duration: 0,
            // });
            this.axios({
                method: "GET",
                url: "/productDetail",
                params: {
                    appkey: this.appkey,
                    pid: this.pid,
                },
            }).then(
                (result) => {
                    this.$toast.clear();
                    // console.log(result.data.result[0]);
                    if (result.data.code == 600) {
                        this.ChatDetail = result.data.result[0];
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        },      
        //查询用户是否收藏该商品
        findLike(){
            let tokenString = localStorage.getItem("token");
            if(!tokenString){
                return;
            }
            this.$toast.loading({
                message: "加载中……",
                forbidClick: true,
                duration: 0,
            });
            //发起查询商品收藏请求
            this.axios({
                method: "GET",
                url: "/findlike",
                params: {
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                },
            })
            .then((result) =>{
                this.Toast.clear();
                if(result.data.code == 1000){
                    if(result.data.result.length >0){
                        this.isLike =true;
                    }
                }
            })
            .catch((err) =>{

            })
        },       
        // 收藏商品
        toggleLikeproduct() {
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                this.$toast("请先登录");
                return this.$router.push({ name: "Login" });
            }
            let url = this.isLike ?'/notlike':'/like'
            this.$toast.loading({
                message: "加载中。。。",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url,
                data: {
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString,
                },
            })
                .then((result) => {
                    this.$toast.clear();
                    console.log(result)
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == "800") {
                        this.isLike =true;
                    }else if(result.data.code ="900"){
                        this.isLike-false;
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                });
        },                     
        //切换规格
        togleRule(item,i){
        },
        //查询用户购物袋数量
        shopBagCount(){
            let tokenString = localStorage.getItem("token");
            if(!tokenString){
                return;
            }
            this.$toast.loading({
                message: "加载中。。。",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "GET",
                url:'/shopcarRows',
                params: {
                    appkey: this.appkey,
                    tokenString,
                },
            })
            .then((result) =>{this.$toast.clear();})
            .catch((err) =>{this.$toast.clear();})
        },         
        // 加入购物袋
        addShopbag(isBuy){
            let tokenString = localStorage.getItem("token");
            if(!tokenString){
                this.$toast('请先登录');
                return this>$router.push({name:'Login'});
            }
            // let rs=[];
            // this.productDetail.rules.map((v) =>{
            //     rs.push(v.rule[v.ruleIndex].title);
            // })
            // data.rule = rs.join('/');

            
            // this.$toast.loading({
            //     message: "加载中。。。",
            //     forbidClick: true,
            //     duration: 0,
            // });

            this.axios({
                method: "POST",
                url:'addShopcart',
                data: {
                    pid: this.pid,
                    count:this.ruleData.count,
                    appkey: this.appkey,
                    rule:this.ruleData.rule.drink+'/'+this.ruleData.rule.sugar,                                      
                    tokenString,
                },
            })
            .then((result) =>{
                console.log(result)
            })
        },
        goshopbag(){
            this.$router.push({name: "Shopbag"})
        },
        goPay(sids){
            this.$router.push({ name: "Pay", query: { sids: "_s1666528538645"} });
        }
    },
        
        
};
</script>

<style lang="less" scoped>
.ShopInfo-box {
    /deep/ .van-stepper--round .van--stepper__plus {
        background-color: #0c34ba !important;
    }

    .Detail-box {
        margin-bottom: 7vw;
        padding: 0 10px;

        //   background-color: black;
        .info-box {
            background-color: #fff;
            position: relative;
            top: -25px;
            padding: 20px;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;

            // 奶茶标题样式
            .priceAndchatName-box {
                .chatName {
                    color: black;
                    font-size: 16px;
                    font-weight: bold;
                }

                .chatEnName {
                    font-size: 12px;
                    margin: 5px 0;
                    color: #a699b3;
                }

                .chatPrice {
                    color: #00adb5;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: right;
                }
            }

            // 奶茶规格样式
            .rule-box {
                margin-top: 20px;
                border-bottom: 1px solid #e0dde2;

                .rule-item {
                    margin-bottom: 15px;

                    .rule-title {
                        width: 60px;
                        color: black;
                        font-size: 14px;
                        line-height: 26px;
                    }

                    .r-item {
                        width: 70px;
                        height: 26px;
                        background-color: #eee;
                        color: black;
                        font-size: 14px;
                        text-align: center;
                        line-height: 27px;
                        background-repeat: 15px;
                        border-radius: 15px;
                        margin-left: 10px;

                        &.active {
                            // background-color: #00adb5;
                            background-color:cornflowerblue;
                            color: #fff;
                        }
                    }
                }
            }

            // 奶茶数量样式
            .c-box {
                border-bottom: 1px solid #e0dde2;
                margin-top: 20px;
                padding-bottom: 20px;

                .select-c {
                    font-size: 15px;
                    color: #000;
                }
            }

            // 奶茶介绍样式
            .desc-box {
                margin: 15px 0;

                .desc-title {
                    font-size: 15px;
                    margin-bottom: 10px;
                    color: #000;
                }

                .desc-text {
                    .context {
                        font-size: 12px;
                        text-indent: 2em;
                        margin-bottom: 8px;
                        white-space: pre-wrap;
                    }
                }
            }
        }
    }
}
</style>