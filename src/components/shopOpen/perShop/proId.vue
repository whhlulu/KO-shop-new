<template>
	<div v-loading="loading"  element-loading-text="上传中……" element-loading-background="hsla(0,0%,100%,.9)">
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
					<input type="file" @change="addImg($event)" v-if="!idcard_positive" class="file" />
					<img :src="URL + idcard_positive" class="position" v-show="idcard_positive" @click="catchs">
				</div>
				<!-- <h6>示例</h6>
				<div></div> -->
			</div>
			<p>图片建议使用4：3比例尺寸建议为1200*900像素jpg,gif,png格式的图片，并且图片大小不可超过1M</p>
		</div>
		<div class="idPhotos">
			<h4>身份证反面：</h4>
			<div>
				<div>
					<input type="file" @change="imgChanges($event)" v-if="!other_side" class="file" />
					<img :src="URL + other_side" class="position" v-show="other_side" @click="cotch">
				</div>
				<!-- <h6>示例</h6>
				<div></div> -->
			</div>
			<p>图片建议使用4：3比例尺寸建议为1200*900像素jpg,gif,png格式的图片，并且图片大小不可超过1M</p>
		</div>
		<button @click="nextinfor">下一步</button>
		<p>
			<span class="reds">*</span> 您提供的身份信息，网站将予以保护，不会挪作他用</p>
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
			card: '',
			popupVisible: false,
			type: ["中国大陆", '港澳', '中国台湾'],
			card: '',
      loading: false
		}
	},
	created(){
			if(sessionStorage.getItem('admissionInfo')){
				let shopInfo =  JSON.parse(sessionStorage.getItem('admissionInfo'));
				this.idcard_positive = shopInfo.idcard_positive;
				this.other_side = shopInfo.other_side;
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
			this.other_side = "";
		},
		catchs() {
			this.idcard_positive = "";
		},
		addImg(e) {
      this.loading = true;
			var that = this;
			var file = e.target.files[0];
				//图片大小设置
			var fileSize = 0;
			if(!e.target.files) {
				var filePath = e.target.value;
				var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
				var file = fileSystem.GetFile(filePath);
				fileSize = file.Size;
			} else {
				fileSize = e.target.files[0].size;
			}
			var size = fileSize / 1024;
			if(size > 1000) {
				this.loading = false;
				Toast("附件不能大于1M");
				e.target.value = "";
				return
			}
			let param = new FormData() // 创建form对象
			param.append('adv_content', file, file.name) // 通过append向form对象添加数据
			param.append('chunk', '0') // 添加form表单中其他数据
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			this.axios.post(this.$httpConfig.uploadImage, param, config)
				.then((res) => {
					this.loading = false;
					if (res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						if (res.data.status === 1) {
							this.idcard_positive = res.data.data;
							Toast({
										message: res.data.message,
										duration: 1000
								});
						} else {
							Toast({
									message: res.data.message,
									duration: 1000
							});;
						}
					}
				})
		},
		imgChanges(e) {
      this.loading = true;
			var that = this;
			var file = e.target.files[0];
			//图片大小设置
			var fileSize = 0;
			if(!e.target.files) {
				var filePath = e.target.value;
				var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
				var file = fileSystem.GetFile(filePath);
				fileSize = file.Size;
			} else {
				fileSize = e.target.files[0].size;
			}
			var size = fileSize / 1024;
			if(size > 1000) {
				this.loading = false;
				Toast("附件不能大于1M");
				e.target.value = "";
				return
			}
			let param = new FormData() // 创建form对象
			param.append('adv_content', file, file.name) // 通过append向form对象添加数据
			param.append('chunk', '0') // 添加form表单中其他数据
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			this.axios.post(this.$httpConfig.uploadImage, param, config)
				.then((res) => {
					this.loading = false;
					if (res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						if (res.data.status === 1) {
							this.other_side = res.data.data
							Toast({
									message: res.data.message,
									duration: 1000
							});
						} else {
							Toast({
									message: res.data.message,
									duration: 1000
							});
						}
					}
				})
		},

		nextinfor: function () {
			if (!this.card) {
				Toast({
						message: '请选择身份证类型',
						duration: 1000
					});
				return;
			}else if (!this.idcard_positive) {
				Toast({
						message: '请上传身份证正面照片',
						duration: 1000
					});
				return;
			}else if (!this.other_side) {
				Toast({
						message: '请上传身份证反面照片',
						duration: 1000
					});
				return;
			}else{
				if(sessionStorage.getItem('admissionInfo')){
					let shopInfo =  JSON.parse(sessionStorage.getItem('admissionInfo'));
					shopInfo.idcard_positive = this.idcard_positive;
					shopInfo.other_side = this.other_side;
					sessionStorage.setItem('admissionInfo',JSON.stringify(shopInfo));
						this.axios.post(this.$httpConfig.personEnter, QS.stringify(
							shopInfo
						)).then((res) => {
							if (res.data.status == 10001) {
								this.$router.push('/LogIn');
							} else {
								Toast({
									message: res.data.message,
									duration: 1000
								});
								if (res.data.status == 1) {
									this.$router.push({
										name: "checkProBusinessInfor"
									})
								}
							}
						}).catch((err) => {
							console.log(err)
						});
				}else{
					Toast({
						message: '入驻信息错误',
						duration: 1000
					});
				}
			}	
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
  border-bottom: 1/100rem solid #bdbdbd;
  padding: 0 27/100rem;
  h4 {
    padding: 30/100rem 0 25/100rem;
    color: #bdbdbd;
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
      border: 1/100rem solid #bdbdbd;
    }
    div:last-child {
      border: 1/100rem dashed #bdbdbd;
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
    border-bottom: 1px solid #f1f1f1;
    height: 90/100rem;
    display: flex;
    align-items: center;
    font-size: 28/100rem;
    padding: 0 20/100rem;
    span {
      width: 100px;
      font-size: 32/100rem;
      color: #bdbdbd;
    }
    input {
      width: 520/100rem;
      height: 90/100rem;
      border: 0;
      font-size: 28/100rem;
      padding-left: 30/100rem;
      box-sizing: border-box;
    }
    div {
      font-size: 32/100rem;
      display: flex;
      align-items: center;
      color: #bdbdbd;
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
  background-color: #d19e29;
  border-radius: 90/100rem;
  border: 0;
  width: 710/100rem;
  outline: none;
  font-size: 32/100rem;
}

p {
  text-align: center;
  .reds {
    color: #fe0100;
  }
}
</style>