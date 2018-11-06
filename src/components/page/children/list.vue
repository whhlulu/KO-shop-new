<template>
    <div class="guess-like-wrap">
        <div class="hd clearfix">
            <span class="pull-left fl" :class="{active:isClass}">{{conItem.title}}</span>
            <span class="pull-right fr" v-if="!isClass" @click="myLove">换一换</span>
            <span class="pull-right fr" v-else @click="tolink(1)">更多</span>
        </div>
        <div class="item-list-wrap clearfix">
            <div class="item-list fl" v-for="item in data" :key="item.id" @click="tolink(item.id)">
                <img v-lazy="URL + item.pic_url">
                <p class="item-text">{{item.title}}</p>
                <p class="price">￥<span>{{item.price_member || item.price_market}}</span></p>
            </div>
        </div>

        
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import qs from 'qs';
    export default {
        name : 'list',
        data(){
            return {
                isClass:false,
                load:false,
                page:1
            }
        },
        props:{
            conItem:'',
            data:'',
            val:'',
            storeId:''
        },
        mounted() {
            if(this.conItem.title == '搭配套餐推荐'){
                this.isClass = true;
            }
        },
        methods:{
            tolink(index){
                let goodsId = '';
                if(this.val ==1){
                    if(this.$store.state.goods_id){
                        goodsId = this.$store.state.goods_id;
                    }else{
                        goodsId = this.$route.params.id;
                    }
                    this.$router.push({
                        name:'withPackages',
                        params:{
                            package_goods_id:goodsId,
                            store_id:this.storeId
                        }
                    });
                }else if(this.val == 2){
                    this.$router.push({
                        name:'product',
                        params:{
                            id:index,
                            status:1
                        }
                    });
                    window.location.reload();
                }
               
            },
            myLove(){

                let p = ++this.page;
                this.axios.post(
                    this.$httpConfig.guessLove,
                    qs.stringify({page : p}),
                    
                ).then((res) => {
                	if(res.data.status==10001){
                		this.$router.push('/LogIn');
                	}else{
	                    this.$store.state.dataLeave = res.data.data;
	                }
                }).catch((err) => {
                    console.log(err);
                });
            },
        }
    }
</script>
<style lang="less" scoped>
.guess-like-wrap{
        padding:0 .2rem .2rem .2rem;
        border-top:1px solid #f1f1f1;
        .hd{
            height:.9rem;
            line-height:.9rem;
            .pull-left{
                font-size:.28rem;
                color:#e02828;
            }
            .pull-left.active{
                color:#333;
            }
            .pull-right{
                font-size:.24rem;
                color:#666;
            }
        }
        .item-list-wrap{
            .item-list{
                width:2.2rem;
                margin-right:.25rem;
                img{
                    width:100%;
                    height:2.2rem;
                }
                .item-text{
                    font-size:.22rem;
                    line-height:.31rem;
                    color:#727374;
                    height:.6rem;
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    padding-top:.1rem;
                }
                .price{
                    color:#e02828;
                    font-size:.2rem;
                    padding:.1rem 0;
                    span{
                        font-size:.26rem;
                        font-weight:600;
                    }
                }
            }
            .item-list:nth-child(3n){
                margin:0;
            }
        }
    }
</style>