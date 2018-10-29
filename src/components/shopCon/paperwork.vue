<template>
  <div>
      <shop-header :text="text"></shop-header>
      <h4>{{$constant.mainTitle}}商城网点经营者营业执照信息</h4>
      <p>企业名称：<span>{{shopInfo.company_name}}</span></p>
      <p>营业执照注册号：<span>{{shopInfo.license_number}}</span></p>
      <p>法定代表人电话：<span>{{shopInfo.mobile}}</span></p>
      <p>营业执照所在地：<span>{{shopInfo.address}}</span></p>
      <p>企业注册资金：<span>{{shopInfo.registered_capital}}</span></p>
      <p>营业执照有效期：<span>{{shopInfo.validity_start}}-{{shopInfo.validity_end}}</span></p>
      <p>公司地址：<span>{{shopInfo.address}}</span></p>
      <p>营业执照经营范围：<span>{{shopInfo.scope_of_operation}}</span></p>
      <h6>{{$constant.licence_remark}}</h6>
  </div>
</template>
<script>
import qs from 'qs'
import shopHeader from '@/components/page/children/header.vue';
export default {
  data () {
    return {
        text:'证照信息',
        shopInfo:''
    }
  },
  mounted(){
  	this.work();
  },
  methods:{
  	work(){
  		this.axios.post(this.$httpConfig.shopLicense,qs.stringify({
  			id:this.$route.params.id
  		})).then((res)=>{
  			this.shopInfo=res.data.data
  		}).catch((err)=>{
  			console.log(err)
  		});
  	}
  },
  components:{
      shopHeader
  }
}
</script>
<style lang="less" scoped>
    h4{
        font-size:.32rem;
        text-align: center;
        margin: .2rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    p{
        font-size: .28rem;
        padding: 0 .2rem;
        line-height: .5rem;
        span{
        	font-size: .28rem;
        	line-height: .5rem;
        }
    }
    h6{
        margin-top: .55rem;
        font-size: .28rem;
        font-weight: 600;
        padding: 0 .2rem;
    }
</style>
