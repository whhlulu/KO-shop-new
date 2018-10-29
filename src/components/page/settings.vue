<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <set-height :text="title"></set-height>
        <dl class="content-wrap">
            <dt class="clearfix" @click="toData">
                <img :src="URL+$store.state.user_Imag" class="fl">
                <div class="user fl">
                    <h2 class="userId">{{data.nick_name}}</h2>
                    <p class="userName">用户名：{{data.user_name}}</p>
                </div>
                <div class="icon-btn"></div>
            </dt>
            <!--<dd @click="tophone">
                绑定手机号码
                <div class="icon-btn"></div>
            </dd>-->
            <!--<dd>
                绑定支付宝
                <div class="icon-btn"></div>
            </dd>
            <dd>
                绑定微信账号
                <div class="icon-btn"></div>
            </dd>-->
            <dd @click="toPass">
                修改密码
                <div class="icon-btn"></div>
            </dd>
        </dl>
        <div class="footer" @click="signOut">退出当前账户</div>
    </div>
</template>
<script>
    import qs from 'qs';
    import setHeight from './children/header';
    import { MessageBox } from 'mint-ui';
    export default {
        name : 'settings',
        data(){
            return {
                title:'账户设置',
                data:''
            }
        },
        methods:{
            toData(){
                if(!sessionStorage.getItem('user_ID')){
                        this.$router.push({
                        path:'/LogoIn'
                    });
                    return
                }
                this.$router.push({
                    path:'/personal'
                });
            },
            toPass(){
                if(!sessionStorage.getItem('user_ID')){
                        this.$router.push({
                        path:'/LogoIn'
                    });
                    return
                }
                this.$router.push({
                    path:'/mPassword'
                });
            },
            tophone(){
                this.$router.push({
                    path:'/phone'
                });
            },
            signOut(){
                MessageBox({
                    title: '提示',
                    message: '退出登录',
                    showCancelButton: true
                }).then(action => {
                    if(action == 'cancel')reutrn;
                    sessionStorage.removeItem('user_ID');
                    sessionStorage.removeItem('set_address');
                    localStorage.removeItem('user_ID');
                    this.$router.push('/home');
                });
            }
        },
        mounted(){
            
            this.axios.post(API_URL + 'Home/Pcenter/userinfo',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.data = res.data.data;
            }).catch((err) => {
                console.log(err)
            });
        },
        components:{
            setHeight
        }
    }
</script>
<style lang="less" scoped>
    .content-wrap{
        background:#fff;
        dt{
            padding:.2rem;
            height:1.14rem;
            position:relative;
            border-bottom:1px solid #e7e7e7;
            img{
                width:1.14rem;
                height:1.14rem;
                border-radius:100%;
                box-sizing:border-box;
            }
            .user{
                padding-left:.3rem;
                .userId{
                    font-size:.32rem;
                    color:#333;
                    padding-top:.1rem;
                }
                .userName{
                    padding-top:.2rem;
                    font-size:.26rem;
                    color:#999;
                }
            }
            .icon-btn{
                position:absolute;
                top:50%;
                right:.2rem;
                margin-top:-.12rem;
                width:.14rem;
                height:.24rem;
                background:url(../../assets/btn-right.png) no-repeat;
                background-size:100% 100%;
            }
        }
        dd{
            height:.9rem;
            border-bottom:1px solid #e7e7e7;
            position:relative;
            font-size:.32rem;
            color:#3d4245;
            line-height:.9rem;
            padding:0 .2rem;
            .icon-btn{
                position:absolute;
                top:50%;
                right:.2rem;
                margin-top:-.12rem;
                width:.14rem;
                height:.24rem;
                background:url(../../assets/btn-right.png) no-repeat;
                background-size:100% 100%;
            }
        }
    }
    .footer{
        height:.9rem;
        position:fixed;
        left:0;
        bottom:0;
        text-align:center;
        line-height:.9rem;
        background:#d0111b;
        color:#fff;
        width:100%;
        font-size:.32rem;
    }
    .footer:active{
        box-shadow: 0 -5px 5px #ccc;
    }
</style>