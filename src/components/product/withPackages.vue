<template>
  <div class="box">
      <div v-title data-title="搭配套餐">搭配套餐</div>
      <Pr-header :text="title" :status="cart_status"></Pr-header>
      <ul class="header">
            <li :class="{active:titleIndex == index}" @click="tabList(index)" v-for="(item,index) in tablist" :key = 'index'><p>{{item}}</p></li>
      </ul>
      <div class="content-box">
        <div class="content" @click="toInfo(item.goods_id || item.id)" v-for="(item,i) in accessories" v-show="list==0 || list == 2" :key="i">
                <div class="check">
                    <div class="checkDiv" @click.stop="recommendSelect(i,item)" :class="{checked:item.isSelected}"></div>
                </div>
            <img :src="URL+item.pic_url" alt="">
            <div class="con">
                <p>{{item.title}}</p>
            </div>
            <div class="pri">
                <p v-show="list == 0">{{item.goods_price}}</p>
                <p v-show="list == 2">{{item.price_market}}</p>
                <span>x1</span>
            </div>
        </div>
        <div class="fixedBtm1" v-show="list==0 || list == 2">
            <div class="shopbtn buyShop"  @click="buy">立即购买</div>
            <div class="shopbtn addShop" @click="addCar">加入购物车</div>
        </div>
        <div class="package-box">
            <div class="content-box-package" v-for="(items,i) in accessories" v-bind:key="items.package_id" v-show="list==1">
                    <div class="content-box-title">
                        <div class="check">
                            <div class="checkDiv" @click.stop="recommendSelect(i,items)" :class="{checked:items.isSelected}"></div>
                        </div>
                        <p>{{items.title}}</p>
                    </div>
                    <div class="content" v-for="item in items.goods" :key="item.id" @click="toInfo(item.goods_id)">
                        <img :src="URL+item.pic_url" alt="">
                        <div class="con">
                            <p>{{item.title}}</p>
                        </div>
                        <div class="pri">
                            <p class="old-price">{{item.goods_price}}</p>
                            <p class="new-price">{{item.discount}}</p>
                            <span>x1</span>
                        </div>
                    </div>
            </div>
        </div>
        <div class="fixedBtm" v-show="list == 1">
            <div class="shopbtn buyShop"  @click="setMealBuy">立即购买</div>
            <div class="shopbtn addShop" @click="addCar">加入购物车</div>
            <div class="con">
                <p class="title">套餐价：<span class="reds">￥{{showPrice.newPrice | keepTwoNum}}</span> </p>
                <p class="info">总额:￥{{showPrice.oldPrice | keepTwoNum}}&nbsp;&nbsp;优惠:<span>￥{{showPrice.discount | keepTwoNum}}</span></p>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
	import qs from "qs"
	import { MessageBox,Toast,Popup } from 'mint-ui';
    import PrHeader from '@/components/page/children/header.vue';
    export default {
        data () {
            return {
                img:require("@/assets/images/agreementSuc.jpg"),
                checkImg:require("@/assets/images/ok.png"),
                title:'搭配套餐',
                tablist:['推荐配件',"优惠套餐","最佳组合"],
                titleIndex:0,
                accessories:'',
                list:'',
                goods_id:0,
                buyArr:[],
                goods_arr:'',
                packageID:0,//套餐ID
                packagePrice:[],//存放价格信息
                packageID:[],//套餐ID
                showPrice:{ //显示价格信息
                    discount:0,
                    oldPrice:0,
                    newPrice:0
                },
                cart_list:[], //购物车列表
                cart_status:2
            }
        },
        created(){
            this.goods_id = this.$route.params.package_goods_id;
        },
        mounted(){
            this.tabList(0);
        },
        methods:{
            //去详情
            toInfo(id){
                this.$router.push({
                    name: "product",
                    params: {
                        id: id,
                        status: 1
                    }
                });
            },
            //推荐配件选择
            recommendSelect(index,item){
                let id = '';
                let price = '';
                let goodsId = [];
                if(item.goods_id){
                    id = item.goods_id;
                }else if(item.id){
                    id = item.id;
                }else{
                    id = item.package_id;
                }
                if(item.goods_price){
                    price = item.goods_price;
                }else{
                    price = item.price_market;
                }
                //手动更新视图
                this.$forceUpdate();
                if (item.isSelected == false) {
                    this.$set(this.accessories[index],'isSelected',true);
                    this.$set(this.cart_list,index,{goods_id:id,goods_num:1,price_new:price,store_id:this.$route.params.store_id});
                    this.$set(this.buyArr,index,id);
                    if(this.list == 1){
                        this.showPrice.discount += this.packagePrice[index].discount;
                        this.showPrice.oldPrice += this.packagePrice[index].oldPrice;
                        this.showPrice.newPrice += this.packagePrice[index].newPrice;
                    }
                }else{
                    this.$set(this.accessories[index],'isSelected',false);
                    this.cart_list.splice(index,1);
                    this.$set(this.buyArr,index,'');
                    if(this.list == 1){
                        this.showPrice.discount -= this.packagePrice[index].discount;
                        this.showPrice.oldPrice -= this.packagePrice[index].oldPrice;
                        this.showPrice.newPrice -= this.packagePrice[index].newPrice;
                    }
                }
                for (let index = 0; index < this.buyArr.length; index++) {
                    if(!this.buyArr[index] || this.buyArr[index] == null || this.buyArr[index] == '' || this.buyArr[index] == undefined){
                        continue;
                    }else{
                        goodsId.push(this.buyArr[index])
                    }
                
                }
                this.goods_arr = goodsId.join(',');
            },
            tabList(index){
                this.buyArr = [];
                this.cart_list = [];
                if(index==0){
                	this.axios.post(this.$httpConfig.accessories,qs.stringify({
		                goods_id:this.goods_id
		            })).then((res) => {
		            	this.accessories=res.data.data;
                        for(var i in this.accessories){
                            this.accessories[i].isSelected = false;
                        }
		             	this.titleIndex=0;
                        this.list=0;
                        this.cart_status = 2;
		              }).catch((err) => {
		                 console.log(err);
		              });
                	
                }else if(index==1){
                	this.axios.post(this.$httpConfig.package,qs.stringify({
		                goods_id:this.goods_id
		            })).then((res) => {
		            	this.accessories=res.data.data;
                        for(var i in this.accessories){
                            this.accessories[i].isSelected = false;
                            var newPackage = {
                                discount:0,
                                oldPrice:0,
                                newPrice:0
                            }
                            for(var j in this.accessories[i].goods){
                                    newPackage.discount += (Number(this.accessories[i].goods[j].goods_price)-Number(this.accessories[i].goods[j].discount));
                                    newPackage.oldPrice += (Number(this.accessories[i].goods[j].goods_price));
                                    newPackage.newPrice += (Number(this.accessories[i].goods[j].discount));
                            }
                            this.packagePrice.push(newPackage);
                            this.packageID.push(this.accessories[i].package_id);
                        }
		             	this.titleIndex=1;
                        this.list=1;
                        this.cart_status = 3;
		              }).catch((err) => {
		                 console.log(err);
		              });
                	
                }else if(index==2){
                	this.axios.post(this.$httpConfig.matchGood,qs.stringify({
		                goods_id:this.goods_id
		            })).then((res) => {
		            	this.accessories=res.data.data;
                        for(var i in this.accessories){
                            this.accessories[i].isSelected = false;
                            this.accessories[i].other = '1';
                        }
		             	this.titleIndex=2;
                        this.list=2;
                        this.cart_status = 2;
		              }).catch((err) => {
		                 console.log(err);
		              });
                }
            },
            buy(){
                if(!this.accessories){
                        Toast({
                            message: "暂无商品",
                            position: 'center',
                            duration: 1000
                        });
                        return;
                    }
                if(!this.goods_arr){
                    Toast({
							message:"请选择你要购买的商品",
							duration:1000
                        });
                        return;
                }
            	this.$router.push({
            		name:'comboOrder',
            		params:{
            			obj:this.goods_arr
            		}
            	})
            },
            //优惠套餐立即购买
            setMealBuy(){
                if(!this.accessories){
                    Toast({
                        message: "暂无商品",
                        position: 'center',
                        duration: 1000
                    });
                    return;
                };
                if(!this.goods_arr){
                    Toast({
                        message: "至少选择1个套餐",
                        position: 'center',
                        duration: 1000
                    });
                    return;
                };
                this.$router.push({
            		name:'orderPackage',
            		params:{
                        set_meal_id:this.goods_arr
            		}
            	})
                
            },
            //加入购物车
            addCar(){
                    if(!this.accessories){
                        Toast({
                            message: "暂无商品",
                            position: 'center',
                            duration: 1000
                        });
                        return;
                    }
                    if(this.list == 1){
                        var selectedList = [];
                        for(var i in this.accessories){
                            if(this.accessories[i].isSelected == true){
                                selectedList.push(this.accessories[i].package_id);
                            }
                        }
                        if(selectedList.length == 0){
                            Toast({
                                message: "至少选择1个套餐",
                                position: 'center',
                                duration: 1000
                            });
                            return false;
                        }else{
                            this.axios.post(this.$httpConfig.cartPackageAddCart, qs.stringify({
                                    id:selectedList.join(',')
                            })).then((res) => {
                                if(res.data.status==10001){
                                    this.$router.push('/LogIn');
                                }else{
                                    if(res.data.status == 1){
                                        for(var i in this.accessories){
                                            this.accessories[i].isSelected = false;
                                        }
                                        Toast({
                                            message: "添加成功",
                                            position: 'center',
                                            duration: 1000
                                        });
                                        this.showPrice.oldPrice = 0;
                                        this.showPrice.newPrice = 0;
                                        this.showPrice.discount = 0;
                                        this.buyArr = [];
                                        this.goods_arr = '';
                                        //更新视图
                                        this.$forceUpdate();   

                                    }else{
                                        Toast(res.data.message);
                                    }
                                }
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                }else{
                    if(this.cart_list.length === 0){
                        Toast({
							message:"请选择你要添加的商品",
							duration:1000
                        });
                        return;
                    }
                    //重塑数组
                    for(var i=0,len=this.cart_list.length;i<len;i++){ //重塑数组
                        if(!this.cart_list[i] || this.cart_list[i] == null || this.cart_list[i] == '' || this.cart_list[i] == undefined){
                            this.cart_list.splice(i,1);
                            len--;
                            i--;
                        }
                    }
                    this.axios.post(this.$httpConfig.cartPackageAddGoodsAll, qs.stringify({
                            goods:this.cart_list
                    })).then((res) => {
                        if(res.data.status==10001){
                            this.$router.push('/LogIn');
                        }else{
                            if(res.data.status == 1){
                                Toast({
                                    message: res.data.message,
                                    position: 'center',
                                    duration: 2000
                                });
                                for(var i in this.accessories){
                                    this.accessories[i].isSelected = false;
                                }
                                this.goods_arr = '';
                                this.buyArr = [];
                                //更新视图
                                this.$forceUpdate();
                            }else{
                                Toast(res.data.message);
                            }
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
        },
        components:{
            PrHeader
        }
    }
</script>
<style lang="less" scoped>
// 底部购物
.fixedBtm1{
    width: 100%;
	clear: both;
	display: inline-block;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    .shopbtn{
        width: 50%;
        text-align: center;
        padding: 35/100rem 30/100rem;
        color: #fff;
    }
    .addShop{
        background-color: #E9C440;
    }
    .buyShop{
        background-color: #D19E29;
    }
}
.fixedBtm{
    width: 100%;
	height: 1rem;
	clear: both;
	display: inline-block;
    // display: flex;
    background-color: #fff;
    // justify-content: flex-end;
    position: fixed;
    bottom: 0;
    div{
        float: right;
    }
    .con{
        width: 4.3rem;
        height: 1rem;
        text-align: right;
        padding-right:20/100rem;
        .title{
            margin:15/100rem 0;
            line-height: 32/100rem;
            font-size: 32/100rem;
            color: #9A9A9A;
            span{
                color: #E22429;
                font-size: 42/100rem;
            }
        }
        .info{
            color: #CCCCCC;
            display: -webkit-box;
            height: .5rem;
            // line-height: .5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            float: right;
        }
        p{
            font-size: 20/100rem;
            span{
                color: #DF2E28;
                font-size: 20/100rem;
            }
        }
    }
    .shopbtn{
        width: 1.5rem;
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }
    .addShop{
        background-color: #E9C440;
    }
    .buyShop{
        background-color: #D19E29;
    }
}
.box{
    background-color: #fff;
    .header{
        display: flex;
        li{
            height: 50/100rem;
            flex:1;
            text-align: center;
            border-bottom: 2/100rem solid #E0E0E0;
            padding:20/100rem 0 ;
            p{
                font-size: 32/100rem;
                border-right: 1/100rem solid #E0E0E0;
                height: 100%;
                line-height: 50/100rem;
                color:#7B7B7B;
            }
        }
        li:last-child{
            p{
                border-right:0;
            }
        }
        .active{
            border-bottom: 3/100rem solid #C79B00;
            p{
                color:#C79B00;
            }
        }
    }
    .package-box{
        margin-bottom: 1rem;
        .content-box-package{
            border-bottom: .3rem solid #f1f1f1;
            .content-box-title{
                background-color: #eee;
                height: .7rem;
                .check{
                    margin: .1rem;
                    width: .5rem;
                    display: flex;
                    align-items: center;
                    float: left;
                    .checkDiv{
                        width: 40/100rem;
                        height: 40/100rem;
                        border:2/100rem solid #e09629;
                        border-radius: 50%;
                    }
                    .checked {
                        border: none;
                        background: url(../../assets/check_bj.png) no-repeat;
                        background-size: 100% 100%;
                        width: 0.44rem;
                        height: 0.44rem;
                    }
                }
                p{
                    width: 3rem;
                    line-height: .7rem;
                    font-size: .2rem;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    .content{
        background-color: #fff;
        height: 230/100rem;
        box-sizing: border-box;
        padding: 30/100rem 20/100rem 40/100rem 40/100rem;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1/100rem solid #E0E0E0;
        .check{
            width: .5rem;
            display: flex;
            align-items: center;
            .checkDiv{
                width: 40/100rem;
                height: 40/100rem;
                border:2/100rem solid #e09629;
                border-radius: 50%;
            }
            .checked {
                border: none;
                background: url(../../assets/check_bj.png) no-repeat;
                background-size: 100% 100%;
                width: 0.44rem;
                height: 0.44rem;
            }
        }
        img{
            width: 155/100rem;
        }
        .con{
             display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start-end;
            width: 350/100rem;
            p{
                font-size: 30/100rem;
                line-height: 40/100rem;
                color: #464646;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal!important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            }
            select{
                width: 240/100rem;
                height: 60/100rem;
                border-color:#DEDEDE;
            }
        }
        .pri{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            padding: .1rem 0;
            p{
                font-size: 18/100rem;
                color:#464646;
            }
            .old-price{
                text-decoration: line-through;
            }
            .new-price{
                color: #f00;
                font-size: 30/100rem;
            }
        }
    }
}
    
</style>
