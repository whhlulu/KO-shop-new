<template>
  <div>
    <div v-title :data-title="title">{{title}}</div>
    <address-header :text="title"></address-header>
    <div class="content-wrap">
        <div class="item-wrap" @click="to(index)" v-for="(item,index) in data" :key="item.id">
            <div class="hd clearfix">
                <span class="name fl"><i class="icon"></i>{{item.realname}}</span>
                <span class="phone fr"><i class="icon"></i>{{item.mobile}}</span>
            </div>
            <div class="con-text text2-hidden">{{item.prov+'&nbsp'+item.city +'&nbsp'+ item.dist +'&nbsp' + item.address}}</div>
            <div class="icon-link"></div>
        </div>
    </div>
    <div v-if="!data" class="text-center status">收货地址为空，赶快添加吧！</div>
    <div class="btn-wrap">
        <div class="btn-main"><button @click="tolink('/newAddress')"><i class="icon fl clearfix"></i><span class="fl">新增收货地址</span></button></div>
    </div>
  </div>
</template>
<script>
    import qs from 'qs';
    import addressHeader from './children/header.vue';
    export default {
        name : 'address',
        data(){
            return {
                title:'收货地址管理',
                data:'',
                address:[],
                set_address:[]
            }
        },
        methods:{
            to(index){
                if(this.$route.params.status == 2){
                    this.$router.push({
                        name:'EdiAddress',
                        params:{
                            status:this.data[index].id
                        }
                    });
                }else{
                 for (var i = 0; i < this.data.length; i++) {
                    if (index == i)
                        this.address.push(this.data[i]);
                }

                if (this.address.length === 0) {
                    return ;
                }
                // 选择的收货地址
                sessionStorage.setItem('set_address',JSON.stringify(this.address[0]))
                this.$router.push({
                        name:'order',
                        params:{
                            id:2
                        }
                    }); 
                }
            },
             tolink(link){
                if(link == '/newAddress'){
                    this.$router.push({
                        name:'newAddress',
                        params:this.$route.params.status
                    });
                }
            }
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Pcenter/addresslist',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.data = res.data.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        components:{
            addressHeader
        }
    }
</script>
<style lang="less" scoped>
    .content-wrap{
        background:#fff;
        .item-wrap{
            height: 2.3rem;
            border-bottom:1px solid #dfdfdf;
            position:relative;
            .icon-link{
                position:absolute;
                right:.2rem;
                top:50%;
                margin-top:-.15rem;
                width: .18rem;
                height: .3rem;
                background:url(../../assets/icon-right.jpg) no-repeat;
                background-size:100% 100%;
            }
            .con-text{
                width: 6.65rem;
                font-size:.32rem;
                color:#999;
                line-height:.48rem;
                margin:.2rem;
                height: .85rem;
            }
        }
        .hd{
            height: .45rem;
            line-height:.45rem;
            overflow:hidden;
            padding:.43rem .2rem 0;
            width: 6.65rem;
            .name{
                font-size:.36rem;
                color:#282828;
                padding-left:.44rem;
                position:relative;
                .icon{
                    position:absolute;
                    left:0;
                    top:50%;
                    width: .28rem;
                    height: .41rem;
                    margin-top:-.205rem;
                    background:url(../../assets/userIcon1.png) no-repeat;
                    background-size:100% 100%;
                }
            }
            .phone{
                font-size:.36rem;
                color:#282828;
                padding-left:.44rem;
                position:relative;
                .icon{
                    position:absolute;
                    left:0;
                    top:50%;
                    width: .24rem;
                    height: .34rem;
                    margin-top:-.17rem;
                    background:url(../../assets/phone.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
    }
    .btn-wrap{
        width: 7.5rem;
        height: 1rem;
        .btn-main{
            position:fixed;
            bottom:0;
            left:0;
            width: 7.1rem;
            height: .8rem;
            padding:.2rem;
            background:#fff;
            button{
                color:#fff;
                width: 100%;
                height: 100%;
                border:none;
                background:#e02828;
                outline: none;
                padding-left:2.3rem;
                box-sizing: border-box;
                span{
                    font-size:.32rem;
                    margin-left:.2rem;
                }
                .icon{
                    display:inline-block;
                    width: .34rem;
                    height: .34rem;
                    background:url(../../assets/add.png) no-repeat;
                    background-size:100% 100%;
                    margin-top:.05rem;
                }
            }
            button:active{
                box-shadow: 0 5px 5px #ccc;
            }
        }
    }
    .status{
        color:#666;
        line-height: 1rem;
        font-size:.4rem;
    }
</style>