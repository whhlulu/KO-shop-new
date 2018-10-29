<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <servce-header :text="title"></servce-header>
        <div class="product-wrap">
            <div class="hd">
                <p class="number">订单编号&nbsp;:&nbsp;{{$store.state.order_details.order_sn_id}}</p>
                <p class="time">下单时间&nbsp;:&nbsp;{{new Date($store.state.order_details.create_time * 1000).getFullYear()+'-'+(new Date($store.state.order_details.create_time * 1000).getMonth()+1)+'-'+new Date($store.state.order_details.create_time * 1000).getDay()+'&nbsp;&nbsp;'+new Date($store.state.order_details.create_time * 1000).getHours()+':'+new Date($store.state.order_details.create_time * 1000).getMinutes()+':'+new Date($store.state.order_details.create_time * 1000).getSeconds()}}</p>
            </div>
            <div class="dd clearfix" v-if="$store.state.order_details.child">
                <img :src="URL + $store.state.order_details.child[$route.params.index].img" class="fl">
                <div class="fl content">
                    <p class="text">{{$store.state.order_details.child[$route.params.index].goods_title}}</p>
                    <p class="number">数量：{{$store.state.order_details.child[$route.params.index].goods_num}}</p>
                </div>
            </div>
            <div class="dd clearfix" v-if="!$store.state.order_details.child">
                <img :src="URL + $store.state.order_details.order_goods[$route.params.index].pic_url" class="fl">
                <div class="fl content">
                    <p class="text">{{$store.state.order_details.order_goods[$route.params.index].title}}</p>
                    <p class="number">数量：{{$store.state.order_details.order_goods[$route.params.index].goods_num}}</p>
                </div>
            </div>
        </div>
        <dl class="type-wrap clearfix" v-show="$route.params.status == 'rGoods'">
            <dt class="fl">服务类型</dt>
            <dd class="fl" :class="{active:isType.status[index]}" v-for="(item,index) in isType.text" :key="item.id" @click="addClass(index)">{{item}}<em></em></dd>
        </dl>
        <div class="amount-wrap" v-show="ser_type == 2 || ser_type == 1">
            <h2 class="title">申请金额</h2>
            <div class="input-main">
                <input type="number" v-model="adAmount" @input="input">&nbsp;&nbsp;元    
            </div> 
            <p class="max" v-if="$store.state.order_details.child">您最多可申请{{$store.state.order_details.child[$route.params.index].goods_price}}元，含发货邮费0.00元</p> 
            <p class="max" v-if="!$store.state.order_details.child">您最多可申请{{$store.state.order_details.order_goods[$route.params.index].goods_price}}元，含发货邮费0.00元</p> 
        </div>
        <div class="amount-wrap" v-show="$route.params.status == 'rGoods'">
            <h2 class="title">申请数量</h2>
            <div class="input-main and">
                <button class="fl" @click="conversion('plus')">-</button>
                <input class="fl" v-model="isNumber" @input="inputPlus">
                <button class="fl" @click="conversion('reduce')">+</button>
            </div> 
            <p class="max" v-if="$store.state.order_details.child">您最多可提交数量为{{$store.state.order_details.child[$route.params.index].goods_num}}个</p>
            <p class="max" v-if="!$store.state.order_details.child">您最多可提交数量为{{$store.state.order_details.order_goods[$route.params.index].goods_num}}个</p> 
        </div>
        <div class="explain-wrap">
            <h2 class="title">{{explain}}</h2>
            <textarea placeholder="请您在此描述详细问题..." v-model="explain_type"></textarea>
            <div class="img-wrap clearfix">
                <div class="list-img fl" v-for="(imgas,index) in imgs" :key="imgas.id" v-show="imgs.length >= 1" @click="imgShow(index)">
                    <div class="del el-icon-circle-cross" @click="del(index)"></div>
                    <img :src="imgs[index]">
                </div>
                <div class="input-btn fl" v-show="imgs.length < 3">
                    <input type="file" @change="add_img($event)" ref="int">
                </div>
            </div>
            <p class="addMost">最多添加3张，每张不超过5M，支持jpg、bmp、png</p>
        </div>
        <div class="form-btn-wrap">
            <button @click="request">确认申请</button>
        </div>
    </div>
</template>
<script>
    import servceHeader from '@/components/page/children/header.vue';
    import { Toast } from 'mint-ui';
    import qs from 'qs';
    export default {
        name : 'serviceBack',
        data(){
            return {
                title : '申请售后',
                isType:{
                    text:['退货','换货','维修'],
                    status:[true,false,false]
                },
                adAmount:0.00,
                number:100,
                isNumber:1,
                imgLength:0,
                imgs:[],
                explain:'',
                ser_type:1,
                explain_type:''
            }
        },
        methods:{
            addClass(index){
                for(var i = 0; i < this.isType.status.length; i++){
                    this.$set(this.isType.status,i,false);
                }
                this.$set(this.isType.status,index,true);
                switch(index){
                    case 0:
                        this.ser_type = 1;
                        break;
                    case 1:
                        this.ser_type = 0;
                        break;
                    case 2:
                        this.ser_type = 3;
                        break;
                }
            },
            input(){
                if(this.adAmount > this.$store.state.order_details.child[this.$route.params.index].goods_price){
                    Toast({
                        message: '退款金额不能大于商品金额',
                        position: 'bottom'
                    });
                    this.adAmount = this.$store.state.order_details.child[this.$route.params.index].goods_price;
                }
            },
            add_img(ev){
                const reader = new FileReader(),
                      img1 = ev.target.files[0],
                      that = this;
                reader.readAsDataURL(img1);
                reader.onload = function(){
                    that.imgs.push(this.result)
                }
                this.$refs.int.value = '';
            },
            del(index){
                this.imgs.splice(index,1)
            },
            imgShow(index){
                this.maximg = this.imgs[index];
            },
            hideImg(){
                this.maximg = null;
            },
            conversion(obj){
                if(obj === 'plus'){
                        if(this.isNumber <= 1){
                            Toast({
                                message: '退货不能少于1个哦',
                                position: 'bottom'
                            });
                        return;
                    }
                    this.isNumber--
                }else{
                    if(this.isNumber >= this.$store.state.order_details.child[this.$route.params.index].goods_num){
                        Toast({
                            message: '最多可退'+this.$store.state.order_details.child[this.$route.params.index].goods_num+'个哦！',
                            position: 'bottom'
                        });
                        return;
                        
                    }
                    this.isNumber++
                }
            },
            inputPlus(){
                if(this.isNumber >= this.$store.state.order_details.child[this.$route.params.index].goods_num){
                    this.isNumber = this.$store.state.order_details.child[this.$route.params.index].goods_num
                }else if(this.isNumber <= 1){
                    this.$store.state.order_details.child[this.$route.params.index].goods_num = 1
                }
            },
            request(){
                this.axios.post(API_URL + 'Home/Pcenter/afterSaleApply',qs.stringify({
                    order_id:this.$store.state.order_details.order_sn_id,
                    goods_id:this.$store.state.order_details.child[this.$route.params.index].goods_id,
                    type:this.ser_type,
                    apply:this.imgs,
                    number:this.isNumber,
                    explain:this.explain_type,
                    apply:this.$store.state.order_details.child[this.$route.params.index].goods_price,
                    app_user_id:sessionStorage.getItem('user_ID'),

                })).then((res) => {
                    Toast({
                        message: res.data.msg,
                        position: 'bottom'
                    });
                    this.$router.go(-2)
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        created(){
            if(this.$route.params.status == 'refund'){
                this.title = '申请退款';
                this.explain = '退货说明';
            }else{
                this.title = '申请售后';
                this.explain = '售后说明';
            };
            if(this.$store.state.order_details.child){
                this.adAmount = this.$store.state.order_details.child[this.$route.params.index].goods_price;
                switch(this.$route.params.status){
                    case 'refund':
                        this.ser_type = 2;
                        break;
                }
                this.isNumber = this.$store.state.order_details.child[this.$route.params.index].goods_num;
            }else{

            }
        },
        components:{
            servceHeader
        }
    }
</script>
<style lang="less">
.explain-wrap{
    .el-upload.el-upload--picture-card{
        width: 1.5rem;
        height: 1.5rem;
        position:relative;
        i{
            line-height: 1.5rem;
            font-size:.5rem;
        }
    }
    .el-upload-list--picture-card .el-upload-list__item{
        width: 1.5rem;
        height: 1.5rem;
    }
    .el-upload-list--picture-card .el-upload-list__item-status-label{
        right:-.15rem;
        top:-.06rem;
        width: .4rem;
        height: .24rem;
        i{
            font-size:.12rem;
            margin-top:.11rem;
        }
    }
    .img-wrap.active{
        .el-upload.el-upload--picture-card{
            display:none;
        }
    }
    .el-dialog--tiny{
        width: 50%;
    }
}
</style>
<style lang="less" scoped>
    .product-wrap{
        width: 7.1rem;
        padding:0 .2rem;
        border-bottom:1px solid #dfdfdd;
        background:#fff;
        .hd{
            padding:.3rem 0;
            border-bottom:1px solid #dfdfdd;
            .number{
                font-size:.25rem;
                color:#333;
                padding-bottom:.2rem;
            }
            .time{
                font-size:.25rem;
                color:#757575;
            }
        }
        .dd{
            padding:.4rem 0;
            height:1.46rem;
            background:#fff;
            img{
                width:1.46rem;
                height:1.46rem;
            }
            .content{
                width: 5.1rem;
                padding:0 .2rem;
                .text{
                    font-size:.25rem;
                    color:#333;
                    line-height:.39rem;
                    height:.78rem;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
                .number{
                    font-size:.25rem;
                    color:#999;
                    padding-top:.3rem;
                }
            }
        }
    }
    .type-wrap{
        margin-top:.2rem;
        width: 7.1rem;
        padding:0 .2rem .63rem;
        border-top:1px solid #dfdfdd;
        border-bottom:1px solid #dfdfdd;
        background:#fff;
        dt{
            width: 100%;
            padding:.4rem 0 .35rem 0;
            font-size:.3rem;
            color:#333;
        }
        dd{
            width: 2.12rem;
            height: .83rem;
            border:2px solid #757575;
            text-align:center;
            line-height:.83rem;
            border-radius:5px;
            margin-right:.3rem;
            font-size:.25rem;
            color:#333;
            box-sizing: border-box;
            position:relative;
            overflow: hidden;
        }
        dd.active{
            border-color:#e02828;
            color:#e02828;
            background:#fff;
            em{
                position:absolute;
                right:-.25rem;
                bottom:-.25rem;
                width:.5rem;
                height:.5rem;
                background:#e02828;
                transform: rotate(45deg);
            }
        }
        dd:nth-child(4n){
            margin-right:0;
        }
    }
    .amount-wrap{
        padding:.57rem .2rem .41rem;
        border-bottom:1px solid #dfdfdd;
        background:#fff;
        .title{
            font-size:.3rem;
            color:#333;
            padding-bottom:.35rem;
        }
        .input-main{
            height: .78rem;
            overflow:hidden;
            line-height:.78rem;
            font-size:.28rem;
            color:#999;
            input{
                width:2.36rem;
                height:.78rem;
                border:1px solid #d4d4d4;
                border-radius:5px;
                box-sizing: border-box;
                font-size:.43rem;
                color:#e02828;
                text-align:center;
                outline:none;
            }
        }
        .input-main.and{
            input{
                width: 1rem;
                border-radius:0;
                border-left:0;
                border-right:0;
                color:#757575;
            }
            button{
                width: .78rem;
                height:.78rem;
                background:#fff;
                border:none;
                outline:none;
                color:#757575;
                font-size:.5rem;
                border:1px solid #d4d4d4;
                border-radius:0 5px 5px 0;
            }
            button:active{
                background-color:#d4d4d4;
                color:#fff;
            }
            button:nth-child(1){
                border-radius:5px 0 0 5px;
            }
        }
        p.max{
            font-size:.25rem;
            color:#999;
            padding-top:.23rem;
        }
    }
    .explain-wrap{
        margin-top:.2rem;
        border-top:1px solid #dfdfdd;
        border-bottom:1px solid #dfdfdd;
        padding:0 .2rem;
        margin-bottom:.2rem;
        background:#fff;
        .img-wrap{
            .list-img{
                margin-right:.3rem;
                margin-top:.2rem;
                position:relative;
                img{
                    width:1.5rem;
                    height:1.5rem;
                }
                .del{
                    position:absolute;
                    top:-.15rem;
                    right:-.15rem;
                    font-size:.3rem;
                }
            }
            .list-img:nth-child(4n){
                margin-right:0;
            }
            .input-btn{
                position:relative;
                overflow:hidden;
                width: 1.5rem;
                height: 1.5rem;
                background:url(../../assets/img-btn.jpg) no-repeat;
                background-size:100% 100%;
                margin-top:.2rem;
                input{
                    width: 200%;
                    height: 200%;
                    position:absolute;
                    left:-100%;
                    top:-100%;
                    outline: none;
                }
            }
        }
        .title{
            font-size:.25rem;
            color:#333;
            padding:.45rem 0 .33rem;
        }
        textarea{
            width: 7.1rem;
            height: 1.2rem;
            padding:.2rem;
            resize:none;
            border:1px solid #dfdfdd;
            font-size:.25rem;
            box-sizing: border-box;
            margin-bottom:.15rem;
        }
        .addMost{
            font-size:.21rem;
            color:#ccc;
            padding:.25rem 0;
        }
    }
    .form-btn-wrap{
        width:7.1rem;
        padding:.2rem;
        background:#fff;
        button{
            width: 7.1rem;
            height:.9rem;
            background:#f9781e;
            border:none;
            color:#fff;
            font-size:.32rem;
            outline: none;
        }
        button:active{
            box-shadow: 0 5px 5px #f9781e;
        }
    }
</style>