<template>
    <div class="address">
        <van-nav-bar title="地址" left-text="返回" fixed left-arrow @click-left="back" />
        <BgBox>
            <van-address-list :list="list" default-tag-text="默认" :switchable="false" @add="add" @edit="edit" />
            <div v-if="list.length > 0">

            </div>
            <div v-else>
                <van-empty description="没有地址数据" />
            </div>
        </BgBox>

    </div>
</template>
<script>
import BgBox from "../components/BgBox.vue"
export default {
    name: "Address",
    components: {
        BgBox
    },
    data() {
        return {
            chosenAddressId: "",
            list: []
        }
    },
    created() {
        this.getAddressData();
    },
    methods: {
        // 返回上一级
        back() {
            this.$router.go(-1);
        },
        // Box(){
        //     this.$router.push({name:"NewAddress"})
        // },
        // 获取地址列表数据
        getAddressData() {
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
                method: "GET",
                url: "/findAddress",
                params: {
                    appkey: this.appkey,
                    tokenString,
                }
            }).then((result) => {
                this.$toast.clear();
                if (result.data.code == 700) {
                    // token无效，则跳到登录页面
                    this.$router.push({ name: "Login" });
                } else if (result.data.code == 20000) {
                    result.data.result.map(v => {
                        v.isDefault = Boolean(v.isDefault);
                        v.id = v.aid;
                        v.address = `${v.province}${v.city}${v.county}${v.addressDetall}`
                    })
                    this.list = result.data.result;
                }
            })
                .catch((err) => {
                    this.$toast.clear()
                })
        },
        // 新增地址
        add() {
            this.$router.push({ name: "NewAddress" });
        },
        // 编辑地址
        edit(item) {
            this.$router.push({ name: "NewAddress", query: { aid: item.aid } });
        }
    }
}
</script>