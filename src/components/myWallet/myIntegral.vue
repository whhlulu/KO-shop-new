<template>
    <div ref="integral_list">
        <div v-title :data-title="title">{{title}}</div>
        <div class="header-bj">
            <integ-header class="header-bg" :text="title" :rule="rule" @addShow="addShow"></integ-header>
            <div class="myInte-banner text-center">
                <p class="title">可用积分</p>
                <p class="number">{{data.integral}}</p>
                <p class="link" @click="tolink('/intOrder')">我的兑换</p>
                <!--      -->
            </div>
        </div>
        <integ-shares :rule="ruleCon" @addShow="addHide"></integ-shares>
        <dl class="accDetails">
            <dt>{{accDetails.title}}</dt>
            <dd class="clearfix" v-for="item in accDetails.content" :key="item.id">
                <div class="fl text">
                    <h2 v-if="item.title">{{item.title}}</h2>
                    <h2 v-else>{{item.remarks}}</h2>
                    <p class="time">{{item.trading_time}}</p>
                </div>
                <div class="fr status" :class="{Profit:item.type == '1'}">{{item.changes_integral}}</div>
            </dd>
        </dl>
        <integ-btn :text="btnText" :to="'/IntegralMall'"></integ-btn>
        <to-top></to-top>

        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
            <mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
        </div>
    </div>
</template>
<script>
import integHeader from '@/components/page/children/header.vue';
import integShares from '@/components/Widget/rule.vue';
import integBtn from '@/components/Widget/fixedBtn.vue';
import toTop from '@/components/page/toTop.vue';
import qs from 'qs';
export default {
    name: 'myIntegral',
    data() {
        return {
            title: '我的积分',
            rule: true,
            ruleCon: false,
            accDetails: {
                title: '积分明细',
                content: []
            },
            btnText: '马上兑换商品',
            data: '',
            load_wrap: true,
            isactive: '',
            slide_switch: false, //避免多次下拉
            load_show: true, //滚动动画
            roll_switch: true, //触发下拉加载开关
            no_data: false, //第一次没数据时的样式
            sliding_no_data: false, //下拉没数据时的样式
            page: 1,
        }
    },
    components: {
        integHeader,
        integShares,
        integBtn,
        toTop
    },
    created() {
        this.goodsList()
        this.userIntegral()
    },
    mounted() {
        let _this = this;
        window.addEventListener('scroll', function () {
            if (!_this.$refs.integral_list) return;
            if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                if (_this.roll_switch == false) {
                    return;
                }
                if (_this.slide_switch == true) {
                    _this.slide_switch = false;
                    _this.page++;
                    _this.goodsList();
                }
            }
        })

    },
    methods: {
        addShow() {
            this.ruleCon = true;
        },
        addHide() {
            this.ruleCon = false;
        },
        tolink() {
            this.$router.push('/intOrder')
        },
        updated() {
            var that = this;
            setTimeout(function () {
                that.load_wrap = false;
            }, 1000);
        },
        goodsList() {
            this.axios.post(this.$httpConfig.integralLog, qs.stringify({
                page: this.page
            })).then((res) => {
                this.stateHandling(res.data.status, res.data.data.records);
                this.load_wrap = false;
            }).catch((err) => {
                console.log(err);
            });
        },
        //请求成功后的操作
        returnOperation(data) {
            if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                this.load_show = false; //动画隐藏
                this.roll_switch = false; //禁止下拉加载
            }
            for (let index = 0; index < data.length; index++) {
                this.accDetails.content.push(data[index]);
            }
            this.slide_switch = true;
        },
        //请求后返回不同状态时的处理
        stateHandling(status, data) {
            this.sw = true;
            if (status == 10001) {
                this.$router.push('/LogIn');
            } else if (status == 1) { //成功后的处理
                this.returnOperation(data);
            } else if (status == 0 && this.page == 1) { //第一次请求失败时
                this.no_data = true; //无数据时的样式
                this.load_show = false; //动画隐藏
                this.roll_switch = false; //禁止下拉加载
            } else { //第二次或更多次无数据时
                this.sliding_no_data = true; //无数据时的样式
                this.load_show = false; //动画隐藏
                this.roll_switch = false; //禁止下拉加载
            }
        },
        userIntegral() {
            this.axios.post(
                this.$httpConfig.userIntegral).then((res) => {
                    if (res.data.status == 10001) {
                        this.$router.push('/LogIn');
                    } else if (res.data.status == 0) {
                        return;
                    } else {
                        this.data = res.data.data;
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }

    },
}
</script>
<style lang="less">
.header-bj {
  background: url(../../assets/images/integral_bg.png) no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 3.62rem;
  position: fixed;
  top: 0;
  .header-bg {
    .header {
      background: none !important;
    }
  }
  .myInte-banner {
    width: 100%;
    height: 2.62rem;
    .title {
      font-size: 0.24rem;
      color: #80060c;
      padding-top: 0.7rem;
    }
    .number {
      font-size: 0.64rem;
      color: #fff;
      padding: 0.1rem 0;
    }
    .link {
      font-size: 0.3rem;
      color: #ffffa0;
    }
  }
}

.accDetails {
    margin-top: 3.62rem;
  dt {
    padding: 0 0.2rem;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.32rem;
    color: #333;
  }
  dd {
    background: #fff;
    padding: 0.2rem;
    border-bottom: 1px solid #dfdfdf;
    height: 0.8rem;
    .text {
      h2 {
        font-size: 0.28rem;
        color: #333;
      }
      .time {
        padding-top: 0.2rem;
        font-size: 0.28rem;
        color: #999;
      }
    }
    .status {
      font-size: 0.32rem;
      color: #d0111b;
      line-height: 0.8rem;
    }
    .status.Profit {
      color: #39ab04;
    }
  }
}
</style>