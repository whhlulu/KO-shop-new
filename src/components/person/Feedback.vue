<template>
    <div class="feedback-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <feedb-header :text="title" :set="true"></feedb-header>
        <div class="from-wrap">
            <div class="input-main clearfix" @click="add">
                <span class="fl name">反馈类型：</span>
                <span class="fr opin">{{fn}}</span>
            </div>
            <div class="fenge"></div>
            
            <div class="input-main clearfix">
                <span class="fl name">联系方式：</span>
                <input type="text" class="fl" placeholder="请输入手机号或邮箱等..." v-model="mobile">
            </div>
            <div class="fenge"></div>
            <div class="input-main clearfix">
                <span class="fl name">反馈内容：</span>
            </div>
            <textarea placeholder="请输入反馈内容..." v-model="con"></textarea>
        </div>

        <div class="btn-wrap">
            <button @click="submit">确认提交</button>
        </div>
        <!-- <Shopsn></Shopsn> -->
        <mt-popup
            v-model="popupVisible"
            position="bottom">
            <div id="listBtn" style="overflow:hidden">
                <button   @click.stop="btmValues(1)">取消</button>
                <button style="float:right"  @click.stop="btmValues(2)">确认</button>
            </div>
            <mt-picker  :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>

    import feedbHeader from '@/components/page/children/header.vue';
    import {Picker,Popup,Toast } from 'mint-ui';
    import qs from 'qs';
    // import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'Feedback',
        data(){
            return {
                title:'意见反馈',
                slots: [
                    {
                        // flex: 1,
                        values: ['功能意见', '页面意见', '你的新需求', '操作意见', '流量问题', '其他'],
                        // className: 'slot1',
                        // textAlign: 'center',
                    },
                     
                ],
                fn:'',
                popupVisible:false,
                status:'',
                mobile:'',
                con:'',
                btmValue:''
            }
        },
        methods:{
            btmValues(index){
                this.popupVisible =false;
                if(index == 2){
                     this.fn = this.btmValue[0]
                    this.status =  this.slots[0].values.indexOf(this.btmValue[0]);
                    if(this.status == -1){
                        this.fn = this.slots[0].values[2];
                         this.status =  2
                    }
                }
            },
           onValuesChange(picker, values ) {
                this.btmValue =values;
            },
            add(){
                this.popupVisible = true;
            },
            submit(){
                if(!this.fn){
                    Toast('请选择反馈类型');
                    return;
                }
                if(this.con == ''){
                    Toast('反馈内容不能为空');
                    return;
                }
                this.axios.post(this.$httpConfig.feedback, qs.stringify({
                    type:this.status,
                    tel:this.mobile,
                    content:this.con
                })).then((res) => {
                    if(res.data.status==10001){
                		this.$router.push('/LogIn');
                	}else{
                    Toast(res.data.message);
                   if(res.data.message == '提交成功!'){
                        this.$router.push('/person');
                   }
                 }
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        components:{
            feedbHeader,
            // Shopsn
        },
 
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
            
            textarea{
                padding:0 .2rem;
                height: 3.6rem;
                width: 710/100rem;
                resize:none;
                outline: none;
                padding-bottom:.2rem;
                font-size:.32rem;
                color:#333;
                border:0
            }
            .fenge{
                width:100%;
                height: 2/100rem;
                background-color:#F1F1F1;
            }
            .input-main{
                padding:0 .2rem;
                 width: 710/100rem;
                height: 1rem;
                line-height: 1rem; 
                .name{
                    font-size:.32rem;
                    color:#969696;
                }
                .opin{
                    font-size:.32rem;
                    color:#c3c3c3;
                    padding-right:1rem;
                }
                input{
                    width: 5.5rem;
                    height: 100%;
                    outline:none;
                    font-size:.32rem;
                    border:0;
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
                background: #D19E29;
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
#listBtn{
  z-index: 1;
  border-bottom: 1/100rem solid #ccc;
 button{
   background-color: #fff;
    margin: 20/100rem 40/100rem;
    border:0;
    color: #ff8000;
    button:last-child{
      float: right;
    }
    button:first-child{
      float: left;
    }
 }
}
</style>