<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <shares-header :text="title"  :rule="rule" @addShow="addShow"></shares-header>
      <div class="shares-banner-wrap text-center">
          <span class="name inline-block">股票</span><br>
          <span class="number inline-block">12000</span>
      </div>
      <shares-obvious :accDetails="accDetails"></shares-obvious>
      <sharesBtn :text="btnText"></sharesBtn>
      <shares-shares :rule="ruleCon" @addShow="addHide"></shares-shares>
  </div>
</template>
<script>
    import sharesHeader from '@/components/page/children/header.vue';
    import sharesObvious from '@/components/Widget/obviousList.vue';
    import sharesBtn from '@/components/Widget/fixedBtn.vue';
    import sharesShares from '@/components/Widget/rule.vue';
    export default {
        name : 'shares',
        data(){
            return {
                title:'我的股币',
                accDetails:{
                    title:'股票明细',
                    content:[
                        {text:'充值股票',time:'2017/04/15',pr:'+600.00',status:'1'},
                        {text:'在线问答使用积分',time:'2017/04/15',pr:'-600.00',status:'2'},
                        {text:'充值股票',time:'2017/04/15',pr:'+600.00',status:'1'},
                        {text:'在线问答使用积分',time:'2017/04/15',pr:'-600.00',status:'2'}
                    ]
                },
                btnText:'马上充值',
                rule:true,
                ruleCon:false
            }
        },
        methods:{
            addShow(){
                this.ruleCon = true;
            },
            addHide(){
                this.ruleCon = false;
            }
        },
        components:{
            sharesHeader,
            sharesObvious,
            sharesBtn,
            sharesShares
        }
    }
</script>
<style lang="less" scoped>
    .shares-banner-wrap{
        width: 100%;
        height: 2.62rem;
        background:url(../../assets/shares-bg.jpg) no-repeat;
        background-size:100% 100%;
        .name{
            font-size: .24rem;
            color:#80060c;
            padding-top:.54rem;
        }
        .number{
            font-size: .64rem;
            color:#fff;
        }
    }
</style>