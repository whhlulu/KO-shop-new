<template>
    <div class="foot2017">
        <ul class="footer clearfix">
            <li class="fl" :class="{isSelected:index+101 == parseInt(isClass)}" v-for="(item,index) in tabbar.font" :key="item.id" @click="tab(index)">
                <div class="icon"><img :src="tabbar.Icon[index]"></div>
                <div class="icon active"><img :src="tabbar.isIcon[index]"></div>
                <div class="font">{{item}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'page-footer',
        data() {
            return {
                isClass:sessionStorage.getItem('router_index'),
                tabbar:{
                    isIcon:[require('@/assets/images/home_icon_active.png'),require('@/assets/images/cart_icon_active.png'),require('@/assets/images/per_icon_active.png')],
                    Icon:[require('@/assets/images/home_icon.png'),require('@/assets/images/cart_icon.png'),require('@/assets/images/per_icon.png')],
                    font:['首页','活动','我的']
                }
            }
        },
        methods:{
            tab:function(index){
                switch(index){
                    case 0:
                        this.$router.push({
                            path:'/KOhome'
                        });
                        break;
//                    case 1:
//                        var CID = sessionStorage.getItem('KOlist_index')?sessionStorage.getItem('KOlist_index'):this.$store.state.categoryLists[0].id
//                        this.$router.push({
//                            path:'/KOlist/'+CID
//                        });
//                        break;
                    case 1:
                        this.$router.push({
                            path:'/home'
                        });
                        break;
                    case 2:
                        this.$router.push({
                            path:'/KOperson'
                        });
                        break;
                }
            }
        },
        watch:{
            '$route'(to,from){
                this.isClass = sessionStorage.getItem('router_index');
            }
        },
        created(){
        }
    }
</script>
<style lang="less" scoped>
    .foot2017{
        width:100%;
        height:1rem;
        .footer{
            width:100%;
            height:1rem;
            position:fixed;
            bottom:0;
            left:0;
            background:#fff;

            z-index:2;
            background:#fff;
            box-shadow: border-box;
            box-sizing: border-box;
            z-index:99999999;
            li{
                width:33.33%;
                text-align:center;

                .font{
                    font-size:.2rem;
                    color:#333;
                    padding-bottom:5/100rem;
                    display: inline-block;
                }
                .icon{
                    height:.55rem;
                    position:relative;
                    display:block;
                    border-top:3px solid #313133;
                    img{
                        position:absolute;
                        left:0;
                        top:0;
                        bottom:0;
                        right:0;
                        margin:auto;
                    }
                }
                .icon.active{
                    display:none;
                    border-top:3px solid #D09D2A;
                }
            }
            li.isSelected{
                .font{
                    color:#D09D2A;
                }
                .icon.active{
                    display:block;
                }

                .icon{
                    display:none;
                }
            }
            li:nth-child(1){
                img{
                    width:.39rem;
                    height:.37rem;
                }
            }
            li:nth-child(10){
                img{
                    width:.43rem;
                    height:.32rem;
                }
            }
            li:nth-child(2){
                img{
                    width:.54rem;
                    height:.41rem;
                }
            }
            li:nth-child(3){
                img{
                    width:.35rem;
                    height:.4rem;
                }
            }
        }
    }
</style>