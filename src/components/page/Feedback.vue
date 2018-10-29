<template>
    <div class="feedback-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <feedb-header :text="title" :set="true"></feedb-header>
        <div class="from-wrap">
            <div class="input-main clearfix" @click="add">
                <span class="fl name">反馈类型：</span>
                <span class="fr opin">{{fn}}</span>
            </div>
            <div class="input-main clearfix">
                <span class="fl name">联系方式：</span>
                <input type="text" class="fl" placeholder="请输入手机号或邮箱等..." v-model="mobile">
            </div>
            <div class="input-main clearfix">
                <span class="fl name">反馈内容：</span>
            </div>
            <textarea placeholder="请输入反馈内容..." v-model="con"></textarea>
        </div>

        <div class="btn-wrap">
            <button @click="submit">确认提交</button>
        </div>
        <Shopsn></Shopsn>
        <mt-popup
            v-model="popupVisible"
            position="bottom">
            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
    import feedbHeader from '@/components/page/children/header';
    import { Picker,Popup,Toast } from 'mint-ui';
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'Feedback',
        data(){
            return {
                title:'意见反馈',
                slots: [
                    {
                        flex: 1,
                        values: ['功能意见', '页面意见', '你的新需求', '操作意见', '流量问题', '其他'],
                        className: 'slot1',
                        textAlign: 'center'
                    }
                ],
                fn:'',
                popupVisible:false,
                status:'',
                mobile:'',
                con:''
            }
        },
        methods:{
            onValuesChange(picker, values){
                this.fn = values[0]
            },
            add(){
                this.popupVisible = true;
            },
            submit(){
                if(this.mobile == '' && this.con == ''){
                    Toast('联系方式，反馈内容不能为空');
                    return;
                }
                this.axios.post(API_URL + 'Home/Pcenter/feedback',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID'),
                    type:this.status,
                    tel:this.mobile,
                    content:this.con
                })).then((res) => {
                    Toast(res.data.msg);
                    this.$router.push('/person');
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        components:{
            feedbHeader,
            Shopsn
        },
        watch:{
            fn(val){
                switch(val){
                    case '功能意见':
                        this.status = 1;
                        break;
                    case '页面意见':
                        this.status = 2;
                        break;
                    case '你的新需求':
                        this.status = 3;
                        break;
                    case '操作意见':
                        this.status = 4;
                        break;
                    case '流量问题':
                        this.status = 5;
                        break;
                    case '其他':
                        this.status = 6;
                        break;
                }
            }
        }
    }
</script>
<style lang="less">
    .feedback-wrap{
        .mint-popup-bottom{
            width: 100%;
        }
    }
</style>
<style lang="less" scoped>
    .feedback-wrap{
        .from-wrap{
            background:#fff;
            padding:0 .2rem;
            textarea{
                height: 3.6rem;
                width: 100%;
                resize:none;
                outline: none;
                padding-bottom:.2rem;
                font-size:.32rem;
                color:#333;
            }
            .input-main{
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                .name{
                    font-size:.32rem;
                    color:#969696;
                }
                .opin{
                    font-size:.32rem;
                    color:#c3c3c3;
                    padding-right:.48rem;
                }
                input{
                    width: 5.5rem;
                    height: 100%;
                    outline:none;
                    font-size:.32rem;
                }
            }
            .input-main:nth-child(1){
                background:url(../../assets/btn-right.png) no-repeat 6.8rem center;
                background-size:.18rem .3rem;
            }
        }
        .btn-wrap{
            padding:.6rem .2rem;
            button{
                width: 100%;
                height: .9rem;
                background:#e02828;
                border:none;
                color:#fff;
                font-size:.32rem;
                outline: none;
            }
            button:active{
                box-shadow: 0 5px 5px #ccc;
            }
        }
    }
</style>