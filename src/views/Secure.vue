<template>
    <div class="">
        <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="onClickLeft" />
        <BgBox>
            <div class="conf">
                <van-cell>
                    <van-cell is-link @click="showPopup">修改密码</van-cell>
                    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
                        <van-form class="Signup">
                            <p>修改密码</p>
                            <van-field v-model="oldPassword" type="OldPassword" name="password" label="旧密码"
                                placeholder="旧密码(6-16)位" :rules="[{ required: true, message: '旧请填写密码' }]" />
                            <van-field v-model="Password" type="Password" name="password" label="新密码"
                                placeholder="密码(6-16)位" :rules="[{ required: true, message: '请新填写密码' }]" />
                            <div class="SignupT" @click="updatePassword">确认修改</div>
                        </van-form>
                    </van-popup>
                </van-cell>
                <!-- 注销账号 -->
                <van-cell>
                    <van-cell is-link @click="showPopupt">注销账号</van-cell>

                </van-cell>
                <br><br><br>
                <div style="margin: 16px;bottom: 0%;">
                    <van-button round block color="rgb(13, 0, 255)" type="info" native-type="submit" @click="tologin">
                        退出登录</van-button>
                </div>
            </div>
        </BgBox>
    </div>
</template>

<script>
import { validForm } from '@/assets/validForm';
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
            show: false,
            showt: false,
            oldPassword: '',
            Password: '',
        }
    },
    methods: {
        showPopup() {
            this.show = true;
        },
        showPopupt() {
            this.$dialog.confirm({
                title: "注销账号",
                message: "是否确认注销账号,一旦确认无法恢复",
            })
                .then(() => {
                    this.godestroyAccount();
                }).catch(err => { });
        },

        //修改密码
        updatePassword() {
            let o = {
                phone: {
                    value: this.oldpassword, //传递的一个值
                    errorMsg: 'j旧密码由数字字母下划线组合(6-16字符)', //就是不符合规则是弹出的信息
                    reg: /^[A-ZA-z]\w{5,15}$/ //正则
                },
                password: {
                    value: this.password,
                    errorMsg: '密码由数字字母下划线组合(6-16字符)',
                    reg: /^[A-ZA-z]\w{5,15}$/
                },
            };
            let isPass = validForm.valid(o);
            if (isPass) {                
                if(this.oldPassword == this.Password){
                    this.$toast("新密码和旧密码不能相同");
                    return;
                }
                
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
                    url: '/updatePassword',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        password: this.Password,
                        oldPassword: this.oldPassword
                    }
                })
                    .then((result) => {
                        this.$toast(result.data.msg);
                        
                    })
                    .catch((err) => {
                        this.$toast.clear();
                    })
            }
        },
        //注销账号
        godestroyAccount() {
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
                url: '/destroyAccount',
                params: {
                    appkey: this.appkey,
                    tokenString,
                }
            })
                .then((result) => {
                    this.$toast.clear();
                    localStorage.removeItem("token");
                    return this.$router.push({ name: "Login" });
                    console.log(result);
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        },
        tologin() {
            this.$dialog.confirm({
                title: "退出登录",
                message: "是否确认退出登录",
            })
                .then(() => {
                    this.gologout();
                }).catch(err => { });
        },
        //退出登录
        gologout() {
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
                url: '/logout',
                params: {
                    appkey: this.appkey,
                    tokenString,
                }
            })
                .then((result) => {
                    this.$toast.clear();
                    this.$router.push({ name: "Login" });
                    if (result.data.code == 700) {
                        this.$router.push({ name: "Login" });
                    } else if (result.data.code == "G001") {
                        setTimeout(() => {
                            localStorage.removeItem("token");
                            this.$router.push({ name: "Login" });
                        }, 800)
                    }
                    console.log(result);
                })
                .catch((err) => {
                    this.$toast.clear();
                })
        }
    },

}
</script>

<style lang="less" scoped>
.conf {
    background-color: rgb(247, 247, 247);
    padding: 3px;
    margin-right: 20px;
    margin-top: -34px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 11px;
    border-radius: 20px;
}

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

.b1 {
    width: 50%;
    border: none;
    color: rgb(0, 106, 255);
    position: relative;
    font-size: 16px;
    background-color: #fff;
}

.b2 {
    width: 50%;
    border: none;
    // color: rgb(0, 106, 255);
    position: relative;
    font-size: 16px;
    background-color: #fff;
}
</style>