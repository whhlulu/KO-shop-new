<template>
	<div>
		<div v-title data-title="我要开店">我要开店</div>
		<top-header :text="title"></top-header>
		<con-header :text="text[0]"></con-header>
		<ul class="per-center">
			<li>
				<span class="span"> 店铺名称</span><input type="text" placeholder="请输入店铺名称..." v-model="store_name">
			</li>
			<li>
				<span class="span"> 公司名称</span><input type="text" placeholder="请输入公司名称..." v-model="company_name">
			</li>
			<li @click="callingArea">
				<!-- <a href="javascript:;">-->
				<span class="span"> 所在地区:</span>
				<input type="text" v-model="data.addressAll" disabled placeholder="请选择所在地址...">
				<img class="rightImg" src="../../../assets/images/right-icon.png" alt="">
				<!--</a>-->
			</li>
			<li>
				<span class="span"> 详细地址:</span><input type="text" placeholder="请输入详细地址..." v-model="address">
			</li>
			<li>
				<span class="span"> 公司电话:</span><input type="tel" placeholder="请输入公司电话..." v-model="company_mobile">
			</li>
			<li>
				<span class="span"> 注册资金:</span><input type="tel" placeholder="请输入注册资金..." v-model="registered_capital">
			</li>
			<li>
				<span class="span"> 联系人姓名:</span><input type="text" placeholder="请输入真实姓名" v-model="name">
			</li>
			<li>
				<span class="span"> 联系人手机:</span><input type="tel" placeholder="请输入联系人电话..." v-model="mobile"  oninput="if(value.length > 11)value=value.slice(0, 11)">
			</li>
		</ul>
		<mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress">确定</span>
			</div>
			<div class="select">
				<ul class="address-area-tit">
					<li v-model="prov" :class="showProvince?'active':''" @click="selectedArea('province')">
						{{ province }}</li>
					<li v-model="Bcity" v-if="choiceCity" :class="showCity?'active':''" @click="selectedArea('city')">
						{{ city }}</li>
					<li v-model="district" v-if="choiceArea" @click="selectedArea('area')" :class="showArea?'active':''">
						{{ area }}</li>
					<li v-model="Township" v-if="choiceStreet" :class="showStreet?'active':''">
						{{ street }}</li>
				</ul>
				<ul class="address-city" v-if="showProvince">
					<li v-for="(n, i) in addressPlace" :key="i" @click="getProvince(n.id, n.name, i)" :class="i==provinceIndex?'selected-li':''">
						{{ n.name }}</li>
				</ul>
				<ul class="address-city" v-if="showCity">
					<li v-for="(n, i) in cityArr" :key="i" @click="getCity(n.id, n.name, i)" :class="i==cityIndex?'selected-li':''">
						{{ n.name }}</li>
				</ul>
				<ul class="address-city" v-if="showArea">
					<li v-for="(n, i) in districtArr" :key="i" @click="setCityEnd(n.id, n.name, i)" :class="i==areaIndex?'selected-li':''">{{ n.name }}</li>
				</ul>
				<ul class="address-city" v-if="showStreet">
					<li v-for="(n, i) in TownshipArr" :key="i" @click="setStreetEnd(n.id, n.name, i)" :class="i==streetIndex?'selected-li':''">{{ n.name }}</li>
				</ul>
			</div>
		</mt-popup>
		<button @click="nextinfor">提交以上信息，并填写下一页</button>
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
				title: '填写入驻资料',
				text: ['开户银行信息'],
				store_name:'',
				company_name: "",
				company_mobile: "",
				registered_capital: "",
				name: '',
				mobile: "",
				address: '',
				popupVisible: false,
				popup: false,
				prov: '',
				cityArr: '',
				Bcity: '',
				district: '',
				districtArr: '',
				Township: '',
				TownshipArr: '',
				addressPlace: '',
				data: {
					name: '',
					phone: '',
					address1: '',
					addressAll: '',
					addAll: '',
					Det: '',
					addressa: '',
					value: 0
				},
				choiceProvince: false, //省按钮的显示隐藏
				choiceCity: false, // 市按钮的显示隐藏
				choiceArea: false, // 区按钮的显示隐藏
				choiceStreet: false,
				province: '请选择', // 选中的省
				city: '请选择', // 选中的市
				area: '请选择', // 选中的区
				street: '请选择', //选中的街道
				showProvince: true, // 省选择的显示隐藏
				showCity: false, // 市选择的显示隐藏
				showArea: false, // 区选择的显示隐藏
				showStreet: false, //街道的显示隐藏
				provinceId: '', // 选中的省id
				cityId: '', // 选中的市id
				areaId: '', // 选中的区id
				selected: false, // 选中的那个项
				provinceIndex: -1, // 选中态索引
				cityIndex: -1,
				areaIndex: -1,
				streetIndex: -1,
				choiceAreaCon: '请选择地区',
				shopInfo:{}
			}
		},
		components: {
			topHeader,
			conHeader
		},
		created(){
			this.proAjax(0, 0);
			if(sessionStorage.getItem('admissionInfo')){
				this.shopInfo =  JSON.parse(sessionStorage.getItem('admissionInfo'));
				this.store_name = this.shopInfo.store_name;
				this.company_name = this.shopInfo.company_name;
				this.data.addressAll = sessionStorage.getItem('kd_address');
				this.provinceId = this.shopInfo.prov_id;
				this.cityId	= this.shopInfo.city;
				this.areaId	= this.shopInfo.dist;
				this.address = this.shopInfo.address;
				this.company_mobile = this.shopInfo.company_mobile;
				this.registered_capital = this.shopInfo.registered_capital;
				this.name = this.shopInfo.name;
				this.mobile = this.shopInfo.mobile;
			}
		},
		methods: {
			nextinfor: function() {
				if(!this.store_name){
					Toast({
						message: '请填写公司名称',
						duration: 1000
					});
					return;
				}
				if(!this.company_name){
					Toast({
						message: '请填写公司名称',
						duration: 1000
					});
					return;
				}
				if(!this.address){
					Toast({
						message: '请填写详细地址',
						duration: 1000
					});
					return;
				}
				if(!(/^((0\d{2,3}-?)?\d{7,8}|(1[3584]\d{9}))$/.test(this.company_mobile))){
					Toast({
						message: '请填写正确的电话',
						duration: 1000
					});
					return;
				}
				if(!this.registered_capital){
					Toast({
						message: '请填写正确注册资金',
						duration: 1000
					});
					return;
				}
				if(!this.name){
					Toast({
						message: '请填写联系人名称',
						duration: 1000
					});
					return;
				}
				if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.mobile))){
					Toast({
						message: '请填写正确的手机号',
						duration: 1000
					});
					return;
				}
						this.shopInfo.store_name = this.store_name;
						this.shopInfo.company_name = this.company_name;
						this.shopInfo.prov_id = this.provinceId;
						this.shopInfo.city = this.cityId;
						this.shopInfo.dist = this.areaId;
						this.shopInfo.address = this.address;
						this.shopInfo.company_mobile = this.company_mobile;
						this.shopInfo.registered_capital = this.registered_capital;
						this.shopInfo.name = this.name;
						this.shopInfo.mobile = this.mobile;
						sessionStorage.setItem('admissionInfo',JSON.stringify(this.shopInfo));
						sessionStorage.setItem('kd_address',this.data.addressAll);
						this.$router.push({
							name: "companyPhotos"
						})
			},
			callingArea() {
				this.popupVisible = true;
			},
			cancleaddress() {
				this.popupVisible = false;
			},
			callingadd() {
				this.popup = true;
			},
			selectaddress() {
				this.popupVisible = false;
				if(this.province==""||this.province=="请选择") {
					Toast({
						message: '请选择地址',
						duration: 1000
					});
				} else if(this.city==""||this.city=="请选择"){
					Toast({
						message: '请选择地址',
						duration: 1000
					});
				}else if(this.area==""||this.area=="请选择" ){
					Toast({
						message: '请选择地址',
						duration: 1000
					});
				}else{
					this.data.addressAll = this.province + '-' + this.city + '-' + this.area;
					this.choiceCity=false;// 市按钮的显示隐藏
					this.choiceArea=false; // 区按钮的显示隐藏
					this.choiceStreet=false;
					this.choiceProvince=true; // 省按钮的显示隐藏
					this.showStreet = false;
					this.showProvince=true;
					this.province="请选择"
				}
				
			},
			proAjax(index, selId) {
				this.axios({
						method: 'get',
						url: this.$httpConfig.cityList,
						params: {
							parent_id: index,
							id: ""
						}
					})
					.then((res) => {
						let data = res.data.data;
						if(selId == 0) {
							this.addressPlace = data;
						} else if(selId == 1) {
							this.cityArr = data;
						} else if(selId == 2) {
							this.districtArr = data;
						} else if(selId == 3) {
							this.TownshipArr = data;
						}
					}).catch((err) => {
						console.log(err);
					});
			},
			selectedArea(type) { // 按钮点击
				if(type == "province") {
					this.cityIndex = -1;
					this.areaIndex = -1;
					this.streetIndex = -1

					this.choiceCity = false;
					this.choiceArea = false;
					this.choiceStreet = false,

					this.showProvince = true;
					this.showCity = false;
					this.showArea = false;
					this.showStreet = false;

				} else if(type == "city") {
					this.cityIndex = -1;
					this.areaIndex = -1;
					this.streetIndex = -1
					this.choiceArea = false;
					this.choiceStreet = false;

					this.showProvince = false;
					this.showCity = true;
					this.showArea = false;
					this.showStreet = false;
				} 
			},

			getProvince(id, name, index) {
				this.Bcity = '请选择', // 选中的市
				this.area = '请选择', // 选中的区
				this.city = '请选择';
				this.choiceCity = true;
				this.province = name;
				this.provinceId = id;
				this.showProvince = false;
				this.showCity = true;
				this.showArea = false;
				this.showStreet = false;
				this.cityArr = this.proAjax(this.provinceId, 1);
			},
			getCity(id, name, index) { // 获取城市列表
				this.area = '请选择', // 选中的区
				this.choiceArea = true;
				this.city = name;
				this.cityId = id;
				this.showProvince = false;
				this.showCity = false;
				this.showArea = true;
				this.showStreet = false;
				this.districtArr = this.proAjax(this.cityId, 2);
			},
			setCityEnd(id, name, index) { // 区点完以后
				this.area = name;
				this.areaId = id;
			},
		},
	}
</script>
<style lang="less" scoped>
	.per-center {
		li {
			background-color: #fff;
			border-bottom: 1px solid #F1F1F1;
			height: 90/100rem;
			display: flex;
			align-items: center;
			font-size: 28/100rem;
			padding: 0 20/100rem;
			.span {
				width: 100px;
				font-size: 32/100rem;
				color: #BDBDBD
			}
			input {
				width: 520/100rem;
				height: 90/100rem;
				border: 0;
				background: #fff;
				font-size: 28/100rem;
				padding-left: 30/100rem;
				box-sizing: border-box
			}
			
		}
		li:nth-of-type(2) input{padding-left: 35/100rem;}
		a {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.rightImg {
			width: 24/100rem;
			height: 44/100rem;
		}
	}
	.mint-datetime-action{
		color: #ff8000;
	}
	button {
		margin: 75/100rem 20/100rem 0;
		height: 90/100rem;
		color: #fff;
		background-color: #D19E29;
		border-radius: 90/100rem;
		border: 0;
		width: 710/100rem;
		outline: none;
		font-size: 32/100rem
	}
	
	.mint-popup-bottom {
		width: 100%;
		padding: .2rem;
		height:7rem;
		box-sizing: border-box;
		.select {
			padding: .2rem 0;
			select {
				padding-left: 10/100rem;
				border: 1/100rem solid #d9d9d9;
				width: 24%;
				height: .5rem;
				background: #fff;
				outline: none;
				option {
					color: #333;
					text-align: center;
				}
			}
		}
	}
	
	#address-mask {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		position: absolute;
		left: 0;
		top: 0;
	}
	
	#address-area {
		width: 100%;
		height: 320px;
		overflow: hidden;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #fff;
		box-shadow: 0 -4px 7px rgba(255, 255, 255, .6);
	}
	
	.address-area-tit {
		border-bottom: 1px solid #ccc;
		line-height: 40px;
		box-shadow: 0px 1px 2px rgba(23, 43, 135, .2);
	}
	
	#address-mask ul,
	li {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.address-area-tit {
		padding: 0;
		box-shadow: none;
		margin-bottom:0.2rem;
		border-bottom: 0;
		height: 41px;
	}
	
	.address-area-tit li {
		cursor: pointer;
		position: relative;
		left: 0;
		top: 1px;
		height: 40px;
		padding: 0 .2rem;
		width: 24%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		font-size: 12px;
		display: inline-block;
		border-bottom: 1px solid #ccc;
	}
	
	.address-area-tit li.active {
		border-bottom: 1px solid #ff8000;
		color: #ff8000;
	}
	
	.address-city {
		margin-top: 10px;
		height: 4.5rem;
		overflow: hidden;
		overflow-y: scroll;
		width: calc(100% + 30px);
	}
	
	.address-city li {
		padding: 0 35px;
		line-height: 30px;
		font-size: 12px;
		cursor: pointer;
	}
	
	.address-city li.selected-li {
		color: #ff8000;
	}
</style>