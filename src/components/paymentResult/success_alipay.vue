<template>
	<div v-loading = "loading">
		<div class="cashier">
			<div class="teacher-main">
				<header class="header">
					<span @click="goBack" class="btnGo"></span>
					<h1 v-if="status == 1">支付成功</h1>
					<h1 v-else-if="status == 0">支付失败</h1>
					<h1 v-else>支付结果</h1>
				</header>
			</div>
			<div v-if="status == 1" class="pay">			
				<img class="pay-result-image" src="../../assets/pay_success.svg"/>
				<!--<p class="pay-result">支付成功</p>-->
				<el-button type="success" @click.native="goBack" class="pay-btn">查看订单</el-button>
			</div>
			<div v-else-if="status == 0" class="pay">			
				<img class="pay-result-image" src="../../assets/pay_error.svg"/>
				<p class="pay-result">支付失败</p>
				<el-button type="warning" @click.native="goBack" class="pay-btn">完成</el-button>
			</div>
			<div v-else class="pay">
				<p class="pay-result">结果查询中...{{this.$route.query.trade_no}}</p>
			</div>
			<div class="huodong" @click="goYidong">
				如购买活动商品，请点击此处申请“移动卡”
			</div>
		</div>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import cashierHeader from '@/components/home/children/header.vue';
	import qs from 'qs';
	export default {
		name: 'cashier',
		data() {
			return {
				loading:false,
				status:'1'
			}
		},
		created() {},
		methods: {
			goBack(){
				var type = sessionStorage.getItem('pay_sourse');
				if(type == 'goods'){
					this.$router.push({
						name:'orderList',
						params:{id:0}
					})
				}else if(type == 'goodsPackage'){
					this.$router.push({
						name:'packageList',
						params:{id:0}
					})
				}else if(type=='integral'){
					this.$router.push({
						name:'intOrder'
					})
				}else{
					this.$router.push({
						name:'person'
					})
				}
			},
            goYidong(){
                window.mui.openWindow({
                    url: 'http://m.fzxbwl.com/#/KOinfo/3020',
                    id: 'whh-second-wv',
                    styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
                        titleNView: {                       // 窗口的标题栏控件
                            titleText: "用户如何参与活动",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
                            titleColor:"#000000",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
                            titleSize:"17px",                 // 字体大小,默认17px
                            backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
                            progress:{                        // 标题栏控件的进度条样式
                                color:"#00FF00",                // 进度条颜色,默认值为"#00FF00"
                                height:"2px",                    // 进度条高度,默认值为"2px"
                            },
                            homeButton: true,
                            autoBackButton: true,
                            splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
                                color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"
                                height:"1px"                    // 分割线高度,默认值为"2px"
                            }
                        }
                    }
                });
			},
		},

		mounted() {
		},

		destroyed() {},
		components: {
			cashierHeader
		}
	}
</script>
<style lang="less" scoped>
	.cashier {
		background: #fff;
		.huodong{
			position: absolute;
			left:0;
			bottom: 40px;
			width: 100%;
			text-align: center;
			font-size: 15px;
		}
		.teacher-main{
			height: 10%;
			.header{
				    width: 100%;
				    height: .62rem;
				    background: #D19E29;
				    padding: .16rem 0;
				    text-align: center;
				    position: relative;
				    color: #fff;
				    font-size: .36rem;
				    font-weight: bold;
				    line-height: .62rem;
				    position: fixed;
				    top: 0;
				    left: 0;
				    z-index: 1;
				.btnGo{
					    position: absolute;
					    left: .2rem;
					    top: 50%;
					    margin-top: -0.23rem;
					    width: .46rem;
					    height: .46rem;
					    background: url('../../assets/btn-return.png') no-repeat;
					    background-size: 100% 100%;
				}
			}
		}
		.pay{
			width: 50%;
			margin: 0 auto;
			height: 90%;
			min-height: 300px;
			display:flex;
			flex-direction:column;
			align-content:center;
			text-align:center;
			align-items:stretch
			.pay-result-image{
				width: 100px;
				height: 100px;
			}
			.pay-result{
				font-size: 17px;
				color: #3C3C3C;
				font-weight: bold;
			}
			.pay-btn{
				margin-top: 50px;
			}
		}
	}	
	.cashier.active {
		background: none;
	}
</style>