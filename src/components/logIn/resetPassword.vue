<template>
    <div class="wrap" ref="box">
        <div v-title :data-title="title">{{title}}</div>
        <header class="logoIn-header">
           <span @click="remove" class="btn-back">取消</span>{{title}}
        </header>
        <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请输入原密码...." v-model="pass">
        </div>
         <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请输入新密码...." v-model="password">
        </div>
        <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请再次输入新密码...." v-model="re_password">
        </div>
        
        <button class="btn-in" @click="register">重置密码</button>
    </div>
</template>
<script>
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        data(){
            return {
                title:'重置密码',
                password:'',
                re_password:'',
                pass:''
            }
        },
        mounted () {
            this.$refs.box.style.height = "100%";
        },
        methods:{
            remove(){//路由回退一步
                this.$router.go(-1)
            },
            register(){
            	if(this.pass==this.password){
            		Toast("请输入新密码");
                    return false;
            	}
                if(this.password.length<6&&this.password.length>12){
                    Toast("请输入密码");
                    return false;
                }
                 if(this.re_password !=this.password){
                    Toast("再次输入的密码不一致");
                    return false;
                }
                 if(this.password.length<6 ||this.re_password.length<6){
                 	Toast('请至少输入6位');
                 	return false;
                 }
                this.axios.post(this.$httpConfig.resetPassword,qs.stringify({
                    password:this.pass,
                    new_password1:this.password,
                    new_password2:this.re_password
                })).then((res) => {
                    Toast({
                            message: res.data.message,
                            position: 'bottom'
                        });
                    if(res.data.status == 1){
                         this.$router.push('/seetin');
                    }
                   
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .wrap{
        padding:0 .6rem;
        background:#fff;
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
        .input-main{
            height:1.1rem;
            margin-top:.3rem;
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
                line-height:100%;
            }
        }
        .passWord{
            .icon{
                background:url(../../assets/passWord.png) no-repeat center;
                background-size:.44rem .51rem;
            }
        }
        .btn-in{
            width:100%;
            height:1.1rem;
            border:none;
            border-radius:110/100rem;
            outline:none;
            margin-top:.3rem;
            background:#C79A01;
            font-size:.36rem;
            color:#fff;
            margin-bottom:.5rem;
        }
        .btn-in:active{
            box-shadow: 0 5px 5px #ccc;
        }
    }  
</style>