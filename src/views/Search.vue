<template>
  <div class="search">
    <form action="/">
      <div @click="goHome">
        <van-nav-bar class="top1" left-text="返回" left-arrow>
          <template></template>
        </van-nav-bar>
      </div>
      <van-search class="top" v-model="value" show-action placeholder="请输入搜索关键词" @keydown.enter="Search" />
    </form>
    <!--  商品-->
    <div class="menu-porduct">
      <div class="m-pro-item clearfix" v-for="(item,index) in message" :key="index" @click="goDetall(item.pid)">
        <div>
          <img :src="item.smallImg" alt="" class="pro-img fl" />
        </div>
        <div class="text fl">
          <div class="pro-name">{{item.name}}</div>
          <div class="pro-enname">{{item.enname}}</div>
        </div>
        <div class="price fl">
          ￥{{item.price}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      message: [],
      value: '',
      pid: ''
    };
  },
  methods: {
    Search() {
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.value,
        },
      }).then((res) => {
        console.log("我拿到了数据", res);
        this.message = res.data.result;
      });
    },
    goHome(pid) {
      this.$router.push({ name: "Home" })
    },
    goDetall(pid) {
      this.$router.push({ name: "Detall", params: { pid } })
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  font-size: 20px;

  .top1 {
    width: 30%;
  }

  .top {
    width: 70%;
    position: relative;
    // left: 20%;
    float: right;
    top: -54px;
  }

  .menu-porduct {

    .m-pro-item {
      .pro-img {
        height: 80px;
        width: auto;
        padding: 10px;

      }

      .text {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-top: 30px;

        .pro-name {
          color: black;
          font-size: 16px;
          width: 150px;
        }

        .pro-enname {
          font-size: 16px;
          width: 150px;
          color: black;

        }
      }

      .price {
        width: 80px;
        height: 90px;
        float: right;
        // background-color: aquamarine;
        font-size: 16px;
        color: rgb(36, 76, 239);
        line-height: 90px;
      }
    }
  }
}
</style>