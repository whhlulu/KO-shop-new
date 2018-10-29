<template>
	<div>
		<header-co :text="title"></header-co>
		<mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in datas" :key="item.id">
                <img :src="item">
            </mt-swipe-item>
        </mt-swipe>
        <div class="introduce">
        	<p class="l big">玉萌色和田玉碧玉吊坠金镶玉平安扣吊坠18K金镶碧玉玉坠玉石挂件</p>
        	<!--<p class="l share"> 
	        	<span class="pic"><img src="../../assets/images/Share.png"/></span>
	        	<span class="font">分享</span>
        	</p>-->
        	<p class="chase l">  抢购剩余时间：
        		<span>365</span>天<span>12</span>小时<span>50</span>分钟<span>23</span>秒
        	</p>
        	<p class="money l"><span>￥</span>2980.00</p>
        </div>
        <div class="choose">
        	<div class="promote">
        		<p class="top">
        			<span class="l text">促销</span>
        			<span class="l"><img src="../../assets/manzeng.png"/></span>
        			<span class="l">购买￥200.00，赠精美包装礼盒</span>
        		</p>
        		<p class="bottom">
        			<span class="l"><img src="../../assets/manjain.png"/></span>
        			<span class="l">单笔订单满￥88.00.立减￥20.00</span>
        		</p>
        	</div>
        	<div class="already">
        		<p><span class="one">已选</span><span class="two">颜色：白玉，数量1</span><span class="r el-icon-arrow-right three"></span></p>
        	</div>
        </div>
        <div class="shop">
        	<div class="tops">
        		<p class="l boxs"><img src="../../assets/shopLogo.png"/></p>
        		<p class="l">
        			<span class="title">和田缘分店</span>
        			<span class="people">玉缘结人 ，以玉结缘</span>
        		</p>
        	</div>
        	<div class="middle">
        		<ul>
        			<li class="l">
        				<span class="number">10</span>
        				<span class="numbers">全部宝贝</span>
        			</li>
        			<li class="l">
        				<span class="number">6523</span>
        				<span class="numbers">关注人数</span>
        			</li>
        			<li class="l" style="border: 0;">
        				<p class="cate">
        					<span class="desc">描述相符</span>
        					<span class="color">4.80</span>
        				</p>
        				<p class="cate">
        					<span class="desc">描述相符</span>
        					<span class="color">4.80</span>
        				</p>
        				<p class="cate">
        					<span class="desc">描述相符</span>
        					<span class="color">4.80</span>
        				</p>
        			</li>
        		</ul>
        	</div>
        	<div class="bottom">
        		<p class="l chat">查看分类</p>
        		<p class="l enter">进店逛逛</p>
        	</div>
        </div>
        <div class="lunch">
        	<div class="bott">
        		<p class="l lefts">搭配套餐推荐</p>
        		<p class="r rights">></p>
        	</div>
        	<div class="box">
        		<dl v-for="(item,index) in hello" class="l" :key="index">
        			<dt><img :src="item.img"/></dt>
        			<dd>
        				<span class="hello">{{item.text}}</span>
        				<span class="price">{{item.price}}</span>
        			</dd>
        		</dl>
        	</div>
        </div>
        <div class="lunchs">
        	<div class="bott">
        		<p class="l lefts">猜你喜欢</p>
        		<p class="r rights">换一批</p>
        	</div>
        	<div class="box">
        		<dl v-for="(item,index) in hello" class="l" :key="index">
        			<dt><img :src="item.img"/></dt>
        			<dd>
        				<span class="hello">{{item.text}}</span>
        				<span class="price">{{item.price}}</span>
        			</dd>
        		</dl>
        	</div>
        </div>
        <div class="contine">
        	<p>继续滑动查看更多商品信息</p>
        </div>
        <div class="navs">
        	<ul>
        		<li v-for="(one,index) in data"  class="l" :class="{active:isactive==index}" @click="pull(index)" :key="index">{{one}}</li>
        	</ul>
        </div>
       <div class="contain" v-show="name">
        	
        </div>
        
       <mt-tabbar class="boxing" fixed>
			<p class="collect l " @click="collect">
				<span class="el-icon-star-off  star"></span>
				<span class="texts"  v-text="sort" ></span>
			</p>
    		<p class="join l button">加入购物车</p>
    		<p class="buy l button">立即购买</p>
       </mt-tabbar>
	</div>
</template>

<script>
	import headerCo from '@/components/page/children/shop_header.vue'; //头部内容
	import { Indicator } from 'mint-ui';
    import QS from 'qs';
    import imgage from "@/assets/bgyj.jpg"
    import brand from "@/assets/loop.png"
export default {
  data () {
  	
      return {
		 title: '商品详情',
         datas:[imgage ,imgage ,imgage,imgage],
         hello:[
         {img:brand,text:"和玉缘 和田玉白玉路路通转运珠吊坠...",price:"￥188.00"},
         {img:brand,text:"和玉缘 和田玉白玉路路通转运珠吊坠...",price:"￥10.99"},
         {img:brand,text:"和玉缘 和田玉白玉路路通转运珠吊坠...",price:"￥10.99"},
         ],
         data:["图文详情","规格参数","商品评论","商品咨询"],
         name:true,
         isactive:"",
         sort:"收藏"
      }
  },
  methods:{
  	pull(index){
  		this.isactive=index
  	},
  	collect(){
  		if(this.sort="收藏"){
  			this.sort="已收藏"
  		}
  	}
  },
  components:{
      headerCo
  }
}
</script>

<style lang="less" scoped>
.l{
	float: left;
}
.r{
	float: right;
}
	 .mint-swipe{
        width:100%;
        height:6.22rem;
        img{
            width:100%;
            height:100%;
        }
        .mint-swipe-indicators{
            .mint-swipe-indicator{
                width:20px;
                height:20px;
            }
        }
    }
    .introduce{
    	width: 100%;
    	height: 2.5rem;
    	background: #f1f1f1;
    	.big{
    		width: 6.4rem;
    		height: 1rem;
    		font-size: 0.3rem;
    		font-family: "微软雅黑";
    		margin-top: .2rem;
    		margin-left: .2rem;
    		color: #323232;
    		margin-right: 0.2rem;
    		line-height: 150%;
    	}
    	.share{
    		width: 0.6rem;
    		margin-top: .2rem;
    		margin-left: .1rem;
    		height: 1rem;
    		line-height: 200%;
    		.pic{
    			display:block;
    			img{
    				width: 0.4rem;
    				height: 0.4rem;
    			}
    		}
    		.font{
    			color: #565656;
    		}
    		
    	}
    	.chase{
    		width: 6rem;
    		height: .4rem;
    		line-height: .4rem;
    		margin-left: .2rem;
    		font-size: 0.2rem;
    		color: #d29d29;
    	}
    	.money{
    		width: 80%;
    		height: 0.5rem;
    		color: #df282a;
    		font-size: .3rem;
    		margin-left: .2rem;
    		margin-top: .1rem;
    	}
    }
    .choose{
    	width: 100%;
    	height: 3rem;
    	background: #FFFFFF;
    	.promote{
    		width: 100%;
    		height: 1.3rem;
    		padding-top: .2rem;
    		border-bottom: 1px solid #f1f1f1;
    		.top{
    			width: 100%;
    			height: 0.75rem;
    			line-height: 300%;
    			.text{
    			margin-left: 0.2rem;
    			margin-right: .2rem;
    			font-size: .25rem;
    			color: #767676;
    		}
    		span{
    			display: inline-block;
    			font-size: .25rem;
    			color: #767676;
    		}
    		img{
    			margin-top: .16rem;
    			width: .75rem;
    			margin-right: .2rem;
    			}
    		}
    		.bottom{
    			width: 100%;
    			height: 0.75rem;
    			line-height: 200%;
    			
    		span{
    			display: inline-block;
    			font-size: .25rem;
    			color: #767676;
    		}
    		img{
    			margin-top: .05rem;
    			width: .75rem;
    			margin-right: .2rem;
    			margin-left: .9rem;
    			}
    		}
    		
    	}
    	.already{
    		width: 95%;
    		height: 1.3rem;
    		p{
    			height: 1.3rem;
    			line-height: 1.3rem;
    			.one{
    				width: 15%;
    				display: inline-block;
    				margin-left: .2rem;
    				font-size: .25rem;
    				color: #777777;
    			}
    			.two{
    				display: inline-block;
    				margin-left: .2rem;
    				font-size: .3rem;
    				color: #333333;
    			}
    			.three{
    				display: inline-block;
    				line-height: 1.3rem;
    				font-size: .3rem;
    				color: #777777;
    			}
    		}
    	}
    }
    
    .boxing{
    	width: 100%;
    	height: 1rem;
    	.collect{
    		width: 34%;
    		height: 1rem;
    		.star{
    			display: block;
    			font-size: .5rem;
    			color: #d2ae34;
    			margin-top: .2rem;
    		}
    		.texts{
    			display: block;
    			font-size: .2rem;
    			color: #333333;
    			
    		}
    	}
    	.join{
    		width: 34%;
    		height: 1rem;
    		line-height: 1rem;
    		text-align: center;
    		background: #e9c440;
    		color: #FFFFFF;
    		font-size: 0.3rem;
    	}
    	.buy{
    		width: 32%;
    		height: 1rem;
    		line-height: 1rem;
    		text-align: center;
    		background: #d19e29;
    		color: #FFFFFF;
    		font-size: 0.3rem;
    	}
    }
    .shop{
    	width: 100%;
    	height: 7rem;
    	background: #FFFFFF;
    	border-top: 1px solid #dfdfdf;
    	margin-top: .2rem;
    	.tops{
    		width: 90%;
    		margin-top: .4rem;
    		margin-left: .3rem;
    		height: 1.6rem;
    		.boxs{
    			width: 1.5rem;
    			height: 1,.5rem;
    			line-height: 1.5rem;
    			text-align: center;
    			vertical-align: middle;
    			border: 1px solid #dfdfdf;
    		}
    		.title{
    			display: block;
    			width: 3rem;
    			height: .9rem;
    			line-height: .9rem;
    			font-size: .4rem;
    			margin-left: .3rem;
    			color: #333333;
    		}
    		.people{
    			display: block;
    			width: 3rem;
    			font-size: .2rem;
    			margin-left: .3rem;
    			color: #999999;
    		}
    	}
    	.middle{
    		width: 100%;
    		height: 2.8rem;
    		ul{
    			width: 100%;
    			margin-top: .5rem;
    			height: 2.8rem;
    			li{
    			width: 30%;
    			height: 2rem;
    			line-height: 300%;
    			margin-top: .3rem;
    			border-right: 1px solid #dddddd;
    			text-align: center;
    			.number{
    				display: block;
    				margin-top: .3rem;
    				font-size: .3rem;
    			}
    			.numbers{
    				display: block;
    				font-size: .25rem;
    				color: #999999;
    			}
    			.cate{
    				height: .6rem;
    				line-height: .6rem;
    				.desc{
    					font-size: .24rem;
    					color: #999999;
    				}
    				.color{
    					font-size: .24rem;
    					color: #d2ae34;
    					margin-left: .1rem;
    				}
    			}
    		}
    		}
    	}
    	.bottom{
    		width: 100%;
    		height: 1rem;
    		.chat{
    			width: 1.5rem;
    			height: .6rem;
    			line-height: .6rem;
    			text-align: center;
    			border-radius: 10px;
    			border: 1px solid #d2ae34;
    			font-size: .25rem;
    			color: #d2ae34;
    			margin-left: 1.6rem;
    		}
    		.enter{
    			width: 1.5rem;
    			height: .6rem;
    			line-height: .6rem;
    			text-align: center;
    			border-radius: 10px;
    			border: 1px solid #d2ae34;
    			font-size: .25rem;
    			color: #d2ae34;
    			margin-left: .8rem;
    		}
    	}
    }
    .lunch{
    	width: 100%;
    	height: 6rem;
    	margin-top: .2rem;
    	background: #FFFFFF;
    	.bott{
    		width: 100%;
    		height: 1rem;
    		.lefts{
    		width: 3rem;
    		height: 1rem;
    		line-height: 1rem;
    		font-size: .3rem;
    		color: #333333;
    		margin-left: .2rem;
    	}
    	.rights{
    		width: .5rem;
    		height: 1rem;
    		line-height: 1rem;
    		font-size: .5rem;
    		color: #CCCCCC;
    	}
    	}
    	
    	.box{
    		width: 100%;
    		height: 4rem;
    		dl{
    			width: 32%;	
    			height: 4rem;
    			dt{
    				width: 2rem;	
    				border: 1px solid #CCCCCC;
    				margin-left: .2rem;
    				height: 2.5rem;
    				img{
    					width: 2rem;
    					height: 2rem;
    					margin-top: .5rem;
    				}
    			}
    			dd{
    				width: 2rem;
    				height: 1rem;
    				margin-top: .2rem;
    				margin-left: .2rem;
    				.hello{
    					display: block;
    					color: #727274;
    					font-size: .18rem;
    				}
    				.price{
    					display: block;
    					color: #e02828;
    					font-size: .25rem;
    				}
    			}
    		}
    	}
    }
     .lunchs{
    	width: 100%;
    	height: 6rem;
    	margin-top: .2rem;
    	background: #FFFFFF;
    	.bott{
    		width: 100%;
    		height: 1rem;
    		.lefts{
    		width: 3rem;
    		height: 1rem;
    		line-height: 1rem;
    		font-size: .3rem;
    		color: #e12929;
    		margin-left: .2rem;
    	}
    	.rights{
    		width: 1rem;
    		height: 1rem;
    		line-height: 1rem;
    		font-size: .2rem;
    		color: #CCCCCC;
    	}
    	}
    	
    	.box{
    		width: 100%;
    		height: 4rem;
    		dl{
    			width: 33%;	
    			height: 4rem;
    			dt{
    				width: 2rem;	
    				margin-left: .2rem;
    				height: 2.5rem;
    				img{
    					width: 2rem;
    					height: 2rem;
    					margin-top: .5rem;
    				}
    			}
    			dd{
    				width: 2rem;
    				height: 1rem;
    				margin-top: .2rem;
    				margin-left: .2rem;
    				.hello{
    					display: block;
    					color: #727274;
    					font-size: .18rem;
    				}
    				.price{
    					display: block;
    					color: #e02828;
    					font-size: .25rem;
    				}
    			}
    		}
    	}
    }
    
    
    
    .contine{
    	width: 100%;
    	height: 1rem;
    	background: #f1f1f1;
    	text-align: center;
    	line-height: 1rem;
    	p{
    		height: 1rem;
    		text-align: center;
    		line-height: 1rem;
    		color: #999999;
    	}
    }
    .navs{
    	width: 100%;
    	height: 1rem;
    	background: #FFFFFF;
    	ul{
    		width: 100%;
    		height: 1rem;
    		li{
    			width: 25%;
    			height: 1rem;
    			line-height: 1rem;
    			text-align: center;
    			font-size: .3rem;
    			color: #333333;
    			
    		}
    		.active{
    			border-bottom: .03rem solid #d19e29;
    		}
    	}
    }
    .contain{
    	width: 100%;
    	height: 3rem;
    }
</style>