<template>
    <div class="item-wrap clearfix">
        <div class="item-list fl" v-for="item in data" :key="item.id">
            <img v-lazy="URL + item.img" @click="tolink(item)">
            <div class="details">
                <p class="title text-single-hidden">{{item.title}}</p>
                <div class="price-wrap clearfix">
                    <span class="icon"></span>
                    <span class="newPrice fl">￥<em>{{item.price_market}}</em></span>
                    <s class="price fr">￥{{item.price_member}}</s>
                </div>
                <button type="button" class="jion" @click="jion(item)">加入购物车&nbsp;></button>
            </div>

        </div>
    </div>
</template>
<script>
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'saleCon',
        props:{
            data:''
        },
        created(){},
        methods:{
            tolink(item){
                this.$router.push({
                    name:'product',
                    params:{
                        id:item.id,
                        status:1
                    }
                });
            },
            jion(item){
                this.axios.post(this.$httpConfig.addGoodToCart,qs.stringify({
                    goods_id:item.id,
                    goods_num:1,
                    price_new:item.price_market,
                    store_id:item.p_id
                })).then((res) => {
                	if(res.data.status==10001){
		                this.$router.push('/LogIn');
		            }else {
	                	Toast({
	                        message: res.data.msg,
	                        position: 'bottom',
	                        duration: 5000
	                    });
	                    this.$router.push({ path: '/Cart',}); 
	               }
                }).catch((err) => {
                    console.log(err);
                });

            }
        }
    }
</script>
<style lang="less" scoped>
    .item-wrap{
        padding:0 .2rem;
        .item-list{
            width: 3.44rem;
            height: 5.34rem;
            background:#fff;
            margin-right:.2rem;
            margin-bottom:.2rem;
            img{
                width: 100%;
            }
            .details{
                padding:0 .2rem;
                border-top:1px solid #f3f3f3;
                padding-top:.23rem;
                .jion{
                    width: 100%;
                    height: .63rem;
                    background:#de0f2c;
                    font-size:.28rem;
                    color:#fff;
                    border:none;
                    outline:none;
                    margin-top:.1rem;
                    transition: all .2s ease;
                }
                .jion:active{
                    box-shadow: 0 5px 5px #ccc;
                }
                .title{
                    font-size:.26rem;
                    color:#333;
                }
            }
            .price-wrap{
                position:relative;
                margin-top:.15rem;
                height: .36rem;
                padding-left:.55rem;
                .icon{
                    position:absolute;
                    left:0;
                    top:0;
                    width: .57rem;
                    height: .35rem;
                    background:url(../../../../assets/latest-icon.png) no-repeat;
                    background-size:100% 100%;
                }
                .newPrice{
                    font-size:.24rem;
                    color:#e02828;
                    em{
                        font-style:normal;
                        font-size:.3rem;
                        line-height: 100%;
                    }
                }
                .price{
                    font-size:.24rem;
                    color:#bbb;
                }
            }
        }
        .item-list:nth-child(2n){
            margin-right:0;
        }
    }
</style>