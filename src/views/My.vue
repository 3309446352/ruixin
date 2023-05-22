<template>
    <div class="my">
        <div class="my-bg" v-if="userInfo.userBg" :style="{ backgroundImage: `url('${userInfo.userBg}')` }">
            <van-uploader class="upload-box" :after-read="uploadBg" style="width:100%;height:200px;color: aqua;">
            </van-uploader>
        </div>
        <div class="my-info">
            <div class="clearfix">
                <div class="my-img fl">
                    <!-- 用户头像 -->
                    <img :src="userInfo.userImg" v-if="userInfo.userBg" alt="" class="auto-img" />
                </div>
                <div class="my-info-box fl">
                    <div class="user-name">{{ userInfo.nickName }}</div>
                    <div class="user-desc">{{ userInfo.desc == '' ? "这个家伙很懒什么都没留下" : userInfo.desc }}</div>
                </div>
            </div>
        </div>
        <div class="list-box">
            <van-cell v-for="(item, index) in listData" :key="index" :title="item.title" is-link
                @click="goPage(item.name)" />
         
        </div>
        <van-button type="warning" round block class="logout" @click="logout">退出登录</van-button>
    </div>
</template>

<script>
export default {
    name: 'My',
    data() {
        return {
            listData:
            [
                { title: '个人资料', name: 'Account', },
                { title: '我的订单', name: 'Order', },
                { title: '我的收藏', name: 'Like', },
                { title: '我的足迹', name: 'Track', },
                { title: '地址管理', name: 'Address', },
                { title: '安全中心', name: 'Secure', },
            ],
            userInfo: {}
        };
    },
    created() {
        this.getUserInfo();
        this.$router.push({path:"/My"})
    },
    methods: {
        //获取个人资料
        getUserInfo() {
            let tokenString = localStorage.getItem('token');
            if (!tokenString) {
                this.$toast("请先登录");
                this.$router.push({ name: "Login" });
                return
            }
            this.$toast.loading({
                message: "加载中……",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: 'GET',
                url: '/findMy',
                params: {
                    appkey: this.appkey,
                    tokenString
                }
            }).then((result) => {
                this.$toast.clear();
                // console.log(result);
                if (result.data.code == 700) {
                    this.$router.push({ name: "Login" });
                } else if (result.data.code == "A001") {
                    this.userInfo = result.data.result[0];
                }
            })
                .catch((err) => {
                    this.$toast.clear();
                });
        },
        //跳转页面
        uploadBg(file) {
            let type = ["gif", "png", "jpg", "jpeg"];
            let size = 1;
            let filetype = file.file.type.split("/")[1];
            if (type.indexOf(filetype) === -1) {
                this.$toast(`文件类型只支持${type.join(",")}`);
                return;
            }
            let fileSize = file.file.size / 2048 / 2048;

            if (fileSize > size) {
                this.$toast(`文件允许最大不能超过${size}MB`);
                return;
            }
            let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');

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
                method: 'POST',
                url: '/updateUserBg',
                data: {
                    appkey: this.appkey,
                    tokenString,
                    imgType: filetype,
                    serverBase64Img: base64,
                }
            }).then((result) => {
                this.$toast.clear();
                if (result.data.code == 700) { this.$router.push({ name: "Login" }); }
                else if (result.data.code == "I001") {
                    this.userInfo.userBg = result.data.userBg;
                }
                this.$toast(result.data.msg)
            }).catch((err) => {
                this.$toast.clear();
            });
        },
        goPage(name) {
            this.$router.push({ name });
        }
    },
}
</script>

<style lang="less">
.my {
    .my-bg {
        height: 180px;
        background-color: #fff;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
    }

    .upload-box {
        opacity: 0;
        position: absoulte;
        width: 100%;
        // height: 100%;
        left: 0;
        top: 0;

        .van-uploader_wrapper {
            height: 100%;
        }

        .van-uploader_upload {
            width: 100%;
            height: 100%;
            margin: 0;
        }
    }

    .my-info {
        margin: 0 10px;
        position: relative;
        top: -40px;
        padding: 10px 10px 0 10px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        background-image: linear-gradient(to bottom rgba(255, 255, 255, .65)0, rgba(255, 255, 255, 1)90px, #fff 90px#fff 100%);
    }

    .my-img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #ddd;
        margin-right: 20px;

        img {
            width: 70px;
            height: 70px;
        }
    }

    .my-info-box {
        // width: calc("~100% - 90px");
        height: 70px;
    }

    .user-name {
        color: aqua;
        height: 30px;
        font-weight: bold;
    }

    .user-desc {
        font-size: 14px;
        color: #999;
        height: 40px;
        display: -webkit-box;
        -webkit-line-clamp: 2; //
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    // .list-box{
    //     margin-top: 2px;
    // }
    /deep/.van-cell {
        border-bottom: 1px solid #F5F6F7;
        padding: 15px 0;

        &:last-child {
            border-bottom: none;
        }

        &:active {
            background-color: transparent;
        }

        span {
            color: #646566;
        }
    }


}
</style>