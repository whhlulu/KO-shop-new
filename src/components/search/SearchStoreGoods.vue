<template>
	<div class="Search-header">
		<div v-title data-title="主页">商品搜索</div>
		<div class="Search-wap clearfix">
			<div class="Search-input-main fl">
				<input type="search" v-model="value" placeholder="搜索该店铺宝贝" @keyup.enter="submit(value)">
			</div>
			<span @click="remove" class="return-btn fl">取消</span>
		</div>
		
	</div>
</template>
<script>
	import qs from 'qs';
	import { MessageBox, Toast } from 'mint-ui';
	var clear = null;
	export default {
		name: 'search',
		data() {
			return {
				value: '',
			}
		},
		created() {
		},
		methods: {
			submit(keyword) {
				// 点击回车
				this.$router.push({
					name: 'listStoreGoods',
					params: {
						data:keyword,
						id:this.$route.params.id
					}
				});
				if(keyword==''){
					return false
				}
			},
			remove() {
				this.$router.go(-1);
			}
			
		},
		mounted() {
			
		}
	}
</script>
<style lang="less" scoped>
	.Search-header {
		background: #f2f2f2;
		.Search-wap {
			height: .6rem;
			padding: .1rem .2rem;
			background: #C79A03;
			.return-btn {
				width: .8rem;
				height: .6rem;
				text-align: center;
				line-height: .6rem;
				font-size: .28rem;
				color: #fff;
				em {
					position: absolute;
					left: .45rem;
					top: .06rem;
					i {
						border-right: 10px solid #fff;
						border-top: 10px solid transparent;
						border-bottom: 10px solid transparent;
						position: absolute;
						right: 0;
						top: 0;
					}
					b {
						border-right: 10px solid #0097fa;
						border-top: 10px solid transparent;
						border-bottom: 10px solid transparent;
						position: absolute;
						right: -.04rem;
						top: 0;
					}
				}
			}
			.Search-input-main {
				width: 6.3rem;
				height: .6rem;
				border-radius: 100px;
				background: #D6B603;
				line-height: 100%;
				input  {
					width: 6.2rem;
					padding-right: .1rem;
					height: 100%;
					border: none;
					border-radius: 100px;
					background: #D6B603;
					background-size: .26rem .27rem;
					outline: none;
					text-indent: .6rem;
					font-size: .25rem;
				}
			   input::-webkit-input-placeholder{
		            color:#fff;
		        }
		        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
		            color:#fff;
		        }
		        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
		            color:#fff;
		        }
		        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
		            color:#fff;
		        }
		    }
		}
		
	}
	
	.Search-header {
		.list-item-wrap {
			background: #fff;
			li {
				font-size: .25rem;
				height: .8rem;
				line-height: .8rem;
				color: #888;
				font-weight: normal;
				border-bottom: 1px solid #ccc;
				padding: 0 .2rem;
				background: url(../../assets/btn-right.png) 7.2rem center no-repeat;
				background-size: .14rem .24rem;
			}
			li:active {
				background: url(../../assets/btn-right.png) 7.2rem center no-repeat #f5f5f5;
				background-size: .14rem .24rem;
			}
		}
	}
</style>