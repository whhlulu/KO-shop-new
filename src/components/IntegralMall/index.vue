<template>
    <div class="integral-wrap" ref="integral_list">
        <div v-title data-title="积分兑换">积分兑换</div>
        <integral-header :title="title" :popupVisible="popupVisible" @screen="screen"></integral-header>
        <list-lop :data="data" :integral="integral" :load="load"></list-lop>
        <mt-popup
            v-model="popupVisible"
            position="bottom">
            <div class="picker-toolbar">  
                <span class="mint-datetime-action mint-datetime-cancel" @click="cancel">取消</span>  
                <span class="mint-datetime-action mint-datetime-confirm" @click="determine">确定</span>  
              </div> 
            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>

        <Shopsn></Shopsn>
        <to-top></to-top>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import integralHeader from '@/components/page/children/header.vue';
    import listLop from '@/components/Widget/searchList';
    import Shopsn from '@/components/page/Shopsn.vue';
    import toTop from '@/components/page/toTop.vue';
    import qs from 'qs';
    import { Popup,Picker,Field } from 'mint-ui';
    
    export default {
        name : 'IntegralMall',
        data(){
            return {
                title:'积分筛选',
                num:'',
                data:[],
                integral:'',
                popupVisible:false,
                load:false,
                load_wrap:'load_wrap',
                slots: [
                    {
                        flex: 1,
                        values: ['1-999', '1000-1999', '2000-2999', '3000-3999', '4000-4999', '5000-5999','6000-6999','7000-7999','8000-8999','9000-9999'],
                        className: 'slot1',
                        textAlign: 'right'
                    }
                ],
                isactive: '',
                slide_switch: false, //避免多次下拉
                load_show: true, //滚动动画
                roll_switch: true, //触发下拉加载开关
                no_data: false, //第一次没数据时的样式
                sliding_no_data: false, //下拉没数据时的样式
                page: 1,
                intergral_lower: '',
                intergral_upper: ''
            }
        },
        methods: {
            onValuesChange(picker, values) {
                this.num = values[0];
            },
            cancel(){
                this.popupVisible = false;
            },
            determine(){
                this.popupVisible = false;
                this.load = true;
                var data = this.num.split('-');
                this.intergral_lower = data[0];
                this.intergral_upper = data[1];
                this.integralGoodsList()
            },
            screen(){
                this.popupVisible = true;
            },
            integralGoodsList(){
                this.axios({
	                method:'get',
	                url:this.$httpConfig.integralGoodsList,
	                params:{
	                    intergral_lower:this.intergral_lower,
	                    intergral_upper:this.intergral_upper,
	                    page:this.page
	                }
	            }).then((res) => {
	                if(res.data.status==10001){
	                		this.$router.push('/LogIn');
	                }else{
                    	this.stateHandling(res.data.status, res.data.data.records);
		                this.integral = true;
		                this.load_wrap = false;
		                this.load = false;
	                }
	            }).catch((err) => {
	                console.log(err);
	            })
            },
            //请求成功后的操作
            returnOperation(data) {
                if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
				}
					for (let index = 0; index < data.length; index++) {
						this.data.push(data[index]);
					}
                this.slide_switch = true;
            },
            //请求后返回不同状态时的处理
            stateHandling(status, data) {
                this.sw = true;
                if (status == 10001) {
                    this.$router.push('/LogIn');
                } else if (status == 1) { //成功后的处理
                    this.returnOperation(data);
                } else if (status == 0 && this.page == 1) { //第一次请求失败时
                    this.no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                } else { //第二次或更多次无数据时
                    this.sliding_no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                }
            },
        },
        mounted(){
            this.integralGoodsList();

            let _this = this;
            window.addEventListener('scroll', function () {
                if (!_this.$refs.integral_list) return;
                if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                    //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                    if (_this.roll_switch == false) {
                        return;
                    }
                    if (_this.slide_switch == true) {
                        _this.slide_switch = false;
                        _this.page++;
                        _this.integralGoodsList();
                    }
                }
            })
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        components:{
            integralHeader,
            listLop,
            Shopsn,
            toTop
        }
    }
</script>
<style lang="less">
    .integral-wrap{
        .mint-popup-bottom{
            width: 100%;
            .picker{
                .picker-items{
                    text-align:center;
                    .picker-slot.picker-slot-right{
                        text-align:center;
                    }
                }
            }
        }
    }
</style>