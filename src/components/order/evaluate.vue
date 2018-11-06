<template>
	<div>
		<div v-title :data-title="title">{{title}}</div>
		<ev-header :text="title"></ev-header>
		<div class="evaluate-wrap" v-for="(item,index1) in data" :key="index1">
			<div class="item-list">
				<div class="text-wrap clearfix">
					<img :src="URL + item.pic_url" class="fl">
					<textarea class="fl" v-model="msg[index1]" placeholder="长度在10-500字之间写点什么吧，您的评论可以为其他用户提供参考"></textarea>
				
				<div class="img-wrap clearfix">
				<div class="list-img fl" v-for="(imgas,index) in imgs" :key="imgas.id" v-show="imgs.length >= 1" @click="imgShow(index)">
					<i class="del el-icon-circle-close" @click="del(index)"></i>
					<img :src="URL+imgas">
				</div>
				<div class="input-btn fl" v-show="imgs.length < 3">
					<input type="file" @change="add_img($event)" ref="int">
				</div>
			</div>
				</div>
				<!-- <div class="img-wrap clearfix">
					<div class="list-img fl" v-for="(imgas,index) in item.img"  v-show="item.img.length >= 1" :key="index" @click="imgShow(index)">
						<div class="del el-icon-circle-cross" @click="del(index)"></div>
						<img :src="URL+imgas">
					</div>
					<div class="input-btn fl" v-show="imgs.length < 5">
						<input type="file" @change="add_img($event,index1,item)" ref="int">
					</div>
				</div> -->
			</div>
			<!-- <div class="max-img" v-show="maximg" @click="hideImg">
				<img :src="URL+maximg">
			</div> -->
			
			<p class="addMost">最多添加3张，每张不超过5M，支持jpg、bmp、png</p>
			<p class="addMost">
				宽度范围：{{imgConfig.min_comment_width}}~{{imgConfig.max_comment_width}}  &nbsp;&nbsp;
				高度范围：{{imgConfig.min_comment_height}}~{{imgConfig.max_comment_height}}
			</p>
			<div class="com_grade clearfix text-center">
				<span>评分</span>
				<el-rate v-model="value1[index1]" class='pingfen'></el-rate>
			</div>
		</div>

		<div class="btn-wrap"></div>
		<footer class="from-btn">
			<button @click="comment">马上评论</button>
		</footer>

		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import evHeader from '@/components/page/children/header.vue';
	import { Toast } from 'mint-ui';
	import qs from 'qs';
	export default {
		name: 'evaluate',
		data() {
			return {
				title: '评价商品',
				imgs: [
					
				],
				maximg: null,
				msg: [],
				status: '',
				rev_data: 1, //中评 差评 好评 如果不选择默认为好评
				load: false,
				img_type: '',
				data: [],
				value1: [],
				data_id: [],
				token:'',
				s_token:'',
				goods:[],
    			imgConfig:{}
			}
		},
		methods: {
			add_img(e,index,item) {
				var self = this;   
				let file = e.target.files[0];   
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function() {
					self.yellow = this.result;
				}   
				let param = new FormData() // 创建form对象
				    param.append('fileData', file, file.name) // 通过append向form对象添加数据
				    param.append('imageToken',this.token)
				    param.append('sessionToken',this.s_token)
				    param.append('chunk', '0') // 添加form表单中其他数据
				let config = {    
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
				this.axios.post(this.$httpConfig.uploadImageByImageComment, param, config)
					.then((res) => {
						if(res.data.status==10001){
		                	this.$router.push('/LogIn');
		                }else {
							if(res.data.status==1){
								this.imgs.push(res.data.data)
							}else{
								Toast(res.data.message)
							}
						}
				})
				this.$refs.int.value = '';
			},
			del(index) {
				this.imgs.splice(index, 1)
			},
			imgShow(index) {
				this.maximg = this.imgs[index]
			},
			hideImg() {
				this.maximg = null;
			},
			comment() {
				//              this.load = true;
				if(this.msg.length == 0){
					Toast('请填写评论');
					return;
				}else if(this.imgs.length == 0){
					Toast('请上传图片');
					return;
				}else if(this.value1[0] == 0){
					Toast('请进行评分');
					return;
				}else{
					let goods_item=[]
					let goods=[]
					for(var i=0;i<this.data.length;i++){
						goods.push({
							goods_id:this.data[i].goods_id,
							content:this.msg[i],
							score:this.value1[i],
							img:this.imgs
						})
						goods_item.push(goods)
					}
					for(var i=0;i<goods.length;i++){
						this.axios.post(this.$httpConfig.commentOrder, qs.stringify({
							order_id:this.data_id,
							goods_id:goods[i].goods_id,
							content: goods[i].content,
							score:goods[i].score,
							img: goods[i].img
						})).then((res) => {
								Toast(res.data.message)
								if(res.data.status){
									this.$router.back(-1);
								}
						}).catch((err) => {
							console.log(err);
						})
					}
				}
			},
		},
		mounted() {
			this.axios({
				url:this.$httpConfig.getCommentImageConfig, 
				method:'post',	
			}).then((res) => {
        		this.imgConfig = res.data.data.config;
				this.token=res.data.data.token
				this.s_token=res.data.data.s_token
			}).catch((err) => {
				console.log(err);
			});
			this.axios.post(this.$httpConfig.orderInfoCommont, qs.stringify({
				id: this.$route.params.id
			})).then((res) => {
				if(res.data.status==10001){
		            this.$router.push('/LogIn');
		        }else {
					this.data = res.data.data.goods
					this.data_id = res.data.data.id
					for(var i=0;i<this.data.length;i++){
						this.$set(this.data[i],'img',[ ])
					}
				}
			}).catch((err) => {
				console.log(err);
			});
		},
		components: {
			evHeader
		}
	}
</script>
<style scoped>
.red{
  color: red;
  margin:0 5px;
}
.money{
  border:1px solid #888;
  padding: .15rem .7rem;
  border-radius: .5rem;
  font-size: 15px;
}

  
  .addMost {
    font-size: 0.21rem;
    color: #ccc;
    padding: 0.25rem 0;
  }
</style>

<style lang="less">
.explain-wrap {
  .el-upload.el-upload--picture-card {
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    i {
      line-height: 1.5rem;
      font-size: 0.5rem;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 1.5rem;
    height: 1.5rem;
  }
  .el-upload-list--picture-card .el-upload-list__item-status-label {
    right: -0.15rem;
    top: -0.06rem;
    width: 0.4rem;
    height: 0.24rem;
    i {
      font-size: 0.12rem;
      margin-top: 0.11rem;
    }
  }
  .img-wrap.active {
    .el-upload.el-upload--picture-card {
      display: none;
    }
  }
  .el-dialog--tiny {
    width: 50%;
  }
}
</style>
<style lang="less" scoped>
	.evaluate-wrap {
		background: #fff;
		margin-top: .2rem;
		.com_grade {
			height: 0.8rem;
			line-height: .8rem;
			span {
				float: left;
				margin: 0 0.2rem;
			}
			.pingfen {
				float: left;
				margin-top: 0.2rem;
			}
		}
		.item-list {
			width: 7.1rem;
			padding: 0 .2rem .3rem;
			border-bottom: 1px solid #dfdfdf;
			.text-wrap {
				padding: .56rem 0;
				img {
					width: 1.74rem;
					height: 1.74rem;
				}
				textarea {
					width: 5.3rem;
					height: 1.74rem;
					padding: 0 .2rem;
					border: none;
					resize: none;
					outline: none;
					font-size: .28rem;
					color: #333;
				}
			}
			.img-wrap {
				width: 100%;
				display:flex;
				flex-direction:row;
				justify-content:space-around;
				.list-img {
					margin-right: .3rem;
					margin-top: .2rem;
					position: relative;
					img {
						width: 1.5rem;
						height: 1.5rem;
					}
					.del {
						position: absolute;
						top: -0.15rem;
						right: -0.15rem;
						font-size: 0.5rem;
						color:#f00;
						background-color:#fff;
						border-radius:50%;
						border:none;
					}
				}
				.list-img:nth-child(4n) {
					margin-right: 0;
				}
				.input-btn {
					position: relative;
					overflow: hidden;
					width: 1.5rem;
					height: 1.5rem;
					background: url(../../assets/img-btn.jpg) no-repeat;
					background-size: 100% 100%;
					margin-top: .2rem;
					input {
						width: 200%;
						height: 200%;
						position: absolute;
						left: -100%;
						top: -100%;
						outline: none;
					}
				}
			}
		}
		.max-img {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .7);
			z-index: 999;
			img {
				width: 100%;
				height: 80%;
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				margin: auto;
			}
		}
	}
	
	.btn-wrap {
		width: 100%;
		height: 1.74rem;
	}
	
	.from-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1.74rem;
		background: #f1f1f1;
		text-align: center;
		button {
			width: 7.1rem;
			height: .9rem;
			background: #D19E29;
			border: none;
			color: #fff;
			font-size: .32rem;
			outline: none;
			position: absolute;
			left: .2rem;
			top: .4rem;
		}
		button:active {
			box-shadow: 0 5px 5px #ccc;
		}
	}
</style>