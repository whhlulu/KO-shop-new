<template>
    <div>
        <div v-title :ata-title="title">{{title}}</div>
        <in-header :text="title"></in-header>
        <div class="data-hd clearfix">
            <span class="text">是否开具发票</span>
            <mt-switch v-model="$store.state.invoice" class="fr"></mt-switch>
        </div>
        <dl class="content-wrap">
            <dt>发票类型</dt>
            <dd class="clearfix">
                <span class="fl" :class="{active:$store.state.type == index}" @click="add('type',index)" v-for="(item,index) in $store.state.type_data" :key="item.id"><em></em>{{item.name}}</span>
            </dd>
        </dl>
        <dl class="content-wrap">
            <dt>发票抬头</dt>
            <dd class="clearfix">
                <span class="fl" :class="{active:$store.state.rise == index}"  v-for="(item,index) in $store.state.res_data" :key="item.id" ><em @click="add('rise',index)"></em>{{item.name}}   
                	<i  class="r el-icon-remove-outline" @click="deletes(index,item)"></i>
                </span>
            </dd>
            <dd class="input-wrap">
                <input placeholder="请输入发票抬头" v-model="val">
                <span class="btn" v-show="val" @click="append">确定</span>
            </dd>
        </dl>
        <dl class="content-wrap">
            <dt>发票内容</dt>
            <dd class="clearfix">
                <span class="fl" :class="{active:$store.state.content == index}" @click="add('content',index)" v-for="(item,index) in $store.state.content_data" :key="item.id"><em></em>{{item.name}}</span>
            </dd>
        </dl>
        <btn :text="text" :to="'/order'+$route.params.status"></btn>
    </div>
</template>
<script>
	import { MessageBox,Toast,Popup } from 'mint-ui';
	import QS from "qs"
    import { Switch } from 'mint-ui';
    import inHeader from '@/components/page/children/header.vue';
    import btn from '@/components/Widget/fixedBtn';
    export default {
        name : 'invoice',
        data(){
            return {
                title:'发票信息',
                text:'确定',
                val:'',
                deleted:false
            }
        },
        components:{
            inHeader,
            btn
        },
        mounted () {
				this.getAllInvoice();
        },
        methods:{
            //获取发票
            getAllInvoice(){
                this.axios({
	              url:this.$httpConfig.getAllInvoice,
	              methods:'post',
	              params:{
                    }
	          }).then(res =>{
	          	
	          	this.$store.state.type_data=res.data.data.invoiceType;
	          	this.$store.state.res_data=res.data.data.invoiceCompany;
	          	this.$store.state.content_data=res.data.data.content;
	          })
            },
            add(item,index){
                switch(item){
                    case 'type':
                        this.$store.state.type = index;
                        this.$store.state.type_id = this.$store.state.type_data[index].id;
                        break;
                    case 'rise':
                        this.$store.state.rise = index;
                        this.$store.state.rise_id = this.$store.state.res_data[index].id;
                        break;
                    case 'content':
                        this.$store.state.content = index;
                        this.$store.state.content_id = this.$store.state.content_data[index].id;
                        break;
                }
            },
            append(){
            	if(this.val.length>=10){
            		Toast('抬头太长')
            		return;
            	}
            	this.axios.post(this.$httpConfig.invoicesAreRaisedAdd,QS.stringify({
                    name:this.val
                })).then((res) => {
                    if(res.data.status == 1){
                        Toast({
                            message:res.data.message
                        });
                         this.getAllInvoice();
                         this.val = '';
                    }   	
                }).catch((err) => {
                	Toast("抬头重复")
                    console.log(err)
                });
               
            },
            deletes(index,item){
            	this.axios.post(this.$httpConfig.invoicesAreRaisedDelete,QS.stringify({
                    id:item.id
                })).then((res) => {
                	Toast({
                		message:res.data.message
                	})
                    this.getAllInvoice();
                }).catch((err) => {
                    console.log(err)
                });
            }
        }
    }
</script>
<style lang="less">
    .mint-switch-input:checked + .mint-switch-core {
        border-color: #D19E29;
        background-color: #D19E29;
    }
</style>

<style scoped lang="less">
.r{
	float: right;
}
    .data-hd{
        padding:.2rem;
        background:#fff;
        .text{
            line-height: 32px;
            font-size:.32rem;
            color:#333;
        }
    }
    .content-wrap{
        dt{
            height: .8rem;
            line-height: .8rem;
            font-size:.28rem;
            color:#666;
            padding:0 .2rem;
        }
        dd{
            background:#fff;
            padding:0 .2rem;
            span{
                height: .9rem;
                line-height: .9rem;
                width: 50%;
                box-sizing: border-box;
                padding-left:.6rem;
                font-size:.32rem;
                color: #666;
                position:relative;
                em{
                    position:absolute;
                    left:0%;
                    top:.24rem;
                    width: .4rem;
                    height: .4rem;
                    border:1px solid #c5c5c5;
                    border-radius:50%;
                    box-sizing: border-box;
                }
                i{
                	font-size: .4rem;
                	line-height: 200%;
                	margin-right: .3rem;
                	color: #FF0000;
                }
            }
            span.active{
                em{
                    background:url(../../assets/check_bj.png) no-repeat;
                    background-size:100% 100%;
                    border:none;
                }
            }
        }
        .input-wrap{
            padding:.2rem;
            position:relative;
            .btn{
                position:absolute;
                right:.2rem;
                top:50%;
                height: .6rem;
                width: 1rem;
                padding:0;
                margin-top:-.3rem;
                text-align: center;
                line-height: .6rem;
            }
            input{
                width: 7.1rem;
                height: .67rem;
                background:#f1f1f1;
                border:none;
                outline:none;
                text-indent: 2em;
                font-size:.26rem;
                color:#333;
            }
        }
    }
</style>