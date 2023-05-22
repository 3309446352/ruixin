<template>
  <div class="shopbag">
    <van-nav-bar title="购物车" left-text="返回" left-arrow fixed @click-left="back" @click-right="isEdit = !isEdit">
      <template #right>
        <div class="shouye" v-if="shopbagData.length > 0">
          <span>{{ isEdit ? "完成" : "编辑" }}</span>
        </div>
      </template>
    </van-nav-bar>
    <div class="icon">
      <img src="../assets/images/shopbag_bg.png" alt="" />
    </div>
    <br /><br /><br /><br />
    <div v-if="shopbagData.length == 0">
      <van-empty description="购物车空空如也，去逛逛">
        <van-button round color="#1A73E8" class="bottom-button" @click="getMain()">
          逛一逛
        </van-button>
      </van-empty>
    </div>
    <div class="shopbag-box" v-else>
      <div class="shopbag-bg">
        <!-- 懒加载组件 -->
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadData" offset="20">
          <div class="shopbag-product">
            <div class="shopbag-item" v-for="(item, index) in shopbagData" :key="item.sid">
              <div class="cell-item">
                <van-swipe-cell :disabled="isEdit">

                  <div class="clearfix cell-item-box">
                    <div class="check-box fl">
                      <van-checkbox @change="simpleSelect" v-model="item.isChecked" checked-color="#1A73E8" />
                    </div>
                    <div class="fl pro-info-box">
                      <div class="fl pro-img">
                        <img class="auto-img" :src="item.small_img" alt="" />
                      </div>
                      <div class="fl pro-info">
                        <div class="pro-info-text">
                          <div class="names clearfix">
                            <div class="fl pro-name">{{ item.name }}</div>
                            <div class="fl pro-rule">{{ item.rule }}</div>
                          </div>
                          <div class="pro-enname">{{ item.enname }}</div>
                        </div>
                        <div class="pro-count-box">
                          <div class="pro-price fl">￥{{ item.price }}</div>
                          <div class="step-box fr">
                            <van-stepper v-model="item.count" theme="round" button-size="20" disable-input
                              @change="changCount(item)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <template #right>
                    <van-button square type="danger" text="删除" @click="removeOne(index, item.sid)"
                      class="delete-button" />
                  </template>
                </van-swipe-cell>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <!-- <div class="shopbag-submit"> -->
      <van-submit-bar v-if="!isEdit" :price="total" button-text="提交订单" button-color="#1A73E8" @submit="commit">
        <van-checkbox v-model="isAllChecked" @click="allSelect">
          全选
        </van-checkbox>
      </van-submit-bar>
      
      <van-submit-bar v-else button-text="删除选择" button-color="#EE0A24" @submit="removeSelected">
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          style="width:auto;height:50px; position: relative; right:177px;">
          全选
        </van-checkbox>
      </van-submit-bar>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "Shopbag",
  data() {
    return {
      isCheck: false,
      count: 2,
      isAllChecked: false,

      // 触发加载
      loading: true,
      // 是否全部加载完成数据
      finished: false,
      // 是否处于编辑状态
      isEdit: false,
      // 所有购物车数据
      allShopbagData: [],
      // 每次触发底部加载截取8条数据
      dataCount: 8,
      // 开始截取购物车数据位置
      startIndex: 0,
      // 购物车的数据
      shopbagData: [],
      // 订单总金额
      total: 0,
    };
  },
  created() {
    this.getShopbagData();
  },
  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },
    getMain() {
      return this.$router.push({ name: "Menu" });
    },
    // 获取购物车数据
    getShopbagData() {
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        // 没有token跳回登录页面
        this.$toast("请先登录");
        this.$router.push({ name: "Login" });
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log(result.data.result);
          // this.shopbagData = result.data.result;
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isChecked = false;
            });
            this.allShopbagData = result.data.result;
            //   根据开始截取位置和截取数据数量设置购物车显示的数据
            this.shopbagData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );
            this.startIndex += this.dataCount;
            // 未加载
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 懒加载购物车数据
    loadData() {
      setTimeout(() => {
        // 在allShopbagData中截取数据
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;
        this.shopbagData.push(...data);

        this.isAllChecked = false;
        // 如果当前截取数据不足8条数据，下次不可能截取数据
        if (data.length < this.dataCount) {
          this.finished = true;
        } else {
          // 每次触发onload事件都需要将修改
          this.loading = false;
        }
      }, 1500);
    },
    // 全选
    allSelect() {
      this.shopbagData.map((v) => {
        v.isChecked = this.isAllChecked;
      });
      this.sum();
    },
    // 单选
    simpleSelect() {
      this.sum();
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }
      this.isAllChecked = true;
    },
    // 单个删除
    removeOne(index, sid) {
      // index:this.shopbagData 数组元素的下标
      // sid:购物车
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        // 没有token跳回登录页面
        this.$toast("请先登录");
        this.$router.push({ name: "Login" });
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
          location.reload();
          this.$toast.caller();         
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 如果删除成功，则移除页面的商品，重新计算订单金额
            this.shopbagData.splice(index, 1);
            this.sum();
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 判断是否勾选商品
    isSelectProduct(msg) {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          // 如果存在勾选商品
          return true;
        }
      }
      return false;
    },

    // 删除选择
    removeSelected() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择删除的商品");
        return;
      }
      // sids:勾选商品的购物车sid的集合
      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });
      // 获取token
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        // 没有token跳回登录页面
        this.$toast("请先登录");
        this.$router.push({ name: "Login" });
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 如果删除称号，则移除页面的商品，重新计算订单金额
            // 移除页面数据
            for (let i = 0; i < this.shopbagData.length; i++) {
              if (this.shopbagData[i].isChecked) {
                this.shopbagData.splice(i, 1);
                i--;
              }
            }
            this.sum();
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 修改数量
    changCount(item) {
      // sid:购物车sid
      // count：商品数量
      let tokenString = localStorage.getItem("token");

      if (!tokenString) {
        // 没有token跳回登录页面
        this.$toast("请先登录");
        this.$router.push({ name: "Login" });
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            if (item.isChecked) {
              this.sum;
            }
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 计算订单数据
    sum() {
      this.total = 0;
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      });
      this.total *= 100;
    },
    // 提交订单，跳转到订单页
    commit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择购买的商品");
        return;
      }
      // sids：勾选商品的购物车sid集合
      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });
      // 跳转到结算页面sids查询参数
      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },
  },
};
</script>
<style lang="less" scoped>
.shopbag {
    position: relative;

    // top: -350px;
    .icon {

        position: relative;
        top: 50px;

        img {
            width: 100%;
        }
    }

    .shopbag-box {
        padding: 2px;
        padding-bottom: 50px;

        .shopbag-bg {
            .shopbag-product {
                .cell-item {
                    width: 95%;
                    height: 30%;
                    // border: 1px solid #000;
                    // background-color: rgb(255, 255, 255);
                    background-color: aqua;
                    border-radius: 10px;
                    margin: 0 10px 10px 10px;
                    
                    .check-box {
                        width: 20px;
                        height: 20px;
                        // border: 1px solid #000;
                        position: relative;
                        top: 30px;
                        margin: 5px;
                    }

                    .pro-info-box {
                        .pro-img {
                            margin: 5px;

                            .auto-img {
                                width: 80px;
                                height: 80px;
                            }
                        }

                        .pro-info {
                            width: 220px;
                            height: 75px;
                            // border: 1px solid #000;
                            margin: 8px 0 0 2px ;
                            .names {
                                .pro-name {
                                    width: 90px;
                                    height: 20px;
                                    // border: 1px solid #000;
                                }
                            }
                            .pro-enname{
                                width: auto;
                                height: 15px;
                                // border: 1px solid #000;
                                margin: 0 0 10px 0;
                                display: -webkit-box;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                -webkit-line-clamp: 1;
                                -webkit-box-orient: vertical;
                            }
                            .pro-count-box{
                                .pro-price {
                                    width: 50px;
                                    height: 20px;
                                    // border: 1px solid #000;
                                    color: rgb(247, 7, 7);
                                    font-weight: bold;
                                    font-size: 15px;
                                    
                                }
                            }
                        }
                    }
                    .delete-button{
                        // width: 60px;
                        height: 100%;
                        // border: 1px solid #000;
                        // position: relative; 
                        // right:100px;
                    }
                }
            }
        }

        .van-submit-bar {
            // width: 100%;
            // height: 8%;
            // top: 85%;
            // position: fixed;
            // z-index: 40;
            margin-bottom: 50px;
        }
    }
}
</style>