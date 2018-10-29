<template>
	<div ref='box'>
        <div v-title :data-title="ways">{{ways}}</div>
        <newHeader :text="ways" :set="true"></newHeader>
        <div class="content">
        	<p class="question"><span>Q:</span>{{detail.title}}</p>	
        	<p class="answer">
        		<span class="l texts">A:</span>
        		<span class="l text">{{detail.info}}</span>
        	</p>
        	<p class="other"><span>.</span>还有其它问题？</p>
        </div>
        <ul>
	        <li v-for="lists in detail.list" :key="lists.id" @click="toInfoPage(lists)">{{lists.title}}<span class="el-icon-arrow-right r"></span></li>
	    </ul>
	    <div class="link">
	    	<p class="r find" @click="connect">联系客服<span class="el-icon-arrow-right"></span></p>
	    	<p class="r find">没找到相关问题？</p>
	    </div>
        <!--<div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>-->
    </div>
</template>

<script>
	import newHeader from '@/components/page/children/header.vue';
    import qs from 'qs';
    export default {
        name : 'news_content',
        data(){
            return {
                ways:'查看解决方案',
                load_wrap:true,
                detail:''
            }
        },
        components:{
            newHeader
		},
		created(){
			this.getProblemInfo();
		},
        mounted(){
            this.$refs.box.style.backgroundColor = "#fff"
            if(this.$route.params.status == 2){
                this.load_wrap = false;
            } else {
								window.history.go(0)
            };
        },
        methods:{
			toInfoPage(item){
				
			},
			//问题详情
			getProblemInfo(){
				this.axios.post(this.$httpConfig.helpInfo, qs.stringify({
					id: this.$route.params.id
				})).then((res) => {
					if(res.data.status == 1){
						this.detail = res.data.data;
					}else{
						Toast({
                            message: res.data.message,
                            duration: 1000
                        }); 
					}
				}).catch((err) => {
					console.log(err);
				})
			},
        	connect(){
        		this.$router.push('/customer');
        	}
        },
        render(createElement) {
            return createElement(
                this.level,   // tag name 标签名称
            )
        },
        
    }
</script>


<style lang="less" scoped>
	.r{
		float: right;
	}
 .content{
    width: 710/100rem;
    margin:.2rem .2rem 0 .2rem;
    font-size:.28rem;
    color:#333;
    word-wrap:break-word;
    word-break:break-all;
    .question{
        font-size:.28rem;
        text-indent: 12px;
        line-height: 40/100rem;
        padding: 40/100rem 0;
        border-bottom: 2px solid #ccc;
        span{
        	font-size: 24px;
        	margin-right: .2rem;
        	color: #CCCCCC;
        }
    }
    .answer{
    	height: 3.5rem;
    	font-size:.28rem;
        /*text-indent: 12px;*/
        line-height: 40/100rem;
        margin-top: .4rem;
        margin-bottom: .4rem;
        color: #7C7C7C;
        .texts{
        	display: block;
        	width: .4rem;
        	height: 3.5rem;
        	font-size: 24px;
        	margin-right: .2rem;
        	color: #CCCCCC;
        	float: left;
        	margin-left: .22rem;
        }
        .text{
        	display: block;
        	float: left;
        	width: 80%;
        	height: 3.5rem;
        	font-size: .26rem;
        }
    }
    .other{
    	height: 1rem;
    	font-size: .25rem;
    	padding-bottom: .2rem;
/*    	border-bottom: 2px solid #ccc;
*/    	line-height: 1rem;
    	span{
    		font-size: 40px;
    		color: #cccccc;
    		margin-right: .15rem;
    	}
    }
    
}
	ul{
		background: rgb(239,239,239);
		border-top: 2px solid #ccc;
    	li{
    		margin: 0 .2rem 0 .2rem;
    		height: .85rem;
    		line-height: .85rem;
    		font-size: .25rem;
    		color: #7C7C7C;
    		border-bottom: 1px solid #ccc;
    		span{
    			margin-top: .26rem;
    			font-size: .4rem;
    			color: #CCCCCC;
    		}
    	}
    }
    .link{
    	height: 1rem;
    	.find{
    		height: 1rem;
    		line-height: 1rem;
    		font-size: .25rem;
    		color: #7C7C7C;
    	}
    }
</style>
