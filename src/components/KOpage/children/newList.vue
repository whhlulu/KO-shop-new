<template>
    <div>
        <div class="new-all" v-for="(item,index) in newList" :key="item.id">
            <div v-if="item.news_type==1">
                <div class="new">
                    <img v-if="item.video" :src="item.video" class="fl" @click="toDetails(item)">
                    <div class="fl words" :class="{allspan:!item.video}" @click="toDetails(item)">
                        <p class="text">{{item.name}}</p>
                        <p class="clearfix text company">{{item.intro}}</p>
                    </div>
                </div>
                <!--<div class="opt">-->
                <!--<span class="like fl" :class="{active:item.like}" @click="seat()"></span>-->
                <!--</div>-->
            </div>
            <div v-if="item.news_type==2">
                <video class="my-video" src="https://video.sina.cn/news/2018-10-28/detail-ihnaivxp9385722.d.html?vt=4&cid=37766" controls="controls">
                    your browser does not support the video tag
                </video>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'newList',
        data(){
            return {}
        },
        props: ["newList"],
        components: {}
    }
</script>
<style lang="less" scoped>
    .new-all{
        position: relative;
        background: #fff;
        padding: .13rem .2rem;
        margin-bottom: 6px;
        .my-video{
            width: 100%;
        }
        .new {
            height: 1.46rem;
            img {
                width: 1.46rem;
                height: 1.46rem;
            }
            .words.allspan{
                width: 6.8rem;
            }
            .words {
                width: 5.24rem;
                .text {
                    padding: 0 .2rem;
                    font-size: .32rem;
                    color: #333;
                    line-height: .45rem;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .company {
                    font-size: .24rem;
                    line-height: .24rem;
                    color: #B6B4B5;
                    padding-top: .2rem;
                    padding-left: .2rem;
                }
            }
        }
        .opt {
            height: .48rem;
            position: relative;
            .like {
                position: absolute;
                right: .2rem;
                width: .52rem;
                height: .48rem;
                background: url(../../../assets/images/xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
            .like.active {
                background: url(../../../assets/images/xu_xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
        }
    }

</style>
