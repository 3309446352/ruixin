<template>
    <div class="order-item">
        <div class="cell-item-box">
            <div class="pro-info-box">
                <div class="pro-img">
                    <img :src="item.small_img || item.smallImg" class="auto-img" alt="">
                </div>
                <div class="pro-info fl">
                    <div class="pro-info-text">
                        <div class="names clearfix">
                            <div class="pro-name">{{item.name}}</div>
                            <div class="pro-rule">{{item.rule}}</div>
                        </div>
                        <div class="pro-enname">{{item.enname}}</div>
                    </div>
                    <!-- 商品信息 -->
                    <div class="pro-count-box">
                        <div class="pro-price fl">￥{{item.price}}</div>
                        <div class="pro-count">X{{item.count}}</div>
                    </div>

                </div>
            </div>
        </div>
        <br>
    </div>
</template>
<script>
export default {
    name: "OrderItem",
    props: {
        item: {
            type: Object,
            default() {
                return {
                    name: "名称",
                    rule: "规格",
                    enname: "英文名称",
                    prico: 0,
                    count: 1
                };
            }
        }
    }
}
</script>

<style lang="less" scoped>
.auto-img {
    width: 100px;
    height: 100px;
}
.date{
    font-size: 15px;
}
.pro-info-box {
    position: relative;
    
    // background-color: aqua;定符
     &:nth-chlid(2n) {
        margin-right: 0px;
    }

    .icon {
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        // .hot{
        //     position: absolute;
        //     top: 0;
        //     left: 8px;
        //     width: 24px;
        //     height: 24px;
        //     text-align: center;
        //     line-height: 24px;
        //     color: #fff;
        //     background-color: #00adb5;
        //     font-size: 12px;
        //     border-bottom-left-radius: 5px;
        //     border-bottom-right-radius: 5px;
        // }
    }

    .auto-img {
        border-radius: 11px;
        margin-left: -2%;
    }

    .pro-info {
        // margin-left: 11px;
        position: absolute;
        margin-top: -30%;
        margin-left: 30%;

        .pro-name {

            font-size: 18px;

            // margin-bottom: 5px;
        }

        .pro-rule {
            font-size: 16px;
            color: black;
            // margin-left: 20px;
        }

        .pro-enname {
            color: rgb(131, 127, 127);
            font-size: 12px;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .pro-count-box{
            display: flex;
            
            .pro-price {
            color: #b50000;
            font-weight: bold;
            margin-bottom: 1px; 
            
            font-size: 15px;
        }
            .pro-count {
                font-size: 15px;
                margin-left: 190%;
                margin-top: 5%;
            }
        }

    }

    .step-box {
        margin-left: 40px;
        margin-top: 10px;
    }


}
</style>