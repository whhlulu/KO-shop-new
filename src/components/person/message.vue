<template>
    <div class="feedback-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <feedb-header :text="title" :set="true"></feedb-header>
        <div class="from-wrap"> 
            <div class="input-main clearfix">
                <span class="fl name">在线留言：</span>
            </div>
            <textarea placeholder="请输入留言内容..." v-model="con"></textarea>
            <p class="Logo">{{text}}/500</p>
        </div>

        <div class="btn-wrap">
            <button @click="submit">确认提交</button>
        </div>
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
                title:'在线留言',
                con:'',
                btmValue:'',
                text:0
            }
        },
        watch: {
            con:function(){
                this.text = this.con.length;
            }
        },
        methods:{
        	submit(){
        		if(this.con==''){
        			Toast({
        				message:'留言不能为空'
                    });
                    return;
        		}
        		this.axios.post(this.$httpConfig.onlineMessage, qs.stringify({
                    question:this.con
                })).then((res) => {
                    if(res.data.status==10001){
                		this.$router.push('/LogIn');
                	}else{
                		setTimeout(function() {
					    }, 5000);
                		Toast(res.data.message);
                		this.$router.push('/customer')
                    	
                 	}
                }).catch((err) => {
                    console.log(err);
                });
        	}
        },
        components:{
            feedbHeader,
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
            position: relative;
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
                    left: 0;
                }
            }
            .Logo{
                padding:.2rem;
                font-size:.32rem;
                color:#c3c3c3;
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
</style>