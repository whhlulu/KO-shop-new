<template>
    <div>
        <div class="hd clearfix" v-for="item in text">
        	<div class="top">
        		 <div class="title fl" >{{item.class_name}}</div>
           		 <span class="more fr" @click="tolin">更多<em><i></i><b></b></em></span>
        	</div>
            <img class="banner" :key="item.id" :src="URL+item.pic_url"/>
            <hot-goods :data="text.goods"></hot-goods>
        </div>
    </div>
</template>
<script>
	import hotGoods from './hotGoods'; //头部内容
    export default {
        name : 'conHeader',
        data(){
            return {

            }
        },
        props:{
            text:null,
            toLink:null,
            status:''
        },
        methods:{
            tolin(){
//              if(this.toLink.indexOf('/') >= 0){
//                  this.$router.push(this.toLink);
//              }else{
                    this.$router.push({
                         path: '/latestProm',
                        params:{
                            status:this.status
                        }
                    });
//              }
            }
        },
         components: {
          	'hot-goods':hotGoods
           
        }
    }
</script>
<style scoped lang="less">
    .hd{
       /* padding:.2rem;*/
      .top{padding:.2rem;overflow: hidden;}
        .title{
            border-left:3px solid #E8C441;
            padding-left:.2rem;
            font-size:.32rem;
            color:#111111;

        }
        .more{
            line-height:.4rem;
            color:#999;
            font-size:.28rem;
            position:relative;
            padding-right:.2rem;
            em{
                position:absolute;
                right:0;
                top:.07rem;
                i{
                    border-left:6px solid #ccc;
                    border-top:6px solid transparent;
                    border-bottom:6px solid transparent;
                    position:absolute;
                    right:-.04rem;
                    top:0;
                }
                b{
                    border-left:6px solid #f2f2f2;
                    border-top:6px solid transparent;
                    border-bottom:6px solid transparent;
                    position:absolute;
                    right:0;
                    top:0;
                }
            }
        }
        .banner{
            width: 7.5rem;
            height: 3.75rem;
        }
    }
</style>