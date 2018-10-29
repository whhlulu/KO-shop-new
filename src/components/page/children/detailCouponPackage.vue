<template>
	<transition name="fade">
		<div class="detail-wrap" v-show="$store.state.const_coupon">
			<div class="content-main">
				<div class="title">优惠券列表<i @click="cancel"></i></div>
				<div class="padd">
					<div class="order_tab_item">
						<div  :class="showAble?'cur':''" @click="showAbleFun(true)">
							<span>可用</span>
						</div>
						<div :class="showAble?'':'cur'" @click="showAbleFun(false)">
							<span>不可用</span>
						</div>
					</div>
					<ul v-if="showAble" class="contet-item-box content-scroll">
						<li class="coupon-item" v-show="item.store_id == $store.state.const_coupon_num" v-for="(item,index) in do_use_list" :key="index" @click="select(item,index)">
							<div class="coupon-main">
								<div class="price-box">
									<p class="price">
                    <i>￥</i>
                    <span class="big">{{item.money.substring(item.money.indexOf('.'),0)}}</span>
                    <span>{{item.money.substring(item.money.indexOf('.'))}}</span>
                    </p>
									<p class="price-limit">满{{item.condition}}元可用</p>
								</div>
								<div class="info">
									<p class="info_text">
										<i class="info_type">{{item.name}}</i> 
									</p>
									<p style="display: none;">{{item.code}}</p><!--这行不要删-->
									<p class="info_date ">{{item.start_time}}  —  {{item.end_time}}</p>
								</div>
								<div v-if="item.isSelect" class="check"></div>
								<div v-else class="no-check"></div>
							</div>
						</li>
					</ul>
					<ul v-else class="contet-item-box content-scroll gray">
						<li v-show="item.store_id == $store.state.const_coupon_num" class="coupon-item" v-for="(item,index) in do_not_use_list" :key="index" @click="notSelect">
							<div class="coupon-main">
								<div class="price-box">
									<p class="price"><i>￥</i>{{item.money}}</p>
									<p class="price-limit">满{{item.condition}}元可用</p>
								</div>
								<div class="info">
									<p class="info_text">
										<i class="info_type">{{item.name}}</i> 
									</p>
									<p class="info_date ">{{item.start_time}}  -  {{item.end_time}}</p>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="btn-join clearfix">
					<button class="join fl" @click="confirm">确认</button>
					<button class="fl imm" @click="cancel">取消</button>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import qs from "qs";
import { Toast } from "mint-ui";
export default {
  name: "detailOptions",
  data() {
    return {
      showAble: true,
      do_not_use_list: [],
      do_use_list: [],
      selectItem: [],
      money:[],
      price:0
    };
  },
  computed: {},
  mounted() {
    this.$store.state.const_coupon_money = [];
    this.$store.state.const_coupon_price_package = [];
    this.getCouponFun();
  },
  methods: {
    getCouponFun() {
      this.axios
        .post(
          this.$httpConfig.getCoupons
        )
        .then(res => {
          if(res.data.status){
            let useList = res.data.data.do_use;
            let notList = res.data.data.do_not_use;
            for (var i in useList) {
              this.do_use_list.push(useList[i]);
            }
            for (var i in this.do_use_list) {
              var start_time = this.stamp2time(
                this.do_use_list[i].use_start_time
              );
              var end_time = this.stamp2time(this.do_use_list[i].use_end_time);
              this.do_use_list[i].isSelect = false;
              this.do_use_list[i].start_time = start_time;
              this.do_use_list[i].end_time = end_time;
            }
            for (var i in notList) {
              this.do_not_use_list.push(notList[i]);
            }
            for (var i in this.do_not_use_list) {
              var start_time = this.stamp2time(
                this.do_not_use_list[i].use_start_time
              );
              var end_time = this.stamp2time(
                this.do_not_use_list[i].use_end_time
              );
              this.do_not_use_list[i].start_time = start_time;
              this.do_not_use_list[i].end_time = end_time;
              }
          }

        });
    },
    stamp2time(value) {
      var time = new Date(Number(value) * 1000);
      var Y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return Y + "-" + m + "-" + d;
    },
    showAbleFun(status) {
      this.showAble = status;
    },
    confirm() {
      if(this.selectItem.length == 0){
        this.cancel();
        this.$store.state.const_coupon_price_package[this.$store.state.const_coupon_price_package_index] = 0;
      }else{
        var item = {
          store_id:this.$store.state.const_coupon_num,
          money:this.selectItem.money,
          name:this.selectItem.name
        }
        this.$store.state.const_coupon_money.push(item);
        this.$store.state.select_coupon = this.selectItem;
        this.cancel();
        this.price = Number(this.selectItem.money);
        this.$store.state.const_coupon_price_package[this.$store.state.const_coupon_price_package_index] = this.price;
      }
      this.$store.state.const_coupon_price = 0;
      for(var i in this.$store.state.const_coupon_price_package){
        this.$store.state.const_coupon_price += this.$store.state.const_coupon_price_package[i]
      }
        this.selectItem = [];
    },
    select(item, index) {
      this.selectItem = item;
      this.axios
        .post(
          this.$httpConfig.checkCoupons,
          qs.stringify({
            id: item.c_id,
            coupon_list_id:item.id
          })
        )
        .then((res) => {
          if(res.data.status){
            for (var i in this.do_use_list) {
              this.do_use_list[i].isSelect = index == i ? true : false;
              this.do_use_list[i].code = this.do_use_list[i].name + index;
            }
          }else{
            Toast(res.data.message)
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    cancel() {
      this.$store.state.const_coupon = false;
      this.showAble = true;
    },
    notSelect() {
      Toast("非常抱歉，该优惠券不可用！");
      this.cancel();
    }
  }
};
</script>
<style type="text/css">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
	.fade-leave-to
	/* .fade-leave-active below version 2.1.8 */
	
	 {
  opacity: 0;
}
</style>
<style lang="less" scoped>
.r {
  float: right;
}

.detail-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .content-main {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    .title {
      position: relative;
      height: 46px;
      line-height: 46px;
      padding-left: 10px;
      font-size: 16px;
      color: #333;
      background-color: #f7f7f7;
      i {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 46px;
      }
      i::before {
        content: "";
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        background-size: 100%;
        background-image: url(../../../assets/close.png);
      }
    }
    .padd {
      padding: 7px;
      .order_tab_item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        height: 30px;
        border-bottom: 1px solid #eee;
        div {
          display: inline-flex;
          width: 50%;
          justify-content: center;
        }
        .cur {
          color: #ff0000;
          span {
            border-bottom: 1px solid #f00;
            line-height: 30px;
          }
          span::after {
            content: "";
            height: 2px;
          }
        }
      }
      .gray {
        color: #666 !important;
        .coupon-item {
          color: #666 !important;
          .info_type {
            background-color: #666 !important;
          }
        }
      }
      .contet-item-box {
        .coupon-item {
          position: relative;
          color: #fb0002;
          border: 1px dotted #eee;
          margin: 0 0 15px 0;
          padding: 7px 10px 10px;
          border-top: 6px solid currentColor;
          box-shadow: 0 0 6px 0 rgba(2, 5, 3, 1);
          border-radius: 6px;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
          .coupon-main {
            display: flex;
            align-items: center;
            min-height: 62px;
            color: currentColor;
            .price-box {
              width: 110px;
              margin-right: 10px;
              line-height: 1;
              text-align: center;
              display: -webkit-box;
              display: -webkit-flex;
              display: flex;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal;
              -webkit-flex-direction: column;
              flex-direction: column;
              -webkit-box-pack: center;
              -webkit-justify-content: center;
              justify-content: center;
              .price {
                i {
                  font-size: 12px;
                  vertical-align: top;
                  // margin: 3px 4px 0 0;
                }
                span.big {
                  font-weight: 400;
                  font-size: 40px;
                  position: relative;
                }
                text-overflow: ellipsis;
                // overflow: hidden;
                white-space: nowrap;
              }
              .price-limit {
                font-size: 12px;
                margin-top: 5px;
              }
            }
            .info {
              flex: 1;
              position: relative;
              height: 60px;
              .info_text {
                height: 36px;
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-size: 12px;
                color: #666;
                .info_type {
                  background-color: #fb0002;
                  color: #fff;
                  font-size: 12px;
                  display: inline-block;
                  padding: 0 6px 0 12px;
                  height: 14px;
                  margin-right: 4px;
                  line-height: 14px;
                  position: relative;
                  border-radius: 0 3px 3px 0;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                .info_type::before {
                  position: absolute;
                  z-index: 1;
                  content: "";
                  width: 0;
                  top: 0;
                  left: -7px;
                  height: 0;
                  border-top: 7px solid #fff;
                  border-right: 7px solid transparent;
                  border-bottom: 7px solid #fff;
                  border-left: 7px solid #fff;
                }
                .info_type::after {
                  content: ".";
                  position: absolute;
                  color: #fff;
                  left: 5px;
                  top: -6px;
                  font-size: 20px;
                }
              }
              .info_date {
                position: absolute;
                left: 0;
                bottom: 0;
                box-sizing: border-box;
                width: 100%;
                line-height: 20px;
                font-size: 10px;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .check {
              width: 18px;
              height: 18px;
              border: 3px solid #fff;
              box-shadow: 0 0 0 2px #f00;
              border-radius: 50%;
              background-color: #f00;
              box-sizing: border-box;
            }
            .no-check {
              width: 20px;
              height: 20px;
              border: 1px solid #f00;
              border-radius: 50%;
            }
          }
        }
      }
      .content-scroll {
        height: 7rem;
        overflow-y: scroll;
      }
    }
    .btn-join {
      button {
        width: 50%;
        border: none;
        height: 1rem;
        line-height: 1rem;
        color: #fff;
        font-size: 0.32rem;
      }
      .join {
        background: #e9c440;
      }
      .imm {
        background: #d19e29;
      }
    }
  }
}
</style>