<template>
	<transition>
		<div class="detail-wrap"  v-show="$store.state.const_join">
			<div class="content-main">
				<div class="padd">
					<div class="contet-item clearfix" v-if="$store.state.commodity_data">
						<img :src="URL + data.images[0].pic_url" >
						<p class="item">{{data.goods.title }}</p>
						<p class="price" v-if="$route.params.status ==1">￥<span>{{data.goods.price_member}}</span></p>
						<p class="price" v-else><span>{{$store.state.commodity_data.goods.integral}}</span> 积分</p>
						<span class="delete-btn" @click="remove">×</span>
					</div>
					<div class="content-scroll">
						 <div class="gui clearfix" v-if="spec.spec_group" id="specifications" v-for="(item,index) in spec.spec_group" :key="item.id">
						 	<p>{{item.name}}</p>
							<span :data-id="data.id" :data-spec-id="data.spec_id" v-if="item.id == data.spec_id" v-for="data in spec.spec_children" :key="data.id" @click="addClass(index,$event)" :class="{active: guigedata.goods[specKey].key.indexOf(data.id)>-1}">{{data.item}}</span>
						 </div>
						<!-- 数量增加减少 -->
						<div class="addSub clearfix">
							<span class="pull-left fl">数量</span>
							<div class="pull-right fr clearfix">
								<span class="stock fl" v-if="$store.state.commodity_data.stock">库存：{{data.goods.stock}}件</span>
								<div class="input-main fl clearfix">
									<button class="fl" @click="reduce">-</button>
									<input type="tel" class="fl" :maxlength="data.goods.stock.length" v-model="$store.state.commodity_val" @change="min">
									<button class="fl" @click="plus">+</button>
								</div>
							</div>
						</div>
						<!-- 共计 -->
						<div class="com">
							共<span>{{Number($store.state.commodity_val)}} </span>件&nbsp;&nbsp; 共计
							<span v-if="$route.params.status ==1"><i>￥</i>{{$store.state.commodity_val * data.goods.price_member|keepTwoNum}}</span>
							<span v-else> {{$store.state.commodity_val * $store.state.commodity_data.goods.integral}} <i>积分</i></span>
						</div>
				</div>
				<div class="btn-join clearfix" v-if="$route.params.status == 1">
					<button class="join fl" @click="join">加入购物车</button>
					<button class="fl imm" @click="toOrder">立即购买</button>
				</div>
				<div class="btn-join clearfix" v-if="$route.params.status == 2">
					<button class="fr imm" @click="remove">确定</button>
				</div>
			</div>
		</div>
	</div>
	</transition>
</template>
<script>
	import qs from 'qs';
	import { Toast } from 'mint-ui';
	export default {
		name: 'detailOptions',
		data() {
			return {
				status: '',
				guigedata:[],
				guigeid: [],
				guigedata_name:'',
				isactive:'',
				specKey:this.$route.params.id,
				spec:[],
				length:[],
				problem:''
				
			}
		},
		props: {
			data:''
		},
		mounted() {
			this.guige();
		},
		methods: {
			shoppingAjax() {
				this.axios.post(this.$httpConfig.orderBegin, QS.stringify({
					price_sum: '',
					goods_id: this.$route.params.id,
					problem: this.problem
				})).then((res) => {
					if(res.data.status==10001){
                		this.$router.push('/LogIn');
                	}else{
						Toast({
							message: res.data.message,
							position: 'bottom',
							duration: 1000
						});
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			guige() {
				//规格
				this.axios.post(this.$httpConfig.goodSpecsByGoodsChildren,
					qs.stringify({
						id:this.data.goods.id
					})).then(res => {
						if(res.data.status == 1) {
							this.guigedata = res.data.data;
							this.spec= res.data.data.spec;
						}
					})
			},
			reduce() {
				if(this.$store.state.commodity_val <= 1) return;
				this.$store.state.commodity_val--;
			},
			plus() {
				if(this.$store.state.commodity_val >= parseInt(this.$store.state.commodity_data.stock)) return;
				this.$store.state.commodity_val++;
			},
			min() {
				let val = parseInt(this.$store.state.commodity_val);
				let reg = /(^[1-9]([0-9]*)$|^[0-9]$)/;
				if(!reg.test(val)||val == 0){this.$store.state.commodity_val = 1}
				if(val >= this.data.goods.stock)this.$store.state.commodity_val = this.data.goods.stock;
			},
			remove() {
				this.$store.state.const_join = false;
			},
			//选择规格重新获取数据
			getData(id){
				this.axios({
                    url:this.$httpConfig.goodInfo,
                    method:'get',
                    params:{
                        id:id
                    }
                }).then((res) => {
                   	this.$store.state.commodity_data = res.data.data;
					this.$store.state.commodity_val = 1;
					this.$emit('recommend');
                }).catch((err) => {
                    console.log(err);
                });

			},
			//样式切换
			styleTab(ele){
				if($(ele).hasClass('active')){
					$(ele).removeClass('active');
				}else{
					$(ele).addClass('active');
				};
			},
			addClass(index,event) {
				let selectedList = [],sortList = '',str = '',goodsId = '';

				$('#specifications span').each(function(i,e){
					let specId = $(e).data('spec-id');
					if(specId == index){
						$(e).removeClass('active');
					}
				})
				this.styleTab(event.currentTarget);
				//获取所有选中的规格
				$('#specifications span').each(function(i,e){
					if($(e).hasClass('active')){
						selectedList.push($(e).data('id'));
					}
				});
				//排序
				sortList = selectedList.sort((a,b)=>{
					return a>b?1:-1;
				})
				//字符串拼接
				str = sortList.join('_');
				//对比
				for (let i in this.guigedata.goods) {
					if(str === this.guigedata.goods[i].key){
						goodsId = this.guigedata.goods[i].goods_id;
					}
				}
				this.$store.state.goods_id = goodsId;
				this.getData(goodsId);
			},
			getGoodInfo(id){
				this.axios.post(this.$httpConfig.getGoodInfo,qs.stringify({
                    id:id
                })).then((res) => {
                }).catch((err) => {
                    console.log(err);
                });
			},
			toOrder() {
				sessionStorage.removeItem('invoiceGroup');
				sessionStorage.removeItem('invoiceInit');
				this.$store.state.invoice = false;
				this.$store.state.rise = null;
				this.$store.state.type = null;
				this.$store.state.content = null;
				this.$store.state.invoice_id = '';
				if(this.$store.state.commodity_data.stock == 0 ){
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
			toExchange() {
				this.$store.state.goods = JSON.stringify([{
					num: this.$store.state.commodity_val,
					id: this.$route.params.id,
					goods_price: this.$store.state.commodity_data.price_member
				}]);
				this.$store.state.const_join = false;
				this.$router.push({
					name: 'order',
					params: {
						id: 3,
						goods:JSON.parse(this.$store.state.goods),
					}
				});
			},
			join() {
				if(this.$store.state.commodity_data.stock == 0 ){
					Toast({
					  message: "库存不足",
					  duration: 1000
					});
					return  
				}
				for(let i = 0; i < this.$store.state.guigeid.length; i++) {
					if(!this.$store.state.guigeid[i]) {
						Toast('请选择' + this.$store.state.guigeName[i]);
						return
					}
				}
				if(this.$store.state.commodity_val==''||this.$store.state.commodity_val==0){
					Toast('请选择商品数量');
					return false
				}
				this.axios.post(this.$httpConfig.addGoodToCart, qs.stringify({
					goods_id: this.data.goods.id,
					goods_num: this.$store.state.commodity_val,
					price_new: this.data.goods.price_member,
					store_id: this.data.goods.store_id
				})).then((res) => {
					if(res.data.status==10001){
                		this.$router.push('/LogIn');
                	}else{
						if(res.data.status == 0) {
							Toast({
								message: res.data.message,
								duration: 1000
							});
						}else if (res.data.status == 1){
							Toast({
								message: res.data.message,
								duration: 1000
							});
							this.$store.state.catr_number += parseInt(this.$store.state.commodity_val);
							this.$store.state.const_join = false;
						}
						
					}
				}).catch((err) => {
					console.log(err);
				});
			}
		}
	}
</script>
<style lang="less" scoped>
.r{
	float: right;
}
	.detail-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 1;
		.content-main {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			background: #fff;
			.padd {
				padding: 7px;
				.contet-item {
					padding: 0 0 .4rem;
					position: relative;
					border-bottom: 1px solid #dfe3e4;
					img {
						width: 1.77rem;
						height: 1.77rem;
						border-radius: 10px;
						position: absolute;
						top: -.05rem;
						left: 0;
					}
					.item {
						padding-left: 1.92rem;
						padding-top: .36rem;
						width: 4.8rem;
						height: .8rem;
						font-size: .26rem;
						color: #333;
						line-height: .4rem;
						overflow: hidden;
					}
					.price {
						font-size: .26rem;
						color: #ff7200;
						padding-left: 1.92rem;
						padding-top: .1rem;
						span {
							font-size: .32rem;
						}
					}
					.delete-btn {
						position: absolute;
						right: 0;
						top: .2rem;
						width: .34rem;
						line-height: .30rem;
						height: .34rem;
						border: 1px solid #bfbfbf;
						text-align: center;
						font-size: .4rem;
						color: #bfbfbf;
						border-radius: 100%;
					}
				}
				.content-scroll {
					height: 5rem;
					overflow-y: scroll;
					.gui {
						padding:0.3rem 0;
						border-bottom: 1px solid #dfe3e4;
						p{
							font-size: .32rem;
	    					color: #757575;
	    					margin-bottom:10px;
						}
						span{
							margin-left:.1rem;
							padding:0 .2rem;
							height:0.5rem;
							text-align: center;
							border:1px solid #757575;
							border-radius:3px;
							float: left;
							line-height: 0.5rem;
							color:#757575;
							font-size:0.3rem;
						}
						span:last-child{margin-right:0px;}
						.active{border-color:#ff7200;color: #ff7200;}
					}
				}
				
				.addSub {
					height: 1.38rem;
					border-bottom: 1px solid #dfe3e4;
					line-height: 1.38rem;
					.pull-left {
						font-size: .32rem;
						color: #757575;
					}
					.pull-right {
						.stock {
							font-size: .24rem;
							color: #aeadad;
						}
						.input-main {
							width: 2.36rem;
							height: .79rem;
							border: 1px solid #dfdfdd;
							border-radius: 5px;
							margin-top: .3rem;
							margin-left: .2rem;
							overflow: hidden;
							line-height: .79rem;
							button {
								width: .7rem;
								border: none;
								background: #fff;
								color: #757575;
								font-size: .5rem;
								line-height: .79rem;
								outline: none;
								height: 100%;
							}
							button:active {
								background: #ff7200;
								color: #fff;
							}
							input {
								width: .95rem;
								border: none;
								height: 100%;
								border-left: 1px solid #dfdfdd;
								border-right: 1px solid #dfdfdd;
								text-align: center;
								font-size: .4rem;
								color: #757575;
							}
						}
					}
				}
				.com {
					height: 1.2rem;
					line-height: 1.2rem;
					text-align: right;
					font-size: .32rem;
					color: #666;
					span {
						font-size: .36rem;
						color: #ff7200;
						font-weight: bold;
						i {
							font-size: .32rem;
							font-style: normal;
						}
					}
				}
			}
			.btn-join {
				button {
					width: 50%;
					border: none;
					height: 1rem;
					line-height: 1rem;
					color: #fff;
					font-size: .32rem;
				}
				.join {
					background: #E9C440;
				}
				.imm {
					background: #D19E29;
				}
			}
		}
	}
</style>