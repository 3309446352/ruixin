<template>
    <div class="Login">
        <div class="User">
            <div><img src="../assets/images/home_active.png" alt="" /></div>
            <div class="Username">Luckin Coffee</div>
            <div class="Home" @click="goDetall">首页</div>
            <!--  -->
            <div>
                <div class="welcome">欢迎回来</div>
                <br /><br />
                <div class="text">Please login to your accounts</div>
            </div>
        </div>
        <!-- 登录框 -->
        <div>

            <van-field v-model="phone" name="手机号" label="手机号" placeholder="手机号:"
                :rules="[{ required: true, message: '请填写手机号' }]" />
            <van-field v-model="password" type="password" name="密码" label="密码:" placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]" />
            <div style="font-size: 15px;float:right;" @click="toForget">忘记密码?</div>
            <div style="margin: 16px">
                <van-button round block type="info" native-type="submit" @click="Login">登录</van-button>
            </div>

            <div>
                <br /><br />
                <!-- 弹出框 -->
                <div class="Signup">
                    <div is-link @click="showPopup">注册</div>
                    <van-popup v-model="show" closeable close-icon-position="top-right" position="bottom"
                        :style="{ height: '50%' }">
                        <van-form>
                            <p>注册</p>
                            <van-field v-model="phone" name="phone" label="手机号" placeholder="手机号"
                                :rules="[{ required: true, message: '请填写手机号' }]" />
                            <van-field v-model="password" type="password" name="password" label="密码"
                                placeholder="密码(6-16)位" :rules="[{ required: true, message: '请填写密码' }]" />
                            <van-field v-model="nickname" type="nickname" name="nickname" label="昵称"
                                placeholder="请填写昵称(1-10)位" :rules="[{ required: true, message: '请填写昵称' }]" />
                            <br />
                            <div class="SignupT" @click="goSignup">注册</div>
                        </van-form>
                    </van-popup>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    export default {
        name: "Login",
        data() {
            return {
                phone: "",
                nickname: "",
                password: "",
                show: false,
                token: "",
            };
        },
        methods: {
            //忘记密码
            toForget() {
                this.$router.push({
                    name: "Forget",
                });
            },

            showPopup() {
                this.show = true;
            },
            goDetall() {
                this.$router.push({
                    name: "Home",
                });
            },
            //登录
            Login() {
                let o = {
                    phone: {
                        value: this.phone, //传递的一个值
                        errorMsg: '手机号格式不正确', //就是不符合规则是弹出的信息
                        reg: /^1[3-9]\d{9}$/ //正则
                    },
                    password: {
                        value: this.password,
                        errorMsg: '密码由数字字母下划线组合(6-16字符)',
                        reg: /^[A-Za-z]\w{5,15}$/
                    },
                };
                this.axios({
                        method: "post",
                        url: "/login",
                        data: {
                            appkey: this.appkey,
                            password: this.password,
                            phone: this.phone,
                        },
                    })
                    .then((res) => {
                        if (res.data.code == 200) {
                            this.$toast('登录成功')
                            // 加密字符串
                            localStorage.setItem('token', res.data.token)
                            // 可以跳转到首页
                            this.$router.push({ name:"My"});
                            console.log("token", token);
                        } else if (res.data.code == 202) {
                            this.$toast('账号密码不正确');
                        }
                    })
                    .catch((err) => {
                        this.$toast.clear();
                    });
            },
            //注册
            goSignup() {
                this.axios({
                        url: "/register",
                        method: "POST",
                        data: {
                            appkey: this.appkey,
                            nickname: this.nickname,
                            password: this.password,
                            phone: this.phone,
                        },
                    })
                    .then((res) => {
                        console.log("我拿到的数据：", res.data.msg);
                        this.$toast(res.data.msg);
                        if (res.data.code == 200) {
                            this.$toast('登录成功')
                        } else if (res.data.code == 202) {
                            this.$toast('账号密码不正确')
                        }
                    })
                    .catch((err) => {
                        console.log("没拿到数据", err);
                    });
            },
        },
    };
</script>
<style lang="less" scoped>
    // .Username {
    //     width: 50%;
    //     position: relative;

    //     top: -40px;
    //     left: 70px;
    //     font-size: 15px;
    //     font-weight: bold;
    // }

    .Home {
        position: relative;
        top: -60px;
        left: 85%;
        width: 40px;
        height: 20px;
        font-size: 15px;
        color: rgb(36, 36, 235);
        //   font-weight: bold;
    }

    .welcome {
        font-size: 25px;

    }

    .text {
        font-size: 20px;

        color: rgb(168, 173, 178);
    }

    // .login {
    //   color: rgb(168, 173, 178);
    //   font-size: 15px;
    // }

    .Signup {
        width: 90%;
        height: 40px;
        border-radius: 15px;
        background-color: white;
        color: rgb(54, 52, 52);
        font-size: 15px;
        text-align: center;
        margin: 0 auto;
        background-color: white;

        line-height: 40px;

        p {
            float: left;
            font-size: 25px;
        }

        .SignupT {
            width: 12%;
            height: 40px;
            background-color: rgb(32, 77, 238);
            border-radius: 19px;
            width: 90%;
            color: white;
            margin: 0 auto;
        }
    }
</style>