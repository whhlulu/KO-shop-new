<template>
    <div class="logoin-main">
        <div v-title data-title="短信登录">{{title}}</div>
        <header class="logoIn-header">
           <span @click="remove" class="btn-back">取消</span>{{title}}
        </header>
        <div class="logo"></div>
        <div class="from">
            <div class="input-main phone-number">
                <span class="icon"></span>
                <input type="number" v-model="userName" oninput = "if(value.length>11)value = value.slice(0,11)" placeholder="邮箱/用户名/已验证手机">
            </div>
            <div class="input-main passWord">
                <span class="icon"></span>
                <input type="password" placeholder="请输入密码...." v-model="passWord">
            </div>
            <button class="btn-in" @click="logoIn">登&nbsp;&nbsp;录</button>
        </div>
        <ul class="fail-link clearfix">
            <li class="fl" @click="goNow">还没有账号？<span>快速注册</span></li>
        </ul>
        <div class="ftPassword">
            <span @click="tologoIn">忘记密码？</span>
        </div>
    </div>
</template>
<script>
import {Toast} from 'mint-ui';
    export default {
        name : 'logoIn',
        data(){
            return {
                title:this.$constant.mainTitle+'登录绑定',
                show:true,
                userName:'',
                passWord:'',
                isActive:false,
                message:'',
                btnText:'获取验证码',
                scrollWatch:true
            }
        },
        components:{
            
        },
        methods:{
            mounted() {
                document.body.scrollTop = 0;
            },
            destroyed(){
                this.scrollWatch = false;
            },
            remove:function(){//路由回退一步
                this.$router.go(-1)
            },
            logoIn:function(){//帐户名密码是否正确如果正确跳转主页
                if(this.userName == ''){
                    Toast({
                        message: '账号不能为空',
                        position: 'top',
                        duration: 1000
                    });
                    return false;
                }
                if(this.passWord.length >16 || this.passWord.length<6){
                    Toast('请您输入6-16位的密码');
                    return false;
                }
                this.show = false;
            },
            goNow:function(){//跳转注册页
                this.$router.push({
                    path : '/Register'
                });
            },
            tologoIn:function(){//忘记密码
                this.$router.push({
                    path : '/bachWord'
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .logoin-main{
        padding:0 .6rem;
        .logoIn-header{
            width:100%;
            height:.9rem;
            line-height:.9rem;
            text-align:center;
            font-size:.36rem;
            color:#333;
            position:relative;
            .btn-back{
                width:1.3rem;
                height:100%;
                font-size:.28rem;
                color:#999;
                position:absolute;
                left:-.6rem;
                top:0;
            }
        }
        .logo{
            width:100%;
            height:1rem;
            position:relative;
        }
        .from{
            .input-main{
                height:1.1rem;
                margin-bottom:.3rem;
                position:relative;
                .icon{
                    width:1.1rem;
                    height:100%;
                    position:absolute;
                    left:0;
                    top:0;
                }
                input{
                    width:100%;
                    height:100%;
                    border:none;
                    background:#f5f5f5;
                    text-indent:1.1rem;
                    border-radius:5px;
                    font-size:.28rem;
                }
            }
            .phone-number{
                .icon{
                    background:url(../../assets/images/user_hd.png) no-repeat center;
                    background-size:.44rem .55rem;
                }
            }
            .passWord{
                .icon{
                    background:url(../../assets/passWord.png) no-repeat center;
                    background-size:.44rem .51rem;
                }
            }
        }
        .btn-in{
            width:100%;
            height:1.1rem;
            border:none;
            border-radius:110/100rem;
            outline:none;
            margin-top:.3rem;
            background: -webkit-linear-gradient(left, #C79A01, #C79A01);
            background: -o-linear-gradient(right, #C79A01, #C79A01);
            background: -moz-linear-gradient(right, #C79A01, #C79A01);
            background: linear-gradient(to right, #C79A01, #C79A01);
            font-size:.36rem;
            color:#fff;
        }
        .fail-link{
            padding-top:.3rem;
            li{
                width:100%;
                height:1.1rem;
                text-align:center;
                font-size:.28rem;
                line-height:1.1rem;
                border:1px solid #ccc;
                border-radius:20px;
                border-radius: 110/100rem;
                font-size:.32rem;
                color:#797979;
                span{
                    color:#C79A01;
                    font-size:.32rem;
                }
            }
        }
        .ftPassword{
            text-decoration:underline;
            padding-top:.8rem;
            text-align:right;
            span{
                font-size:.28rem;
                color:#797979;
            }
        }
    }
</style>