<template>
    <div class="wrap">
        <div v-title :data-title="title">{{title}}</div>
        <header class="logoIn-header">
           <span @click="remove" class="btn-back">取消</span>{{title}}
        </header>
        <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请输入密码...." v-model="password">
        </div>
        <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请再次输入密码...." v-model="re_password">
        </div>
        
        <button class="btn-in" @click="register">重置密码</button>
    </div>
</template>
<script>
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'resetPassword',
        data(){
            return {
                title:'重置密码',
                password:'',
                re_password:''
            }
        },
        methods:{
            remove(){//路由回退一步
                this.$router.go(-1)
            },
            register(){
                this.axios.post(API_URL + 'Home/Register/resetPassword',qs.stringify({
                    app_user_id:this.$route.params.user_id,
                    newPassword1:this.password,
                    newPassword2:this.re_password
                })).then((res) => {
                    if(res.data.status == 1){
                        Toast({
                            message: '密码重置成功',
                            position: 'bottom'
                        });
                    }else{
                        Toast({
                            message: res.data.msg,
                            position: 'bottom'
                        });
                    };
                    this.$router.push('/LogoIn');
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
            border-radius:20px;
            outline:none;
            margin-top:.3rem;
            background:#d0111b;
            font-size:.36rem;
            color:#fff;
            margin-bottom:.5rem;
        }
        .btn-in:active{
            box-shadow: 0 5px 5px #ccc;
        }
    }  
</style>