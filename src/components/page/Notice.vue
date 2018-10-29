<template>
    <div class="notice-wrap">
        <div v-title :data-title="text">{{text}}</div>
        <header class="header"><span @click="Return"></span>{{text}}</header>
        <div class="content-wrap">
            <ul class="content">
                <li v-for="item in items" :key="item.id" @click="hit(item.id)">
                    <img src="../../assets/images/B_inform.png">
                    <p>{{item.title}}</p>
                </li>
            </ul>
        </div>

        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    export default {
        name : 'notice',
        data(){
            return {
                text:this.$constant.mainName+'公告',
                items:'',
                scrollWatch:true,
                load_wrap:true
            }
        },
        methods:{
            Return:function(){
                this.$router.go(-1);
            },
            hit(id){
            	this.$router.push({
            		name:'noticeChild',
            		params:{
            			id:id
            		}
            	})
            }
        },
        mounted() {
            document.body.scrollTop = 0;
        },
        created(){
            this.axios({
                url:this.$httpConfig.home,
                method:'post',
            }).then(res => {
                this.items = res.data.data.announcement;
            }).catch(err => {
                console.log(err)
            });
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        destroyed(){
            this.scrollWatch = false;
        }
    }
</script>
<style lang="less" scoped>
    .notice-wrap{
        .header{
            width:100%;
            height:.9rem;
            background: #C79A01;
            text-align:center;
            line-height:.9rem;
            color:#fff;
            font-size:.36rem;
            position:relative;
            span{
                width:.46rem;
                height:.46rem;
                border-radius:50%;
                display:block;
                position:absolute;
                left:.2rem;
                top:50%;
                margin-top:-.23rem;
                text-align:center;
                line-height:.46rem;
                font-family:'宋体';
                font-size:.4rem;
                background:url(../../assets/btn-return.png) no-repeat;
                background-size:100% 100%;
            }
        }
        .content-wrap{
             padding-top:.2rem;
             background:#f2f2f2;
            .content{
                background:#fff;
                li{
                    background:#fff;
                    padding:.2rem 0;
                    margin:0 .2rem;
                    border-bottom:1px solid #dfdfdd;
                    position:relative;
                    height:.53rem;
                    line-height:.53rem;
                    padding-left:.7rem;
                    img{
                        width:.53rem;
                        height:.53rem;
                        position:absolute;
                        left:0;
                        top:.2rem;
                    }
                    p{
                        font-size:.32rem;
                        color:#333333;
                        line-height:.53rem;
                        width:6.4rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
</style>