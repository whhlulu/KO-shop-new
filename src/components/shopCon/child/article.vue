<template>
	<div>
		<ul class="recommendList" v-if="temList ==0">
			<li v-for="item in hotList" :key="item.id"  @click="enterInto(item.id)">
				<img v-if="item.pic_url" :src="URL+item.pic_url" alt="">
				<img v-else alt="" >
				<p>{{item.title}}</p>
        <div class="more">
				  <span>￥{{item.price}}</span>
        </div>
			</li>
		</ul>
		<ul class="recommendList" v-if="temList == 1">
			<li @click="enterInto(item.id)" v-for="item in goodsAlls.data" :key="item.id">
				<img :src="URL+item.pic_url" alt="">
				<p>{{item.title}}</p>
				<div class="more">
					<span>￥{{item.goods_price}}</span>
					<span class="r">销量:{{item.sales_sum}}</span>
				</div>
			</li>
			<el-pagination class='bttom' 
			  :page-size="10"
			  :pager-count="7"
			  @current-change="handleCurrentChange"
			  layout="prev, pager, next"
			  :total="Number(goodsAlls.count)">
			</el-pagination>
		</ul>
		<ul v-if="temList ==2" class="shopList">
			<div class="bigBox">
				<div class="times"><img :src="timeImg" alt=""><span>{{newOne.create_time}}</span></div>
				<div class="newtitle">
					<div class="title">上新</div>
					<p>上新1件商品</p>
				</div>

				<li class="newCon">
					<div class="content1" @click="enterInto(newOne.id)">
						<img :src="URL+newOne.pic_url" alt="">
						<div>
							<h4>{{newOne.title}}</h4>
							<h6>￥{{newOne.price_member}}</h6>
						</div>
					</div>
				</li>
			</div>
			
			<li class="newCon" v-for="items in allNewsGoods">
				<div class="times"><img :src="timeImg" alt=""><span>{{items.create_time}}</span></div>
				<div class="newtitle">
					<div class="title">上新</div><span>上新{{items.goods.length}}件商品</span></div>
					<div class="content2">
						<div @click="enterInto(item.id)" v-for="item in items.goods" :key="item.id">
							<img :src="URL+item.pic_url" alt="">
							<div>￥{{item.price_member}}</div>
						</div>
					</div>
			</li>
			<li class="newCon" v-show="acticityGoods.length!=0">
				<div class="times"><img :src="timeImg" alt=""><span>9月9日</span></div>
				<div class="newtitle">
					<div class="title miaosha">秒杀</div>
					<p class="timer">
						<count-down v-on:end_callback="countDown()" :currentTime="1526354100" :startTime="1526354100" :endTime="1557890100" :dayTxt="'天'" :hourTxt="'小时'" :minutesTxt="'分钟'" :secondsTxt="'秒'"></count-down>
						<span class="newPos" v-show='finish'>活动已结束！！</span>
					</p>
				</div>
				<div class="content1" v-for="items in acticityGoods" :key="items.id">
					<img :src="conImg" alt="">
					<div >
						<h4>{{items.panic_title}}</h4>
						<h6>￥{{items.panic_price}}</h6>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import { Popup } from "mint-ui";
import CountDown from "vue2-countdown";
import qs from "qs";
export default {
  data() {
    return {
      timeImg: require("@/assets/images/time_icon.png"),
      conImg:'',
      nowday: "",
      endday: "",
      end: "",
      //				count:0,
      finish: "",
      divPage: "",
      allNewsGoods: [],
      acticityGoods: [],
      newOne:{}
    };
  },
  props: ["temList", "hotList", "goodsAlls"],

  created() {
    this.storeDynamicAjax();
  },
  components: {
    CountDown
  },
  mounted() {
    this.nowday = new Date().getTime();
    var date = new Date("2018-05-19 17:48:00");
    this.endday = date.getTime();
    if (this.endday <= this.nowday) {
      this.end = "活动已结束！";
    }
  },
  methods: {
    countDown() {
      this.finish = true;
    },
    handleCurrentChange(val) {
      sessionStorage.setItem("page", val);
      this.axios
        .post(
          this.$httpConfig.storeGoodsAll,
          qs.stringify({
            id: parseFloat(this.$route.params.id),
            page: val
          })
        )
        .then(res => {
          this.goodsAlls.data = res.data.data.data;
          setTimeout(() => {
            document.body.scrollTop = 0;
          }, 50);
        })
        .catch(err => {
          console.log(err);
        });
    },
    enterInto(item) {
      console.log(item)
      this.$router.push({
        name: "product",
        params: {
          id: item,
          status: 1
        }
      });
    },
    storeDynamicAjax() {
      this.axios({
        method: "post",
        url: this.$httpConfig.storeDynamic,
        data: qs.stringify({
          id: parseFloat(this.$route.params.id)
        })
      }).then(res => {
        this.acticityGoods = res.data.data.acticityGoods;
        this.allNewsGoods = res.data.data.allNewsGoods;
        this.newOne = res.data.data.newOne;
      });
    }
  }
};
</script>
<style>
.el-pagination .btn-next,
.el-pagination .btn-prev {
  background: none !important;
}
.el-pager li {
  background: none !important;
}
.el-pagination button:disabled {
  background: none !important;
}
</style>

<style lang="less" scoped>
.recommendList {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  .bttom {
    width: 100%;
    display: flex;
    margin: 0.3rem 0 0 0;
    justify-content: center;
  }
  li {
    margin-top: 2%;
    background-color: #fff;
    width: 49%;
    float: left;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    img {
      width: 100%;
      height: 3.5rem;
      align-self: center;
      border-bottom: 0.5px solid #f2f1f2;
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0.15rem 0.25rem;
      font-size: 28/100rem;
    }
    .more {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 0.5rem;
      span {
        padding: 0 0.25rem;
        font-size: 0.28rem;
        color: #d12f2d;
      }
    }
  }
}

/*// 店铺动态模板*/
.shopList {
  span {
    font-size: 28/100rem;
  }
  .bigBox {
    padding-left: 0.4rem;
    background: #fff;
    .times {
      display: flex;
      padding-top: 0.4rem;
      align-items: center;
      img {
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.1rem;
      }
    }
  }
  .times {
    display: flex;
    margin-top: 0.2rem;
    align-items: center;
    img {
      width: 0.3rem;
      height: 0.3rem;
      margin-right: 0.1rem;
    }
  }
  .newtitle {
    margin: 35/100rem 0 20/100rem;
    display: flex;
    align-items: center;
    .title {
      margin-right: 20/100rem;
      display: flex;
      width: 90/100rem;
      height: 40/100rem;
      border: 3/100rem solid #46e26e;
      color: #46e26e;
      border-radius: 40/100rem;
      justify-content: center;
      align-items: center;
    }
    p {
      font-size: 28/100rem;
      span {
        background-color: #3b3b3b;
        color: #fff;
        padding: 0.05rem;
        border-radius: 5/100rem;
      }
    }
    .miaosha {
      border: 3/100rem solid #f3d798;
      color: #f3d798;
    }
  }
  li {
    background-color: #fff;
    margin-top: 20/100rem;
    padding: 0.35rem 0.25rem 0.3rem;
    .content1 {
      margin-bottom: 0.2rem;
      display: flex;
      img {
        width: 2.25rem;
        height: 2.25rem;
      }
      div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 50/100rem 0.5rem 30/100rem;
        h4 {
          font-size: 24/100rem;
		  color: #909090;
		  margin-top: .1rem;
		  text-overflow:ellipsis;
		  overflow: hidden;
		  white-space: normal!important;
		  display: -webkit-box;
			word-wrap:break-word;
			-webkit-line-clamp:3;
			-webkit-box-orient: vertical;
        }
        h6 {
          font-size: 32/100rem;
          color: #333;
        }
      }
    }
    .content2 {
      display: flex;
      flex-wrap: wrap;
      div {
        position: relative;
        img {
          width: 2.25rem;
          height: 2.25rem;
          margin-right: 5/100rem;
          margin-bottom: 10/100rem;
        }
        div {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.4);
          bottom: 10/100rem;
          width: 2.25rem;
          height: 50/100rem;
          font-size: 0.28rem;
          line-height: 0.5rem;
          text-align: center;
        }
      }
    }
  }
}
</style>