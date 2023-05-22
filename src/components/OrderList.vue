<template>
    <div class="order-list">
        <div class="pro-box">
            <div class="info-boxs clearfix">
                <div class="info-title fl">{{ infoTitleLeft }}</div>
                <br><br>
                <div class="re-info fl" v-if="isRight">
                    <div class="conf" v-if="!isReceive" @click="confirmReceive">确认收货</div>
                    <div class="clearfix" v-else>
                        <div class="fl">已完成</div>
                        <div class="fl delete" @click="remove">
                            <van-icon name="delete" size="20" />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="cell-list">
                    <!-- 商品信息 -->
                    <slot></slot>
                </div>
                <div class="bottom-into">
                    <div class="circle">
                        <div class="fl circle-box circle-left"></div>
                        <div class="fr circle-box circle-right"></div>
                    </div>
                    <div class="date" v-if="date != ''">{{ date }}</div>
                    <div class="clearfix">

                        <div class="fl " style="display:block;">共计{{ count }}件商品</div>
                        <div class="fl total" style="display:block;">订单金额￥{{ total }}</div>
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>
<script>
export default {
    name: "OrderList",
    props: {
        // 左边标题
        infoTitleLeft: {
            type: String,
            default: "左边标题"
        },
        // 是否显示右边信息
        isRight: {
            type: Boolean,
            default: false,
        },
        // 时间
        date: {
            type: String,
            default: "1970-01-01 00:00:00"
        },
        // 商品数量
        count: {
            type: Number,
            default: 0
        },
        // 订单总金额
        total: {
            type: [Number, String],
            default: 0
        },
        // 确认收货
        isReceive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 确认收货
        confirmReceive() {
            this.$emit('confirm-receive')
        },
        // 删除
        remove() {
            this.$emit('remove')
        }
    }
}
</script>

<style lang="less" scoped>
.info-title {
    font-size: 15px;
    font-weight: 550;
    margin-top: 20px;
}

.re-info {
    margin-top: -13px;
    float: right;
}

.order-list {
    background-color: #fff;
    padding: 10px;
    margin-right: 20px;
    margin-bottom: 6px;
    margin-left: 5px;
    margin-right: 5px;

    // border-radius: 11px;
    .clearfix {
        font-size: 14px;
        // font-weight: bold;

        .total {
            color: rgb(216, 51, 51);
            margin-left: 60%;
            margin-top: -18px;
        }
    }
}
</style>