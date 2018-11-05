<template>
  <div class="box">
      <div v-title data-title="我要开店">我要开店</div>
      <top-header :text = "title"></top-header>
      <div class="boxChild">
            <h4>《诚信经营承诺书》</h4>
            <p>{{agreementContent1}}</p>
      </div> 
      <header>
            <img v-if="promise" class="okPng" @click="promiseClick" :src="xuanzhong" alt="">
            <div v-if="!promise"  class="noPng" @click="promiseClick"></div>
          <div @click="detailFun('诚信经营承诺书')">查看详情<img class="rightImg" :src="rightImgs" alt=""></div>
      </header>
       <div class="boxChild">
            <h4>《入驻协议》</h4>
            <p>{{agreementContent2}}</p>
      </div>
       <header>
            <img v-if="settled" class="okPng" @click="settledClick" :src="xuanzhong" alt="">
            <div v-if="!settled" @click="settledClick"  class="noPng"></div>
            <div @click="detailFun('入驻协议')">查看详情<img class="rightImg" :src="rightImgs" alt=""></div>
      </header>
      <button class="btnOk button1"  @click="admission('q')">企业入驻</button>
      <button class="btnNo button2" @click="admission('g')">个人入驻</button>
  </div>
</template>
<script>
import { Field, Popup, Radio, Toast } from 'mint-ui';
import QS from 'qs';	
import topHeader from '@/components/page/children/header.vue';
export default {
  data () {
      return {
          title:'入驻协议',
          rightImgs:require('@/assets/images/right-icon.png'),
          xuanzhong:require('@/assets/images/ok.png'),
          promise:false,
          settled:false,
          agreementContent1:'',
          agreementContent2:'',
      }
  },
  created(){
      //this.agreementAjax();
      this.agreementFun('诚信经营承诺书');
      this.agreementFun('入驻协议');
  },
  methods:{
      detailFun(title){
          this.$store.state.agreenmentName = title;
          this.$router.push({
              name:'agreementDetial'
            })
      },
      agreementFun(title){
        this.axios.post(this.$httpConfig.StoreHelp,QS.stringify({
            title:title
        })).then((res)=>{
            if(title == '诚信经营承诺书'){
                this.agreementContent1 = res.data.data.info;
            }else{
                this.agreementContent2 = res.data.data.info;
            }
        })
      },
      settledClick:function(){
          this.settled = !this.settled;
          
      },
      promiseClick: function(){
          this.promise = !this.promise;
      },
    //入驻
      admission(n){
        sessionStorage.removeItem('admissionInfo');
        sessionStorage.removeItem('kd_address');
        sessionStorage.removeItem('kd_time');
        if(!this.promise){
            Toast({
                message: "请同意承诺书",
                duration: 1000
            });
            return;
      	}
      	if(!this.settled){
            Toast({
                message: "请同意协议",
                duration: 1000
            });
            return;
          }
        this.axios.post(this.$httpConfig.isCheckIn).then((res) => {
            if(res.data.status == 10001){
                this.$router.push("/LogIn");
                return false;
            }
            if(res.data.status == 1) {
                if(n == 'q'){
                    this.$router.push({name:'checkCompanyadd'})
                }else{
                    this.$router.push({name:'checkProadd'})
                }
            }else{
                Toast({
                    message: res.data.message,
                    duration: 1000
                });
            }
            }).catch((err) => {
                console.log(err)
            });
      }
  },
  components:{
      topHeader
  }
}
</script>
<style lang="less" scoped>
.box{
    .boxChild{
        padding: 10/100rem 25/100rem;
        background-color: #fff;
        h4{
            font-size: 34/100rem;
            padding: 20/100rem 10/100rem;
        }
        p{
            font-size: 30/100rem;
            line-height: 120%;
            color: #545454;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal!important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }
}
 .rightImg{
    width: 24/100rem;
    height: 44/100rem;
    margin: 0 10/100rem;
}
header{
    background-color: #F8F8F8;
    height: 90/100rem;
    display: flex;
    padding: 0 30/100rem;
    justify-content: space-between;
    align-items: center;
    color: #999;
    div{
        font-size: 36/100rem;
    }
}
.okPng{
    width: 50/100rem;
    height: 50/100rem;
}
.noPng{
    width: 0.46rem;
    height: 0.46rem;
    border-radius: 50%;
    border:1px solid #CDCDCD;
}
.button1{
    margin-top: 80/100rem;
}
.button2{
    margin-top: 80/100rem;
}
</style>
