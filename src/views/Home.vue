<template>
  <div class="home">
    <van-nav-bar left-arrow>
      <template #left>
        <div class="home-nav">
          <div class="t1">{{ Greetings }}</div>
          <div class="t2" @click="goMy">{{ accountInfo }}</div>

        </div>
      </template>
      <template #right>
        <div class="home-search" @click="goSearch">
          <van-search placeholder="请输入搜索关键词" />
        </div>
      </template>
    </van-nav-bar>
    <div class="home-conten">
      <!-- 轮播图 -->
      <div class="banner-box">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img class="auto_img" :src="item.bannerImg" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <!-- 商品 -->
    <div class="product-box">
      <div>
        <!-- 热卖推荐 -->
        <div class="pro-title-box">
          <span class="pro-title">热卖推荐</span>
        </div>
        <!-- 商品信息 -->
        <div class="product clearfix">
          <div class="pro-item fl" v-for="(item, index) in hotProduct" :key="index" @click="goDetall(item.pid)">
            <div class="img-box">
              <img :src="item.smallImg" alt="" class="auto_img">
              <!-- hot标签 -->
              <div class="hot">hot</div>
            </div>
            <div class="pro-info">
              <div class="pro-name one_text">{{ item.name }}</div>
              <div class="pro-enname one_text">{{ item.enname }}</div>
              <div class="pro-price">￥{{ item.price }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>

<script>
import "../assets/less/home.less";
// 默认导出组件
export default {
  // 组件名称
  name: "Home",
  data() {
    return {
      // 动态时间
      Greetings: "",
      // 轮播图数据
      bannerData: [],
      // 热卖推荐
      hotProduct: [],
      //用户数据
      accountInfo: '',
    }
  },

  // 生命周期
  created() {
    this.getDate();//获取时间
    this.getBannerData();//获取轮播图数据
    this.getHotProduct();//获取热卖推荐的商品
    this.getAccountInfo();//查询用户数据
  },
  methods: {
    // 动态获取时间
    created() {
      this.getDate();
    },
    getDate() {
      // 获取当前时间
      let hour = new Date().getHours();
      console.log(hour);
      // 根据时间的不同，制定问候语
      if (hour < 6) {
        this.Greetings = "嘿，凌晨好！"
      } else if (hour < 12) {
        this.Greetings = "嘿，早上好！"
      } else if (hour < 14) {
        this.Greetings = "嘿，中午好！"
      } else if (hour < 18) {
        this.Greetings = "嘿，下午好！"
      } else if (hour < 24) {
        this.Greetings = "嘿，晚上好！"
      }
    },
    //  获取轮播图的数据
    getBannerData() {
      this.$toast.loading({
        message: "加载...",
        forbidClick: true,
        duration: 0,
      });
      // 发起请求
      this.axios({
        // 请求类型
        method: "GET",
        // 请求路径
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      }).then((result) => {
        this.$toast.clear();
        console.log("轮播图的数据", result.data.result);
        if (result.data.code == 300) {
          this.bannerData = result.data.result;
        }
      });
    },
    // 获取热卖推荐的商品
    getHotProduct() {
      this.$toast.loading({
        message: "加载...",
        forbidClick: true,
        duration: 0,
      });
      // 发起请求
      this.axios
        ({
          method: "Get",
          url: "typeProducts",
          params: {
            appkey: this.appkey,
            key: "isHot",
            value: 1,
          }
        }).then((result) => {
          this.$toast.clear();
          console.log("热卖推荐的商品", result.data.result);
          if (result.data.code == 500) {
            this.hotProduct = result.data.result;
          }
        });
    },
    // 商品详情
    goDetall(pid) {
      this.$router.push({ name: "Detall", params: { pid } })
    },
    //搜素跳转
    goSearch() {
      this.$router.push({ name: "Search" })
    },
    //查询用户数据
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
        console.log('查询用户数据', result.data.result[0].nickName);
        this.accountInfo = result.data.result[0].nickName;
      })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    goMy() {
      this.$router.push({ name: "My" })
    }
  },
};
</script>

