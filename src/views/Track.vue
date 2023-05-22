<template>
    <div>
        <van-nav-bar title="个人足迹" left-text="返回" :right-text="!isEdit ? '编辑' : '完成'" left-arrow @click-left="onClickLeft"
            @click-right="onclickRight" />
        <BgBox>
            <div class="sortingTitle">
                <div class="trackAll">足迹</div>
                <div class="delAll" v-if="isEdit" @click="allSelect">清空</div>
            </div>
            <van-empty v-if="trackCount.length==0" description="没有足迹" />
        </BgBox>
        <div class="menu-product">
            <div>
                <div class="clearfix m-pro-item" v-for="(item,index) in trackCount" :key="index">
                    <van-swipe-cell>
                        <div @click="goDetall(item.pid)">
                            <div class="pro-img">
                                <img :src="item.small_img || item.smallImg" class="auto-img" alt="">
                            </div>                        
                        <div class="f1 text">
                            <div class="pro-text">
                                <div class="pro-time">{{item.time}}</div>
                                <div class="pro-name">{{item.name}}</div>
                                <div class="pro-enname">{{item.enname}}</div>
                            </div>
                        </div>
                        <div class="f1 price">{{item.price}}</div>
                    </div>
                    <template #right>
                        <van-button square type="danger" @click="removeOne(index)" text="删除"/>
                    </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BgBox from "../components/BgBox";
export default {
    components: { BgBox },
    data() {
        return {
            isEdit: false,
            track: [],
            isAllChecked: false,
            trackCount: []
        };
    },
    computed: {
        // trackCount() {
        //     return this.$store.footprintData;
        // }
    },
    methods: {

        //全删除
        allSelect() {
            if (this.trackCount.length == 0) {
                this.isEdit = !this.isEdit;
                this.$toast('没有足迹了');
                return
            }
            this.$dislog.confirm({
                title: "清空足迹",
                message: ""
            }).then(() => {
                this.$store.commit('delAllTrack');
                this.isEdit = !this.isEdit;
            }).catch(err => {

            })
        },
        //单个删除
        removeOne(index) {
            this.$store.commit("removeOne", index)
        },
        //编辑
        onclickRight() {
            this.isEdit = !this.isEdit;
        },
        //返回
        onClickLeft() {
            this.$router.go(-1);
        },
        goDetall(pid) {
            this.$router.push({ name: "Detall", params: { pid } })
        },
    }
};
</script>

<style lang="less" scoped>

</style>