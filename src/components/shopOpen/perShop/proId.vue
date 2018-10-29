<template>
	<div>
		<div v-title data-title="我要开店">我要开店</div>
		<top-header :text="title"></top-header>
		<con-header :text="text[0]"></con-header>
		<ul class="per-center">
			<li>
				<a href="javascript:;" @click="open">
					<span> 身份证类型:</span>
					<div>
						<span>{{card}}</span>
						<img class="rightImg" src="../../../assets/images/right-icon.png" alt="">
					</div>
				</a>
				<mt-popup v-model="popupVisible" position="bottom" class="tol">
					<div class="picker-toolbar">
						<span class="mint-datetime-action mint-datetime-cancel" @click="can">取消</span>
						<span class="mint-datetime-action mint-datetime-confirm" @click="sel">确定</span>
					</div>
					<ul>
						<li class="like" v-for="(n,index) in type" @click="make(index)" :key="index">
							身份证类型：{{n}}
						</li>
					</ul>
				</mt-popup>
			</li>
		</ul>
		<div class="idPhotos">
			<h4>身份证正面：</h4>
			<div>
				<div>
					<input type="file" @change="addImg($event)" v-if="shows" class="file" />
					<img :src="yellow" class="position" v-show="yellow" @click="catchs" v-model="idcard_positive">
				</div>
				<h6>示例</h6>
				<div></div>
			</div>
			<p>图片建议使用4：3比例尺寸建议为1200*900像素jpg,gif,png格式的图片，并且图片大小不可超过2M</p>
		</div>
		<div class="idPhotos">
			<h4>身份证反面：</h4>
			<div>
				<div>
					<input type="file" @change="imgChanges($event)" accept="image/png,image/gif,image/jpeg" v-if="show" class="file" />
					<img :src="hdimg" class="position" v-show="hdimg" @click="cotch" v-model="other_side">
				</div>
				<h6>示例</h6>
				<div></div>
			</div>
			<p>图片建议使用4：3比例尺寸建议为1200*900像素jpg,gif,png格式的图片，并且图片大小不可超过2M</p>
		</div>
		<button @click="nextinfor">下一步</button>
		<p><span class="reds">*</span> 您提供的身份信息，网站将予以保护，不会挪作他用</p>
	</div>
</template>
<script>
	import { Field, Popup, Radio, Toast } from 'mint-ui';
	import QS from 'qs';
	import topHeader from '@/components/page/children/header.vue';
	import conHeader from '@/com/conHeader'; // 内容头
	export default {
		data() {
			return {
				title: '填写入住资料',
				text: ['身份证信息'],
				idcard_positive: "",
				other_side: "",
				shows: true,
				show: true,
				hdimg: '',
				yes: "",
				yellow: '',
				card: '',
				popupVisible: false,
				type: ["中国大陆", '港澳', '中国台湾'],
				card: '',
			}
		},
		methods: {
			make(index) {
				this.card = this.type[index];
				this.popupVisible = false;
			},
			open() {
				this.popupVisible = true;
			},
			can() {
				this.popupVisible = false;
			},
			sel() {
				this.popupVisible = false;
			},
			cotch() {
				this.show = true;
				this.hdimg = false;

			},
			catchs() {
				this.shows = true;
				this.yellow = false;

			},
			addImg(e) {
				var that = this;   
				let file = e.target.files[0];   
				// this.idcard_positive = file.name;
				this.shows = false;
				const reader = new FileReader();
				this.img_type = 'data:' + file.type + ';base64,';
				reader.readAsDataURL(file);
				reader.onload = function() {
					that.yellow = this.result;
				}   
				let param = new FormData() // 创建form对象
				    param.append('adv_content', file, file.name) // 通过append向form对象添加数据
				    param.append('chunk', '0') // 添加form表单中其他数据
				    console.log(param.get('file'),'file的zhi') // FormData私有类对象，访问不到，可以通过get判断值是否传进去
				let config = {    
					headers: {
						'Content-Type': 'multipart/form-data'
					}   
				}
				this.axios.post(this.$httpConfig.uploadImage, param, config)
					.then((res) => {
						if(res.data.status==10001){
		                	this.$router.push('/LogIn');
		            	}else{
							if(res.data.status === 1) {
								this.idcard_positive = res.data.data
							}
						}
					})
			},
			imgChanges(e) {
				var that = this;   
				let file = e.target.files[0];   
				// this.idcard_positive = file.name;
				// this.other_side = file.name;
				this.show = false;
				const reader = new FileReader();
				this.img_type = 'data:' + file.type + ';base64,';
				reader.readAsDataURL(file);
				reader.onload = function() {
					that.hdimg = this.result;
				}   
				
				let param = new FormData() // 创建form对象
				    param.append('adv_content', file, file.name) // 通过append向form对象添加数据
				    param.append('chunk', '0') // 添加form表单中其他数据
				    console.log(param.get('file'),'file的zhi') // FormData私有类对象，访问不到，可以通过get判断值是否传进去
				let config = {    
					headers: {
						'Content-Type': 'multipart/form-data'
					}   
				}
				this.axios.post(this.$httpConfig.uploadImage, param, config)
					.then((res) => {
						if(res.data.status==10001){
		                	this.$router.push('/LogIn');
		            	}else{
							if(res.data.status === 1) {
								this.other_side = res.data.data
							}
						}
					})
			},

			nextinfor: function() {
				if(this.card == ''){
					Toast('请选择身份证类型');
					return;
				}
				if(this.idcard_positive == '') {
					Toast('请上传身份证正面照片');
					return;
				}
				if(this.other_side == '') {
					Toast('请上传身份证反面照片');
					return;
				}
				this.axios.post(this.$httpConfig.enterCardInfo, QS.stringify({
					id: sessionStorage.getItem("shopPer_ID"),
					idcard_positive: this.idcard_positive,
					other_side: this.other_side
				})).then((res) => {
					if(res.data.status==10001){
		        	this.$router.push('/LogIn');
		      }else {
							Toast(res.data.message);
							if(res.data.status == 1) {
								this.$router.push({
									name: "checkProBankInfor"
								})
							}
					}
				}).catch((err) => {
					console.log(err)
				});
			}
		},
		components: {
			topHeader,
			conHeader
		}
	}
</script>
<style lang="less" scoped>
	.tol {
		width: 100%;
	}
	
	.idPhotos {
		border-bottom: 1/100rem solid #BDBDBD;
		padding: 0 27/100rem;
		h4 {
			padding: 30/100rem 0 25/100rem;
			color: #BDBDBD;
			font-size: 32/100rem;
		}
		background-color: #fff;
		div {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-size: 32/100rem;
			color: #959595;
			h6 {
				padding: 0 30/100rem;
			}
			div {
				width: 280/100rem;
				height: 210/100rem;
				border: 1/100rem solid #BDBDBD;
			}
			div:last-child {
				border: 1/100rem dashed #BDBDBD;
			}
			.position {
				width: 95%;
				height: 98%;
				margin-left: 2%;
			}
			.file {
				opacity: 0;
				width: 100%;
				height: 100%;
			}
		}
		p {
			margin: 30/100rem 0 40/100rem;
			font-size: 24/100rem;
			color: #959595;
			text-align: left;
		}
	}
	
	.per-center {
		li {
			background-color: #fff;
			border-bottom: 1px solid #F1F1F1;
			height: 90/100rem;
			display: flex;
			align-items: center;
			font-size: 28/100rem;
			padding: 0 20/100rem;
			span {
				width: 100px;
				font-size: 32/100rem;
				color: #BDBDBD
			}
			input {
				width: 520/100rem;
				height: 90/100rem;
				border: 0;
				font-size: 28/100rem;
				padding-left: 30/100rem;
				box-sizing: border-box
			}
			div {
				font-size: 32/100rem;
				display: flex;
				align-items: center;
				color: #BDBDBD
			}
		}
		a {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.rightImg {
			margin-left: 20/100rem;
			width: 24/100rem;
			height: 44/100rem;
		}
	}
	
	button {
		margin: 45/100rem 20/100rem 25/100rem;
		height: 90/100rem;
		color: #fff;
		background-color: #D19E29;
		border-radius: 90/100rem;
		border: 0;
		width: 710/100rem;
		outline: none;
		font-size: 32/100rem
	}
	
	p {
		text-align: center;
		.reds {
			color: #FE0100
		}
	}
</style>