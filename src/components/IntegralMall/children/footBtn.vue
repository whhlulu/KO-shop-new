<template>
	<div class="footer2017">
		<div class="seat"></div>
		<div class="btn-main clearfix">
			<div class="imm fr" @click="exchange">我要兑换</div>
		</div>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import qs from 'qs';
	export default {
		name: 'footBtn',
		data() {
			return {
				type: 0,
				imgs: require('@/assets/images/footer_star.png'),
				imgsNo: require('@/assets/images/footer_star.png'),
				imgsYes: require('@/assets/images/xu_xinxin.png'),
				dataCol: [],
				choice:true
				
			}
		},
		props: {
			data: '',
			message: '',
			nb: '',
			Number: '',
			money: '',
		},
		created() {
		},
		methods: {
			exchange() {
				this.$router.push({
					name: 'confirmOrderIntegral',
					params: {
						good_id: this.data.id,
						num:this.$store.state.commodity_val,
						id:3
					},
				})
			},
		}
	}
</script>
<style lang="less" scoped>
	.footer2017 {
		width: 100%;
		height: 1rem;
		.choose{
			width: 100%;
			height: 2rem;
			/*z-index: 100;*/
		}
		.ex {
			font-size: .22rem;
			color: #999;
			padding-left: .2rem;
			line-height: .9rem;
			img {
				width: 40/100rem;
				height: 40/100rem;
			}
		}
		.seat {
			width: 100%;
			height: 100%;
			background: #f1f1f1;
		}
		.btn-main {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			text-align: center;
			background: #fff;
			em {
				// width:.5rem;
				// height:.5rem;
				// position:absolute;
				// top:.1rem;
				// left:50%;
				margin-right: .25rem;
				font-style: normal;
				color: #d21923;
				font-size: .5rem;
			}
			.col {
				margin-top: 10/100rem;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				box-sizing: border-box;
				img {
					width: 50/100rem;
					height: 50/100rem;
					margin-bottom: 5/100rem;
				}
				width:2.5rem;
				color:#333;
				font-size:.22rem;
				em {
					width: .5rem;
					height: .5rem;
					position: absolute;
					top: .1rem;
					left: 50%;
					margin-left: -.25rem;
					font-style: normal;
					color: #d21923;
					font-size: .5rem;
				}
			}
			.join {
				width: 2.5rem;
				height: 100%;
				background: #E9C440;
				color: #fff;
				font-size: .32rem;
				line-height: 1rem;
			}
			.imm {
				width: 2.5rem;
				height: 100%;
				background: #D19E29;
				color: #fff;
				font-size: .32rem;
				line-height: 1rem;
			}
		}
	}
</style>
<style lang="less" scoped>
	.mint-toast {
		.mint-toast-text {
			font-size: .3rem;
		}
	}
</style>