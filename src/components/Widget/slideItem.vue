<template>
    <div>
        <div class="dd" v-if="data">
        <ul class="clearfix" :style="{ width : data.length * 2.7+'rem'}">
            <li class="fl" v-for="(item,index) in data" :key="item.id" @click="tolink(index)">
                <div class="data">
                    <span class="timer">{{set}}</span>
                    <span class="state">{{status}}</span>
                </div>
                <img v-lazy="URL + item.pic_url">
                <p class="desi">{{item.title}}</p>
                <p class="price">￥<i class="newPrice">{{item.price_market}}</i><span class="bPrice">/￥<s>{{item.price_member}}</s></span></p>
            </li>
        </ul>
    </div>
    </div>
</template>
<script>
    export default {
        name : 'slideItem',
        props:{
            data:'',
            status:'',
            set:''
        },
        methods:{
            tolink(index){
                this.$router.push({
                    name:'product',
                    params:{
                        id:this.data[index].id,
                        status:1 //1 代表普通商品 2代表积分商品
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    div{
        overflow: hidden;
        height:3.43rem;
	    .dd{
	        width:100%;
	        height:3.43rem;
	        padding-bottom:.2rem;
	        overflow-x:auto;
	        background:#fff;
	        ul{
	            height:100%;
	            li{
	                width:2.5rem;
	                height:3.43rem;
	                background:#fff;
	                border:1px solid #dcdcdc;
	                box-sizing:border-box;
	                -moz-box-sizing:border-box;
	                -webkit-box-sizing:border-box;
	                margin-left:.2rem;
	                position:relative;
	                .desi{
	                    color:#333;
	                    font-size:.28rem;
	                    height:.53rem;
	                    line-height:.53rem;
	                    padding:0 .2rem;
	                    width:2.1rem;
	                    white-space:nowrap; 
	                    overflow:hidden; 
	                    text-overflow:ellipsis;
	                }
	                .price{
	                    font-size:.22rem;
	                    color:#e02828;
	                    padding:0 .2rem;
	                    .newPrice{
	                        font-size:.28rem;
	                        color:#e02828;
	                        font-style: normal;
	                        font-weight:bold;
	                    }
	                    .bPrice{
	                        font-size:.22rem;
	                        color:#a8a8a8;
	                        s{
	                            font-size:.22rem;
	                        }
	                    }
	                }
	                img{
	                    width:100%;
	                    height:2.48rem;
	                }
	                .data{
	                    width:.68rem;
	                    height:.66rem;
	                    background:#f02b2b;
	                    position:absolute;
	                    left:-1px;
	                    top:-1px;
	                    padding:1px;
	                    z-index:2;
	                    span:nth-child(1){
	                        background:#fff;
	                        color:#f02b2b;
	                    }
	                    span{
	                        font-size:.2rem;
	                        display:block;
	                        height:.33rem;
	                        text-align:center;
	                        line-height:.33rem;
	                        color:#fff;
	                    }
	                }
	            }
	        }
    	}
    }
</style>