<template>
    <div :endTime="endTime" :callback="callback" :endText="endText" class="timers">
        <slot>
           <span>{{hour}}</span>
           <i>:</i>
           <span>{{Minute}}</span>
           <i>:</i>
           <span>{{second}}</span>
        </slot>
    </div>
</template>
<script>
    export default {
        data(){
           return {
            hour: '',
            Minute:'',
            second:''
           }
        },
        props:{
            endTime:{
                type: Number || String,
                default :'2018/05/13 17:16:01'
            },
            endText:{
               type : String,
               default:'活动已结束'
            },
            callback : {
                type : Function,
                default :''
            }
        },
        mounted () {
          this.countdowm(this.endTime);
        },
        methods: {
            countdowm(timestamp){
                let self = this;
                let timer = setInterval(function(){
                    let nowTime = new Date();
                    let endTime = new Date(timestamp * 1000);
                    let t = endTime.getTime() - nowTime.getTime();
                    if(t>0){
                        let day = Math.floor(t/86400000);
                        let hour=Math.floor((t/3600000)%24);
                        let min=Math.floor((t/60000)%60);
                        let sec=Math.floor((t/1000)%60);
                        hour = hour < 10 ? "0" + hour : hour;
                        min = min < 10 ? "0" + min : min;
                        sec = sec < 10 ? "0" + sec : sec;
                        self.hour =  `${hour}`;
                        self.Minute = `${min}`;
                        self.second = `${sec}`;
                    }else{
                        clearInterval(timer);
                        self.hour =  `00`;
                        self.Minute = `00`;
                        self.second = `00`;
                        self._callback();
                    }
                },1000);
            },
            _callback(){
                if(this.callback && this.callback instanceof Function){
                    this.callback(...this);
                }
            }
        }
    }
</script>
<style lang="less" scoped>
     .timers{
        height:.5rem;
        text-align:center;
        padding:0 .5rem;
        font-weight:700;
        line-height:.5rem;
        color:#666;
        margin-top:-.08rem;
        i{
            font-style:normal;
            font-size:.28rem;
            display:inline-block;
            height:100%;
        }
        span{
            display:inline-block;
            box-sizing:border-box;
            -moz-box-sizing:border-box;
            -webkit-box-sizing:border-box;
            text-align:center;
            width:.41rem;
            height:.49rem;
            border:1px solid #d9d9d9;
            background:#fff;
            font-size:.28rem;
            border-radius:3px;
        }
    }
</style>