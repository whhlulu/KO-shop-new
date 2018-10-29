<template>
    <div class="bar-list-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <list-header :text="title"></list-header>
        <mt-index-list>
            <mt-index-section v-for="(item,index) in data" :key="item.id" :index="item.letter">
                <li v-for="(listItem,n) in item.value" :key="listItem.id" class="clearfix list-golp" @click="toLink(index,n)">
                    <img class="fl" v-lazy="URL + listItem.brand_logo">
                    <span class="fl">{{listItem.brand_name}}</span>
                </li>
            </mt-index-section>
        </mt-index-list>
        <Shopsn></Shopsn>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import listHeader from '@/components/page/children/header.vue';
    import Shopsn from '@/components/page/Shopsn.vue';
    import { IndexList, IndexSection } from 'mint-ui';
    export default {
        name : 'list',
        data(){
            return {
                title:'品牌馆',
                search:true,
                data:null,
                scrollWatch:true,
                load_wrap:true
            }
        },
        methods:{
            toLink(index,n){
                this.$router.push({
                    name:'braDetails',
                    params:{
                        ID:this.data[index].value[n].id
                    }
                });
            }
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        destroyed(){
            this.scrollWatch = false;
        },
        created(){
            document.body.scrollTop = 0;
            this.axios({
                url:this.$httpConfig.brandList,
                method:'post'
            }).then(res => {
                this.data = res.data.data;
            }).catch(err => {
                console.log(err);
            });
        },
        components:{
            listHeader,
            Shopsn
        }
    }
</script>
<style lang="less">
    .bar-list-wrap{
        .mint-indexlist-content{
            width: 100%;
            height: 100%!important;
            -webkit-overflow-scrolling: touch;
            .mint-indexsection{
                .mint-indexsection-index{
                    background:#f6f6f6;
                    font-size:.24rem;
                    color:#333;
                    height: .46rem;
                    line-height: .46rem;
                }
                ul{
                    
                    box-sizing: border-box;
                    background:#fff;
                    li{
                        padding-left:.2rem;
                        border-bottom:.01rem solid #eee;
                    }
                }
            }
        }
        .mint-indexlist-nav{
            border-left:0;
            background:none;
            li{
                font-size:.24rem;
                color:#5bca66;
            }
        }
    }
</style>
<style scoped lang="less">
    .bar-list-wrap{
        .list-golp{
            height: 1rem;
            line-height:1rem;
            color:#333;
            img{
                width: .88rem;
                height: .88rem;
            }
            span{
                font-size:.28rem;
                text-indent:.2rem;
            }
        }
    }

</style>