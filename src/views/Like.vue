<template>
    <div class="Like">
        <van-nav-bar title="收藏" left-text="返回" left-arrow @click-left="onClickLeft" />
        <BgBox>
            <!-- 收藏 -->
            <div class="findLike" v-if="like.length > 0">
                <div class="pro-item fl" v-for="(item,index) in like" :key="index">
                    <div>
                        <div class="img-box" @click="goDetall(item.pid)">
                            <img :src="item.smallImg" alt="" class="auto_img">
                            <!-- hot标签 -->
                            <div class="hot">hot</div>
                        </div>

                        <div class="pro-info">
                            <div class="pro-name one_text">{{item.name}}</div>
                            <div class="pro-enname one_text">{{item.enname}}</div>
                            <div class="pro-price" v-bind="pid">￥{{item.price}}
                                <div>
                                    <van-icon class="icon" name="delete-o" color="#1989fa" size="20px"
                                        @click="deleteLike(item.pid)" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            </div>
            <div v-else>
                <van-empty description="你没有藏品" />
            </div>
        </BgBox>
    </div>
</template>

<script>
import BgBox from '../components/BgBox'
export default {
    components: { BgBox },
    setup() {
        const onClickLeft = () => history.back();
        return {
            onClickLeft,
        };
    },
    data() {
        return {
            like: {},
            pid: ''
        }
    },
    created() {
        this.goLike();
    },
    methods: {
        //查询所有收藏
        goLike() {
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
                url: '/findAllLike',
                params: {
                    appkey: this.appkey,
                    tokenString,

                }
            })
                .then((result) => {
                    this.$toast.clear();
                    console.log(result);
                    this.like = result.data.result;
                })
                .then((err) => {
                    this.$toast.clear();
                })
        },
        goDetall(pid) {
            this.$router.push({ name: "Detall", params: { pid } })
        },
        //删除收藏
        deleteLike(pid) {
            let tokenString = localStorage.getItem("token");
            if (!tokenString) {
                this.$toast("请先登录");
                this.$router.push({ name: "Login" });
                return;
            }
            this.$toast.loading({
                message: "加载中。。。",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: 'POST',
                url: '/notlike',
                data: {
                    appkey: this.appkey,
                    pid,
                    tokenString,
                },
            })
                .then((result) => {
                    this.$toast.clear();
                    this.$router.go(0);
                    console(result);

                    if (result.data.code == 700) {
                        //检查token，正确则跳到登录页面
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == "50000") {
                        this.userInfo = result.data.result[0];
                    }
                })
                .catch((err) => {
                    this.$toast.clear();
                });
        },
    },
}
</script>
<style lang="less" scoped>
.findLike{
    .pro-item {
    width: 145px; //计算途径
    // background-color: #fff;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 11px;
    border-radius: 11px;
    margin-top:-11%;

    // 定符
    &:nth-chlid(2n) {
        margin-right: 0px;
    }

    .img-box {
        border-radius: 8px;
        overflow: hidden;
        position: relative;

        .hot {
            position: absolute;
            top: 0;
            left: 8px;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            color: #fff;
            background-color: #00adb5;
            font-size: 12px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }

    .pro-info {
        margin-top: 10px;

        .pro-name {
            font-size: 18px;
            margin-bottom: 5px;
        }

        .pro-enname {
            color: #999;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .pro-price {
            color: #00adb5;
            font-weight: bold;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
        }
    }

}
}

</style>