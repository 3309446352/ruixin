<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-text="返回" left-arrow @click-left="onClickLeft" />
    <BgBox>
      <div class="conf">
        <van-cell title="头像" :center="true">
          <div>
            <div class="user-img fr">
              <img :src="accountInfo.userImg" alt="">
              <van-uploader :after-read="uploadUserImg" class="upload-box" />

            </div>
          </div>
        </van-cell>
        <van-cell title="用户id" :center="true">{{accountInfo.userId}}</van-cell>
        <van-cell title="手机号" :center="true">{{accountInfo.phone}}</van-cell>
        <van-cell title="昵称" :center="true">
          <van-field v-model="accountInfo.nickName" label-width="5" class="field-box" maxlength="12" placeholder="输入昵称"
            @keydown.enter="updateNickName" input-align="right" />
        </van-cell>
        <div class="desc-box">
          <div class="desc-content">
            <van-field v-model="accountInfo.desc" row="2" autosize label="简介" type="textarea" maxlength="30"
              placeholder="输入简介" show-word-limit input-align="right" @change="updateDesc">
            </van-field>
          </div>
        </div>
      </div>
    </BgBox>
  </div>
</template>
<script>

import BgBox from '../components/BgBox'
export default {
  name: "Account",
  components: { BgBox },
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      accountInfo: {
        nickName: '',
        desc: '',
        phone: '',
        userId: '',

        // ,msg:'hello'
      },
    };
  },
  created() {
    this.getAccountInfo();
  },
  methods: {
    //获取个人资料
    getAccountInfo() {
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
        url: '/findAccountInfo',
        params: {
          appkey: this.appkey,
          tokenString
        }
      }).then((result) => {
        this.$toast.clear();
        console.log(result);
        if (result.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (result.data.code == "B001") {
          let data = result.data.result[0];
          if (data.desc == "") {
            data.desc = "这家伙很懒，什么都没留下";
          }
          this.accountInfo = data;
        }
      })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //上传用户图像
    uploadUserImg(file) {
      let type = ["gif", "png", "jpg", "jpeg"];
      let size = 1;

      let filetype = file.file.type.split("/")[1];
      if (type.indexOf(filetype) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
        return;
      }
      let fileSize = file.file.size / 1024 / 1024;

      if (fileSize > size) {
        this.$toast(`文件允许最大不能超过${size}MB`);
        return;
      }
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");

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
        url: '/updateAvatar',
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: filetype,
          serverBase64Img: base64,
        }
      }).then((result) => {
        this.$toast.clear();
        if (result.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (result.data.code == "H001") {
          this.accountInfo.userImg = result.data.userImg;
        }
        this.$toast(result.data.msg);
      }).catch((err) => {
        this.$toast.clear();
      });
    },
    //修改昵称
    updateNickName() {
      if (!this.accountInfo.nickName) {
        this.$toast("昵称不能为空");
      }
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        // 没有token跳回登录页面
        this.$toast("请先登录")
        return this.$router.push({ name: "Login" })
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.accountInfo.nickName
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            // token无效，则跳到登录页面
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg)
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //修改简介
    updateDesc() {
      if (!this.accountInfo.nickname) {
        this.$toast("昵称不能为空");
      }
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        this.$toast("请向登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中……",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: 'POST',
        url: '/updateDesc',
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.accountInfo.desc
        }
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    }
  },
};
</script>

<style lang="less" scoped>
.account {
  /deep/ .van-nav-bar .van-icon {
    color: #1A73E8;
  }

  /deep/ .van-cell {
    padding: 0;
    height: 44px;
  }

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

  .user-img {
    width: 44px;
    height: 44px;
    background-color: #ddd;
    border-radius: 50%;
    overflow: hidden;
    position: relative;

    img {
      width: 44px;
      height: 44px;
    }
  }

  .upload-box {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #000;

    .van-uploader_wrapper {
      height: 100%;
    }

    .van-uploader_upload {
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }

  .field-box {


    .van-filed_control {
      text-align: right;
      color: #969799;
    }
  }

  .desc-content {
    padding: 10px 0;
  }

  /deep/ .van-field_control {
    color: #969799;
  }
}

/* Glassmorphism card effect */
</style>