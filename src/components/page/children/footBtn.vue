<template>
	<div class="footer2017">
		<div class="seat"></div>
		<div class="btn-main clearfix">
			<div class="col fl" @click="col">
				<img :src="imgsNo" alt=""  v-if="type==2">
				<img v-else :src="imgsYes" alt="">
				<span v-if="type==2">收藏</span>
				<span v-else>已收藏</span>
			</div>
			<div class="join fl" @click="hide">加入购物车</div>
			<div class="imm fl" @click="buy">立即购买</div>
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
			this.post();
		},
		methods: {
			col() { //收藏
				if(this.type == 2) {
					this.imgs = this.imgsYes;
					this.type = 1;
				} else {
					this.imgs = this.imgsNo;
					this.type = 2;
				}
				this.axios.post(this.$httpConfig.addCollection, qs.stringify({
					goods_id: this.$route.params.id,
					type: this.type
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						Toast({
							message: res.data.message,
							position: 'bottom',
							duration: 800
						});
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			//进来就算是收藏状态
			hide() {
				this.$store.state.const_join = true;
			},
			buy() {
				sessionStorage.removeItem('invoiceGroup');
				sessionStorage.removeItem('invoiceInit');
				this.$store.state.invoice = false;
				this.$store.state.rise = null;
				this.$store.state.type = null;
				this.$store.state.content = null;
				this.$store.state.invoice_id = '';
				if(this.$store.state.commodity_data.stock <= 0 ){
					Toast({
					  message: "库存不足",
					  duration: 1000
					});
					return 
				}
				let goods_id = '';
				if(this.$store.state.goods_id){
					goods_id = this.$store.state.goods_id;
				}else{
					goods_id = this.$route.params.id;
				}
				this.$router.push({
					name: 'order',
					params: {
						good_id:goods_id,
						num:this.$store.state.commodity_val,
						id: 2
					}
				});
			},
			post() {
				this.axios({
					url: this.$httpConfig.myCollection,
					method: 'get',
					params: {
					}

				}).then((res) => {
					if(res.data.data==""){
						this.isCol = false;
						this.type = 2;
					}else{
						this.dataCol = res.data.data.goods;
						let cols = this.dataCol;
						for(var i in cols){
							if(cols[i].goods_id == this.$route.params.id){
								this.isCol = true;
								this.type = 1;
								break;
							}else{
								this.isCol = false;
								this.type = 2;
							}
						}

					}
						this.load = false;
						this.load_wrap = false;
				}).catch((err) => {
					console.log(err);
				});
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