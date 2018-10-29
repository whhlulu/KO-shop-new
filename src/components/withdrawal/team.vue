<template>
    <div class="pr-tab-wrap">
       <feedb-header :text="title" :set="true"></feedb-header>
       <div class="team">
           <table width="100%" border="0" cellspacing="0" cellpadding="0" class="list">
            <tr>
                 <td align="center" bgcolor="#f9fafa">账号</td>
                 <td align="center" bgcolor="#f9fafa">手机号</td>
                 <td align="center" bgcolor="#f9fafa">注册时间</td>
            </tr>
            <tr class="team_list" v-for="(item,index) in info_list" :key="item.id" :class="{active:item.member_status ==3}">
            <tr class="team_list" v-for="(item,index) in info_list" :key="item.id" :class="{active:item.flag ==1}">
                 <td align="center" bgcolor="#f9fafa">{{item.user_name}}</td>
                 <td align="center" bgcolor="#f9fafa">{{item.mobile}}</td>
                 <td align="center" bgcolor="#f9fafa">{{item.create_time}}</td>
            </tr>
           </table>
       </div>
       <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import feedbHeader from '@/components/page/children/header';
    import QS from 'qs';
    export default {
        name : 'tab',
        data(){
            return {
               title:'我的团队',
               info_list:'',
               page:1,
               nav_list:["会员团队","经销商团队"],
               load:false,
               
            }
        },
        methods:{
            getTeamData(index){
                this.load = true;
                this.info_list = '';
                this.axios.post(API_URL+'Home/Distribution/Myteam',QS.stringify({
                    type:index,app_user_id:sessionStorage.getItem('user_ID')})).then((res) => {
                    this.load = false;
                    this.info_list = res.data.data.data;
                    this.title = '我的团队'+res.data.data.count+'人'
                    
                }).catch((err) => {
                    console.log(err);
                })
            }
        },
        mounted() {
          
        },
        destroyed(){
            this.scrollWatch = false;
        },
        created() {
            this.getTeamData(0);
        },
        components:{
            feedbHeader,
        }
    }
</script>
<style lang="less">
   .pr-tab-wrap {
        .tab-title{
            height:1rem;
            background:#F0F0F0;
            span{
                display:inline-block;
                height:100%;
                width:50%;
                text-align:center;
                line-height:1rem;
                color:#747474;
                font-size:.3rem;
            }
            .active{
                color:#ed3851;
                background: #FFF;
            }
        }
        .team {
            background:#fff;
            padding:0 .2rem;
            .list {
                border:none;
                tr {
                    td {
                        border:none;
                        padding: 15px 0;
                        color:#747474;
                        font-size:.3rem;
                        background:#fff;
                    }
                }
               tr.active td{
                    color:#ed3851;
                }
                .team_list {
                    td{
                        font-size:.26rem;
                        background:#fff;
                    }
                }
            }
        }
   }
</style>