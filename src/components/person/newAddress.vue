<template>
    <div class="edit-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <edit-header :text="title" :btn="btn" :id="$route.params.status"></edit-header>
        <div class="form-wrap">
            <mt-field label="收货人：" placeholder="请输入收货人姓名" v-model="data.realname"></mt-field>
            <mt-field label="手机号：" placeholder="请输入手机号" type="number" v-model="data.mobile"></mt-field>
            <div class="mint-cell mint-field">
                <span class="mint-cell-title mint-cell-text">所在地区：</span>
                <div class="mint-cell-value" @click="callingArea">
                    <input placeholder="请选择地区" type="tel" class="mint-field-core" disabled v-model="data.addressAll">
                    <span class="mint-field-state is-default"><i class="mintui mintui-field-default"></i></span>
                    <div class="mint-field-other"></div>
                </div>
            </div>
            <mt-field label="详细地址：" placeholder="请输入详细地址" v-model="data.address"></mt-field>
            <div class="fenge"></div>
            <div class="fenge"></div>
           <div class="defaultAdd" @click="defaultChange">
               <span>设为默认地址</span><img :src="imgok" v-if="data.value ==1" alt=""><div v-else></div>
           </div>
            <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">  
                <div class="picker-toolbar">  
                    <span class="mint-datetime-action mint-datetime-cancel" style="color:#ff8000;" @click="cancleaddress">取消</span>  
                    <span class="mint-datetime-action mint-datetime-confirm" style="color:#ff8000;" @click="selectaddress">确定</span>  
                </div>  
                <div class="select">
				<ul class="address-area-tit">
                        <li 
                        	v-model="prov"
                            :class="showProvince?'active':''" 
                            @click="selectedArea('province')">
                            {{ province }}</li>
                        <li  
                        	v-model="Bcity"
                            v-if="choiceCity" 
                            :class="showCity?'active':''"
                            @click="selectedArea('city')">
                            {{ city }}</li>
                        <li  
                        	v-model="district"
                            v-if="choiceArea" 
                            :class="showArea?'active':''">
                        {{ area }}</li>
                    </ul>
                    <ul class="address-city" v-if="showProvince">
                        <li 
                            v-for="(n, i) in addressPlace" 
                          	@click="getProvince(n.id, n.name, i)" 
                            :class="i==provinceIndex?'selected-li':''"
                            :key="i">
                            {{ n.name }}</li>
                    </ul>
                    <ul class="address-city" v-if="showCity">
                        <li 
                            v-for="(n, i) in cityArr" 
                        	 @click="getCity(n.id, n.name, i)" 
                            :class="i==cityIndex?'selected-li':''"
                            :key="i">
                        {{ n.name }}</li>
                    </ul>
                    <ul class="address-city" v-if="showArea">
                        <li 
                            v-for="(n, i) in districtArr" 
                      		@click="setCityEnd(n.id, n.name, i)" 
                            :class="i==areaIndex?'selected-li':''"
                            :key="i"
                        >{{ n.name }}</li>
                    </ul>
			</div>
            </mt-popup>
        </div>
        

        <footer-btn :text="footBnt" :id="$route.params.status" :to="'/newaddress' " :data="data" :province="provinceId" :street ='streetId' :city="cityId" :area="areaId"></footer-btn>

    </div>
</template>
<script>
    import EditHeader from '@/components/page/children/header.vue';
    import FooterBtn from '@/components/Widget/fixedBtn';
    import { Field,Popup,Radio,Toast } from 'mint-ui';
    import QS from 'qs';
    export default {
        name : 'EditDelAddress',
        data(){
            return {
                imgok:require('@/assets/images/ok.png'),

                title : '新增收货地址',
                btn:' ',
                btnDel:true,
                footBnt:'保存',
                popupVisible:false,
                popup:false,
                addressPlace:'',
                prov:'',
                cityArr:'',
                district:'',
                districtArr:'',
                Township:'',
                TownshipArr:'',
                data:{
                    name:'',
                    phone:'',
                    address1:'',
                    addressAll:'',
                    addAll:'',
                    Det:'',
                    addressa:'',
                    value:0
                },
                isArea: false,  // 选择窗口显示隐藏
                choiceProvince: false, // 省按钮的显示隐藏
                choiceCity: false, // 市按钮的显示隐藏
                choiceArea: false, // 区按钮的显示隐藏
                choiceStreet:false,
                province: '请选择',    // 选中的省
                city: '请选择', // 选中的市
                area: '请选择', // 选中的区
                street:'请选择',//选中的街道
                showProvince: true, // 省选择的显示隐藏
                showCity: false, // 市选择的显示隐藏
                showArea: false, // 区选择的显示隐藏
                showStreet:false,//街道的显示隐藏
                provinceId: '', // 选中的省id
                cityId: '', // 选中的市id
                areaId: '', // 选中的区id
                streetId:'',
                selected: false, // 选中的那个项
                provinceIndex: -1, // 选中态索引
                cityIndex: -1,
                areaIndex: -1,
                streetIndex:-1,
                choiceAreaCon:'请选择地区'
            }
        },
        methods:{
        	//保存收货地址
            // 默认地址
            defaultChange(){
                if(this.data.value ==0){
                    this.data.value =1
                }else{
                    this.data.value =0
                }
            },
            callingArea(){
                this.popupVisible = true;
            },
            cancleaddress(){
                this.popupVisible = false;
            },
            callingadd(){
                this.popup = true;
            },
            selectaddress() {
							this.popupVisible = false;
							if(this.province==""||this.province=="请选择") {
								Toast('请选择地址');
							} else if(this.city==""||this.city=="请选择"){
								Toast('请选择地址');
							}else if(this.area==""||this.area=="请选择" ){
								Toast('请选择地址');
							}else{
								this.data.addressAll = this.province + '-' + this.city + '-' + this.area;
								this.choiceCity=false;// 市按钮的显示隐藏
								this.choiceArea=false; // 区按钮的显示隐藏
								this.choiceStreet=false;
								this.choiceProvince=true; // 省按钮的显示隐藏
								this.showStreet = false;
                                this.showProvince=true;
                                this.showCity = false; 
                                this.showArea = false;
								this.province="请选择"
							}
			},
			proAjax(index, selId) {
					this.axios({
							method: 'get',
							url: this.$httpConfig.cityList,
							params: {
								parent_id: index,
								id: ''
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
                    if (type == "province") {
                        this.cityIndex = -1;
                        this.areaIndex = -1;
                        this.streetIndex=-1
                        
                        this.choiceCity = false;
                        this.choiceArea = false;
                        this.choiceStreet=false,
                        
                        this.showProvince = true;
                        this.showCity = false;
                        this.showArea = false;
                        this.showStreet=false;
                       
                    } else if (type == "city") {
                        this.cityIndex = -1;
                        this.areaIndex = -1;
                        this.streetIndex=-1
                        this.choiceArea = false;
                        this.choiceStreet=false;
                        
                        this.showProvince = false;
                        this.showCity = true;
                        this.showArea = false;
                        this.showStreet=false;
                    } 
                },
             
             getProvince (id, name, index) {
                    this.Bcity = '请选择'; // 选中的市
                    this.area = '请选择';// 选中的区
                    this.city = '请选择';
                    this.choiceCity = true;
                    this.province = name;
                    this.provinceId = id;
                    this.showProvince = false;
                    this.showCity = true;
                    this.showArea = false;
                    this.showStreet=false;
                    this.cityArr = this.proAjax(this.provinceId, 1);
                },
            getCity (id, name, index) { // 获取城市列表
                    this.area = '请选择', // 选中的区
                    this.choiceArea = true;
                    this.city = name;
                    this.cityId = id;
                    this.showProvince = false;
                    this.showCity = false;
                    this.showArea = true;
                    this.showStreet=false;
                    this.districtArr = this.proAjax(this.cityId, 2);
                },
            setCityEnd(id, name, index) { // 区点完以后
                    this.area = name;
                    this.areaId = id;
                },
            setStreetEnd(id, name, index) {
            	this.street=name
            }
        },
        mounted(){
          this.proAjax(0, 0)
        },
        components:{
            EditHeader,
            FooterBtn
        }
    }
</script>
<style lang="less">
.fenge{
    width: 100%;
    height: 1/100rem;
    background-color: #d9d9d9;
}
    .edit-wrap{
        .mint-popup-bottom{
            width: 100%;
            padding:.2rem;
            box-sizing: border-box;
            .select{
                padding:.2rem 0;
                select{
                    padding-left:10/100rem;
                    border: 1/100rem solid #d9d9d9;
                    width: 24%;
                    height: .5rem;
                    background:#fff;
                    outline: none;
                    option{
                        color:#333;
                        text-align: center;
                    }
                }
            }
        }
        div.mint-field{
            border-top:1px solid #d9d9d9;
            padding:0 .2rem;
        }
        .mint-radiolist-title{
            margin:0;
        }
        .mint-radiolist-label{
            padding:0;
        }
        .mint-radio-label{
            font-size:.29rem;
            color:#999;
        }
        .mint-field{
            height: 1rem;
            line-height:1rem;
            background:#fff;
            .mint-cell-text{
                font-size:.3rem;
                color:#999;
            }
            .mint-cell-value{
                font-size:.32rem;
                color:#333;
                input{
                    background:#fff;
                }
            }
        }
    }
     .defaultAdd{
        height: 95/100rem;
        background:#fff;
        border-bottom:1/100rem solid #d9d9d9;
        display: flex;
        justify-content:space-between;
        align-items: center;
        padding:0 20/100rem;
        
        color: #999;
        span{
            font-size: 30/100rem;
        }
        div{
            width: 0.46rem;
            height: 0.46rem;
            border-radius: 50%;
            border: 1px solid #999;
        }
        img{
              width: 50/100rem;
            height: 50/100rem;
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
       
       #address-mask  ul, li {
            list-style: none;
            padding: 0;
            margin: 0;
           
			
        }
        .address-area-tit {
            padding: 0;
            box-shadow: none;
            border-bottom: 0;
            height:41px;
        }
        .address-area-tit li {
            cursor: pointer;
            position: relative;
            left: 0;
            top: 1px;
            padding: 0 .2rem;
            height:40px;
            width: 24%;
             overflow: hidden;
			text-overflow:ellipsis;
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
            height:4.5rem;
            overflow: hidden;
            overflow-y: scroll;
            width: calc(100% + 30px);

        }
        .address-city li{
            padding: 0 35px;
            line-height: 30px;
            font-size: 12px;
            cursor: pointer;
        }
        .address-city li.selected-li {
            color: #ff8000;
        }
</style>
