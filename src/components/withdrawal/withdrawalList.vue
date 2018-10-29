<template>
    <div class="pr-tab-wrap">
       <feedb-header :text="title" :set="true"></feedb-header>
       <div class="team">
           <table width="100%" style="word-wrap:break-word; word-break:break-all;" border="0" cellspacing="0"  cellpadding="0" class="list">
            <tr>
                 <td align="center" bgcolor="#f9fafa">提现编号</td>
                 <td align="center" bgcolor="#f9fafa">金额</td>
                 <td align="center" bgcolor="#f9fafa">提现时间</td>
                 <td align="center" bgcolor="#f9fafa">提现方式</td>
                 <td align="center" bgcolor="#f9fafa">状态</td>
            </tr>
            <tr class="team_list" v-for="(item,index) in info_list" :key="item.drawal_id">
                 <td width="20%" bgcolor="#f9fafa">{{item.drawal_id}}</td>
                 <td width="12%" align="center" bgcolor="#f9fafa">{{item.money}}</td>
                 <td width="17%" align="center" bgcolor="#f9fafa">{{item.create_time}}</td>
                 <td width="15%" align="center" bgcolor="#f9fafa">{{item.type}}</td>
                 <td width="10%" align="center" bgcolor="#f9fafa">{{item.status}}</td>
            </tr>
           </table>
       </div>
    </div>
</template>
<script>
    import feedbHeader from '@/components/page/children/header';
    import QS from 'qs';
    export default {
        name : 'tab',
        data(){
            return {
               title:'提现列表',
               info_list:''
            }
        },
        methods:{
            
        },
        mounted() {
          
        },
        destroyed(){
            this.scrollWatch = false;
        },
        created() {
            this.axios.post(API_URL+'Home/Distribution/withdrawalList',QS.stringify({app_user_id:sessionStorage.getItem('user_ID')})).then((res) => {
                this.info_list = res.data.data;
            }).catch((err) => {
                console.log(err);
            })

        },
        components:{
            feedbHeader,
        }
    }
</script>
<style lang="less">
   .pr-tab-wrap {
        .team {
            padding:0 .2rem;
            background:#f9fafa;
            .list {
                border:none;
                tr {
                    td {
                        border:none;
                        padding: 12px 0;
                        color:#747474;
                        font-size:.3rem;
                    }
                }
                .team_list {
                    td{
                        font-size:.26rem;
                        padding-right:.1rem;
                    }
                }
            }
        }
   }
</style>