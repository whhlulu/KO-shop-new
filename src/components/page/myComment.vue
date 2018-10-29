<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <com-header :text="title"></com-header>
        <ul class="navHd clearfix">
            <li class="fl text-center" :class="{active:status == 0}" @click="addClass(0)">
                <span class="number" v-if="$store.state.my_comment">{{$store.state.my_comment.num.count}}</span>
                <span class="status">发布评论</span>
            </li>
            <li class="fl text-center" :class="{active:status == 1}" @click="addClass(1)">
                <span class="number">{{$store.state.chart_review.length}}</span>
                <span class="status">有图评论</span>
            </li>
        </ul>
        <div class="item-wrap" v-show="status == 0">
            <div class="item-list" v-for="(item,index) in $store.state.my_comment.list" :key="item.id">
                <div class="product clearfix">
                    <img class="fl" :src="URL + item.mainImg">
                    <p class="fl text1-hidden">{{item.title}}</p>
                </div>
                <p class="text text2-hidden">{{item.content}}</p>
                <div class="clearfix img-wrap">
                    <img class="fl" v-for="items in item.imgs" :src="URL + items">
                </div>
                <div class="inf-wrap clearfix">
                    <div class="inf fl">{{new Date(item.create_time * 1000).getFullYear()+'/'+(new Date(item.create_time * 1000).getMilliseconds() + 1)+'/'+new Date(item.create_time * 1000).getDay()}}&nbsp;&nbsp;&nbsp;<span v-for="items in item.attra">{{items.name+':'+items.item}}</span></div>
                    <div class="status fr" v-if="item.status == 3">差评</div>
                    <div class="status fr" v-if="item.status == 2">中评</div>
                    <div class="status fr" v-if="item.status == 1">好评</div>
                </div>
            </div>
        </div>
        <div class="item-wrap" v-show="status == 1">
            <div class="item-list" v-for="(item,index) in $store.state.chart_review" :key="item.id">
                <div class="product clearfix">
                    <img class="fl" :src="URL + item.mainImg">
                    <p class="fl text1-hidden">{{item.title}}</p>
                </div>
                <p class="text text2-hidden">{{item.content}}</p>
                <div class="clearfix img-wrap">
                    <img class="fl" v-for="items in item.imgs" :src="URL + items">
                </div>
                <div class="inf-wrap clearfix">
                    <div class="inf fl">{{new Date(item.create_time * 1000).getFullYear()+'/'+(new Date(item.create_time * 1000).getMilliseconds() + 1)+'/'+new Date(item.create_time * 1000).getDay()}}&nbsp;&nbsp;&nbsp;<span v-for="items in item.attra">{{items.name+':'+items.item}}</span></div>
                    <div class="status fr" v-if="item.status == 3">差评</div>
                    <div class="status fr" v-if="item.status == 2">中评</div>
                    <div class="status fr" v-if="item.status == 1">好评</div>
                </div>
            </div>
        </div>
        <div class="load-wrap" v-show="!$store.state.my_comment" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import comHeader from './children/header';
    export default {
        name : 'myComment',
        data(){
            return {
                title:'我的评论',
                status:0
            }
        },
        methods:{
            myComment(){
                return this.axios({
                            url:API_URL + 'Home/Pcenter/myComment',
                            method:'get',
                            params:{
                                app_user_id:sessionStorage.getItem('user_ID')
                            }
                        });
            },
            chartReview(){
                return this.axios({
                    url:API_URL + 'Home/Pcenter/imgComment',
                    method:'get',
                    params:{
                        app_user_id:sessionStorage.getItem('user_ID')
                    }
                });
            },
            addClass(index){
                this.status = index;
            }
        },
        mounted(){
            this.axios.all([this.myComment(),this.chartReview()]).then(this.axios.spread((myComment,chartReview) => {
                this.$store.commit('my_comment',myComment.data.data);
                this.$store.commit('chart_review',chartReview.data.data);
            })).catch((err) => {
                console.log(err);
            })
        },
        components:{
            comHeader
        }
    }
</script>
<style lang="less" scoped>
    .navHd{
        width: 100%;
        height: 1.2rem;
        background:#fff;
        padding:0 .2rem;
        box-sizing: border-box;
        border-bottom:1px solid #ccc;
        li{
            padding:0 .5rem;
            height: 100%;
            width: 50%;
            box-sizing: border-box;
            span{
                display:block;
                width: 100%;
            }
            .number{
                font-size:.42rem;
                color:#333;
                padding-top:.24rem;
                padding-bottom:.1rem;
                line-height: 100%;
            }
            .status{
                color:#999;
                font-size:.24rem;
            }
        }
        li.active{
            border-bottom:2px solid #e37076;
        }
    }
    .item-wrap{
        padding-top:.2rem;
        .item-list{
            padding:.34rem .2rem;
            box-sizing: border-box;
            min-height: 3rem;
            background:#fff;
            border-bottom:1px solid #ccc;
            .img-wrap{
                padding:.2rem 0;
                img{
                    width: .88rem;
                    height: .88rem;
                    margin-right:.2rem;
                }
            }
            .product{
                img{
                    width: .9rem;
                    height: .9rem;
                }
                p{
                    line-height: .9rem;
                    width: 5rem;
                    padding-left:.33rem;
                    font-size:.2rem;
                    color:#333;
                }
            }
            .text{
                font-size:.24rem;
                color:#333;
                height: .7rem;
                width: 100%;
                line-height: .4rem;
                text-indent: 2em;
            }
            .inf-wrap{
                padding-top:.25rem;
                .inf{
                    font-size:.2rem;
                    color:#999;
                }
                .status{
                    font-size:.2rem;
                    color:#d0111b;
                }
            }
        }
    }
</style>