<template>
    <div class="training-content-wrap clearfix">
        <div class="fl dt">
            <h5>{{dataCon1.title}}</h5>
            <div class="status clearfix">
                <span class="img-main fl">
                    <img v-lazy="dataCon1.logoImg">
                </span>
                <em class="fl">线上课</em>
            </div>
            <img v-lazy="dataCon1.dataImg" class="content-img">
        </div>
        <dl class="fl clearfix">
            <dt class="clearfix fl">
                <div class="describe fl">
                    <h4>{{dataCon.dataTitle[0]}}</h4>
                    <p>{{dataCon.dataText[0]}}</p>
                </div>
                <div class="fl img-main">
                    <img v-lazy="dataCon.dataImg[0]">
                </div>
            </dt>
            <dd class="fl" v-for="index in dataCon.dataImg.length-1" :key="index.id">
                <h4>{{dataCon.dataTitle[index]}}</h4>
                <p>{{dataCon.dataText[index]}}</p>
                <img v-lazy="dataCon.dataImg[index]">
            </dd>
        </dl>
    </div>
</template>
<script>
    export default {
        name:'traniningCourse',
        data(){
            return{
                dataCon:{
                    dataImg:[require('@/assets/con7.jpg'),require('@/assets/con8.jpg'),require('@/assets/con9.jpg')],
                    dataTitle:['学习终端套餐','爱股轩书籍','爱股轩书籍'],
                    dataText:['超值套餐','书中自有黄金屋','书中自有黄金屋']
                },
                dataCon1:{
                    title:'郭海培课程',
                    logoImg:require('@/assets/log.jpg'),
                    dataImg:require('@/assets/con6.jpg')
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .training-content-wrap{
        width:100%;
        height:4rem;
        background:#fff;
        .dt{
            width:2.34rem;
            height:100%;
            border-right:1px solid #e8e8e8;
            padding-left:.2rem;
            overflow:hidden;
            .content-img{
                width:2.13rem;
                height:2.86rem;
            }
            h5{
                font-size:.32rem;
                color:#333;
                padding-top:.2rem;
                text-align:left;
            }
            .status{
                width:1.04rem;
                height:.28rem;
                background:#f4514b;
                color:#fff;
                margin-top:.1rem;
                margin-bottom:.15rem;
                .img-main{
                    display:inline-block;
                    width:.29rem;
                    height:.22rem;
                    background:#fff;
                    margin:.03rem;
                    position:relative;
                    img{
                        position:absolute;
                        left:0;
                        top:0;
                        bottom:0;
                        right:0;
                        margin:auto;
                        width:.22rem;
                        height:.16rem;
                    }
                }
                em{
                    font-size:.2rem;
                    line-height:.28rem;
                    font-style:normal;
                }
            }
        }
        dl{
            width:4.93rem;
            dt{
                width:4.945rem;
                height:1.55rem;
                border-bottom:1px solid #e8e8e8;
                text-align:center;
                .img-main{
                    width:2.332rem;
                    text-align:center;
                }
                .describe{
                    width:2.39rem;
                    height:100%;
                    padding-left:.2rem;
                    text-align:left;
                    h4{
                        font-size:.32rem;
                        color:#ff0202;
                        line-height:100%;
                        padding-top:.45rem;
                        font-weight:400;
                        font-family: '微软雅黑';
                    }
                    p{
                        font-size:.24rem;
                        color:#797979;
                        padding-top:.15rem;
                        font-weight:400;
                    }
                }
                img{
                    margin-top:.25rem;
                    width:2.02rem;
                    height:1.03rem;
                }
            }
            dd{
                width:2.46rem;
                height:2.47rem;
                box-sizing:border-box;
                -moz-box-sizing:border-box;
                -webkit-box-sizing:border-box;
                text-align:center;
                h4{
                    font-size:.32rem;
                    color:#f4514b;
                    padding-top:.2rem;
                    padding-bottom:.1rem;
                }
                p{
                    font-size:.24rem;
                    color:#797979;
                    padding-bottom:.05rem;
                }
                img{
                    width:1.4rem;
                    height:1.4rem;
                }
            }
            dd:nth-child(2){
                border-right:1px solid #e8e8e8;
            }
        }
    }
</style>