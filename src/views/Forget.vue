<template>
    <div class="toForget">
        <div class="User">
            <div><img src="../assets/images/home_active.png" alt="" /></div>
            <div class="Username">Luckin Coffee</div>
            <div class="Home" @click="goDetall">首页</div>
            <!--  -->
            <div>
                <div class="welcome">忘记密码!</div>
                <br /><br />
                <div class="text">forget password</div>
            </div>
        </div>

        <!-- 输入框 -->
        <div>
            <van-field v-model="phone" name="手机号" label="手机号" placeholder="手机号" :rules="[{ required: true, message: '请填写手机号' }]" />
            <van-field v-model="password" type="password" name="新密码" label="新密码" placeholder="新密码" :rules="[{ required: true, message: '请填写新密码' }]" />
            <van-field v-model="email" type="email" name="邮箱" label="邮箱" placeholder="邮箱" :rules="[{ required: true, message: '请填写邮箱' }]" />
            <van-field center clearable label="邮箱验证码" placeholder="请输入验证码">
            <template #button>
                <van-button size="small" type="primary" color="rgb(32, 77, 238)" @click="getValidCode()">{{text}}
                </van-button>
            </template>
            </van-field>
            <br>
            <div style="font-size: 12px;float:right;" @click="toForget">已有账号?立即登录</div>
            <br>
            <div style="margin: 16px">
                <van-button round block type="info" native-type="submit" color="rgb(32, 77, 238)">提交</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import{validForm} from "@/assets/validForm"
export default {
    name: "goDetall",
    data() {
        return {
            password: '',
            phone: '',
            email: '',
            code:'',
            isSend:false,
            text:"发送验证码"
        }
    },
    methods: {
        goDetall() {
            this.$router.go(-1)
        },
        toForget() {
            this.$router.push({
                name: "Login",
            });
        },
        next(){
            let o ={
                email :{
                    value:this.email,
                    errormsg:"邮箱格式不正确",
                    reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                },
                code:{
                    value:this.email,
                    erroeMsg:"验证码不正确",
                    reg:/^[A-Za-z\d]{6}$/,
                }
            };
            let isPass =validForm.valid(o);
            if(isPass){
                this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/checkValidCode",
                data: {
                    appkey: this.appkey,
                    email:this.email,
                },
            })
            .then((result) =>{
                this.$toast.clear();
                this.$toast(result.data.msg);
                if(result.data.msg);

                if(result.data.code="k001"){
                    this.isNext = true;
                }
            })
            .catch((err) =>{
                this.$toast.clear();
            })
            }
        },
        //发送邮箱验证码
        getValidCode() {
            let o ={
                email :{
                    value:this.email,
                    errormsg:"邮箱格式不正确",
                    reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                },
            };
            let isPass =validForm.valid(o);

            if(!isPass){
                return this.$toast("当我瞎呀，没有邮箱");;
            }

            let time = 60;

            this.isSend =true;

            this.text = `${time}秒后重新发送`;

            let timer =setInterval(() => {
                if(time <= 0){
                    clearInterval(timer);
                    timer =null;
                    time = 60;
                    this.isSend = false;
                }else{
                    time--;
                    this.text= `${time}秒后重新发送`;
                };
            },1000);
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });
            this.axios({
                method: "POST",
                url: "/emailValidCode",
                data: {
                    appkey: this.appkey,
                    email:this.email,
                },
            })
            .then((result) =>{
                this.$toast.clear();
                this.$toast(result.data.msg);
                console.log(result);   
            })
            .catch((err) =>{
                this.$toast.clear();
            })
            
        }
    }
}
</script>

<style lang="less" scoped>
.Username {
    width: 50%;
    position: relative;

    top: -40px;
    left: 70px;
    font-size: 15px;
    font-weight: bold;
}

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