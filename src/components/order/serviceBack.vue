<template>
	<div>
		<div v-title :data-title="title">{{title}}</div>
		<servce-header :text="title"></servce-header>
		<div class="product-wrap">
			<div class="hd">
				<p class="number">订单编号&nbsp;:&nbsp;{{goods.order_sn_id}}</p>
				<p class="time">下单时间&nbsp;:&nbsp;{{new Date(goods.create_time * 1000).getFullYear()+'-'+(new Date(goods.create_time * 1000).getMonth()+1)+'-'+new Date(goods.create_time * 1000).getDate()+' '+new Date(goods.create_time * 1000).getHours()+':'+new Date(goods.create_time * 1000).getMinutes()+':'+new Date(goods.create_time * 1000).getSeconds()}}</p>
			</div>
			<div class="dd clearfix">
				<img :src="URL + goods.pic_url" class="fl">
				<div class="fl content">
					<p class="text">{{goods.title}}</p>
					<p class="number">数量：{{goods.goods_num}}</p>
				</div>
			</div>
			<!--<div class="dd clearfix" v-if="!$store.state.order_details.child">
                <img :src="URL + $store.state.order_details.order_goods[$route.params.index].pic_url" class="fl">
                <div class="fl content">
                    <p class="text">{{$store.state.order_details.order_goods[$route.params.index].title}}</p>
                    <p class="number">数量：{{$store.state.order_details.order_goods[$route.params.index].goods_num}}</p>
                </div>
            </div>-->
		</div>
		<dl class="type-wrap clearfix">
			<dt class="fl">服务类型</dt>
			<dd class="fl" :class="{active:isType.status[index]}" v-for="(item,index) in isType.text" :key="item.id" @click="addClass(index)">{{item}}<em></em></dd>
		</dl>
		<div class="amount-wrap">
			<h2 class="title">申请数量</h2>
			<div class="input-main and">
				<button class="fl" @click="conversion('plus')">-</button>
				<input class="fl" v-model="isNumber" @input="inputPlus">
				<button class="fl" @click="conversion('reduce')">+</button>
			</div>
			<p class="max">您最多可提交数量为<span class="red">{{goods.goods_num}}</span>个</p>
		</div>
		<div class="amount-wrap" v-show="ser_type == 1 || ser_type == 2">
			<h2 class="title">申请金额</h2>
			<div class="input-main">
				<!-- <input type="number" v-model="adAmount" @input="input">&nbsp;&nbsp;元 -->
				<div><span class="red money">{{adAmount}}</span>元</div>
			</div>
			<p class="max">您最多可申请<span class="red">{{total_price}}</span>元，不含发货邮费{{this.$route.params.feight}}元</p>
		</div>
		<div class="explain-wrap">
			<h2 class="title">{{explain}}</h2>
			<textarea placeholder="请您在此描述详细理由..." v-model="explain_type"></textarea>
			<div class="img-wrap clearfix">
				<div class="list-img fl" v-for="(imgas,index) in imgs" :key="imgas.id" v-show="imgs.length >= 1" @click="imgShow(index)">
					<i class="del el-icon-circle-close" @click="del(index)"></i>
					<img :src="URL+imgas">
				</div>
				<div class="input-btn fl" v-show="imgs.length < 3">
					<input type="file" @change="add_img($event)" ref="int">
				</div>
			</div>
			<p class="addMost">最多添加3张，每张不超过5M，支持jpg、bmp、png</p>
      <p class="addMost">
        宽度范围：{{this.imgConfig.min_comment_width}}~{{this.imgConfig.max_comment_width}}  &nbsp;&nbsp;
        高度范围：{{this.imgConfig.min_comment_height}}~{{this.imgConfig.max_comment_height}}
      </p>
		</div>
		<div class="form-btn-wrap">
			<button @click="request">确认申请</button>
		</div>
	</div>
</template>
<script>
import servceHeader from "@/components/page/children/header.vue";
import { Toast } from "mint-ui";
import qs from "qs";
export default {
  name: "serviceBack",
  data() {
    return {
      title: "申请售后",
      isType: {
        text: ["退货", "退款", "维修", "换货"],
        status: [false, false, false, false]
      },
      adAmount: 0.0,
      number: 100,
      isNumber: 1,
      imgLength: 0,
      imgs: [],
      explain: "",
      ser_type: 1,
      explain_type: "",
      goods: [],
      token: "",
      s_token: "",
      total_price:0.0,
      imgConfig:{}
    };
  },
  methods: {
    addClass(index) {
      for (var i = 0; i < this.isType.status.length; i++) {
        this.$set(this.isType.status, i, false);
      }
      this.$set(this.isType.status, index, true);
      switch (index) {
        case 0:
          this.ser_type = 1;
          break;
        case 1:
          this.ser_type = 2;
          break;
        case 2:
          this.ser_type = 3;
          break;
        case 3:
          this.ser_type = 0;
      }
    },
    input() {
      if (this.adAmount > this.total_price) {
        Toast({
          message: "退款金额不能大于商品金额",
          position: "bottom"
        });
        this.adAmount = this.total_price;
      }
    },
    add_img(e) {
      var self = this;
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        self.yellow = this.result;
      };
      let param = new FormData(); // 创建form对象
      param.append("fileData", file, file.name); // 通过append向form对象添加数据
      param.append("imageToken", this.token);
      param.append("sessionToken", this.s_token);
      param.append("chunk", "0"); // 添加form表单中其他数据
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.axios
        .post(
          this.$httpConfig.uploadImageByImageComment,
          param,
          config
        )
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.push("/LogIn");
          } else {
            if (res.data.status == 1) {
              this.imgs.push(res.data.data);
            } else {
              Toast(res.data.message);
            }
          }
        });
      this.$refs.int.value = "";
    },
    del(index) {
      this.imgs.splice(index, 1);
    },
    imgShow(index) {
      this.maximg = this.imgs[index];
    },
    hideImg() {
      this.maximg = null;
    },
    conversion(obj) {
      if (obj === "plus") {
        if (this.isNumber <= 1) {
          Toast({
            message: "退货不能少于1个哦",
            position: "bottom"
          });
          return;
        }
        this.isNumber--;
      } else {
        if (this.isNumber >= this.goods.goods_num) {
          Toast({
            message: "最多可退" + this.goods.goods_num + "个哦！",
            position: "bottom"
          });
          return;
        }
        this.isNumber++;
      }
        this.adAmount = parseFloat(this.isNumber)*parseFloat(this.goods.goods_price);
    },
    inputPlus() {
      if (Number(this.isNumber) > Number(this.goods.goods_num)) {
        Toast('申请数量不能超过'+this.goods.goods_num);
        this.isNumber = 1;
      }else{
        this.adAmount = parseFloat(this.isNumber)*parseFloat(this.goods.goods_price);
      }
    },
    request() {
      if (!this.explain_type){
		  Toast('请填写说明信息!!');
		  return false;
	  } else if(!this.imgs.length) {
        Toast("请上传图片!!");
        return false;
      } else{
        this.axios
          .post(
            this.$httpConfig.customerService,
            qs.stringify({
              order_id: this.goods.order_id,
              goods_id: this.goods.goods_id,
              store_id: this.goods.store_id,
              type: this.ser_type,
              explain: this.explain_type,
              apply_img: this.imgs,
              price: this.adAmount,
              number: this.isNumber
            })
          )
          .then(res => {
            if (res.data.status == 10001) {
              this.$router.push("/LogIn");
            } else {
              if(res.data.status==1){
                  Toast(res.data.message+'，即将回到订单详情页面.');
                setTimeout(()=>{
                  this.$router.back(-1);
                },700);
              }else{
                Toast({
                  message: res.data.message
                });
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  mounted() {
    this.axios.post(this.$httpConfig.getCommentImageConfig)
      .then(res => {
        this.imgConfig = res.data.data.config;
        this.token = res.data.data.token;
        this.s_token = res.data.data.s_token;
        console.log(this.imgConfig)
      })
      .catch(err => {
        console.log(err);
      });
    this.axios
      .post(
        this.$httpConfig.orderInfoReturnGoods,
        qs.stringify({
          id: this.$route.params.id,
          goods_id: this.$route.params.goods_id
        })
      )
      .then(res => {
        if (res.data.status == 10001) {
          this.$router.push("/LogIn");
        } else {
          this.goods = res.data.data;
          this.total_price = parseFloat(this.goods.goods_price)*parseFloat(this.goods.goods_num);
          this.adAmount = this.goods.goods_price;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    this.ser_type = this.$route.params.type;
    switch (this.$route.params.type) {
      case 1:
        // 退款
        {
            this.isType.status = [false,true,false,false];
        }
        break;
    
      case 0:
        // 退货
        this.isType.status = [true,false,false,false];
        break;
    
    
      case 2:
        // 维修
        this.isType.status = [false,false,true,false];
        break;
    
    
      case 3:
        // 换货
        this.isType.status = [false,false,false,true,];
        break;
    
      default:
        break;
    }
    if (this.$route.params.status == "refund") {
      this.title = "申请退款";
      this.explain = "退货说明";
    } else {
      this.title = "申请售后";
      this.explain = "售后说明";
    }
    if (this.$store.state.order_details.child) {
      this.adAmount = this.$store.state.order_details.child[
        this.$route.params.index
      ].goods_price;
      switch (this.$route.params.status) {
        case "refund":
          this.ser_type = 2;
          break;
      }
      this.isNumber = this.$store.state.order_details.child[
        this.$route.params.index
      ].goods_num;
    } else {
    }
  },
  components: {
    servceHeader
  }
};
</script>
<style scoped>
.red{
  color: red;
  margin:0 5px;
}
.money{
  border:1px solid #888;
  padding: .15rem .7rem;
  border-radius: .5rem;
  font-size: 15px;
}
</style>

<style lang="less">
.explain-wrap {
  .el-upload.el-upload--picture-card {
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    i {
      line-height: 1.5rem;
      font-size: 0.5rem;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 1.5rem;
    height: 1.5rem;
  }
  .el-upload-list--picture-card .el-upload-list__item-status-label {
    right: -0.15rem;
    top: -0.06rem;
    width: 0.4rem;
    height: 0.24rem;
    i {
      font-size: 0.12rem;
      margin-top: 0.11rem;
    }
  }
  .img-wrap.active {
    .el-upload.el-upload--picture-card {
      display: none;
    }
  }
  .el-dialog--tiny {
    width: 50%;
  }
}
</style>
<style lang="less" scoped>
.product-wrap {
  width: 7.1rem;
  padding: 0 0.2rem;
  border-bottom: 1px solid #dfdfdd;
  background: #fff;
  .hd {
    padding: 0.3rem 0;
    border-bottom: 1px solid #dfdfdd;
    .number {
      font-size: 0.25rem;
      color: #333;
      padding-bottom: 0.2rem;
    }
    .time {
      font-size: 0.25rem;
      color: #757575;
    }
  }
  .dd {
    padding: 0.4rem 0;
    height: 1.46rem;
    background: #fff;
    img {
      width: 1.46rem;
      height: 1.46rem;
    }
    .content {
      width: 5.1rem;
      padding: 0 0.2rem;
      .text {
        font-size: 0.25rem;
        color: #333;
        line-height: 0.39rem;
        height: 0.78rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .number {
        font-size: 0.25rem;
        color: #999;
        padding-top: 0.3rem;
      }
    }
  }
}

.type-wrap {
  margin-top: 0.2rem;
  width: 7.1rem;
  padding: 0 0.2rem 0.63rem;
  border-top: 1px solid #dfdfdd;
  border-bottom: 1px solid #dfdfdd;
  background: #fff;
  dt {
    width: 100%;
    padding: 0.4rem 0 0.35rem 0;
    font-size: 0.3rem;
    color: #333;
  }
  dd {
    width: 1.5rem;
    height: 0.83rem;
    border: 2px solid #757575;
    text-align: center;
    line-height: 0.83rem;
    border-radius: 5px;
    margin-right: 0.3rem;
    font-size: 0.25rem;
    color: #333;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    background-color: #999;
    pointer-events:none;
    // display: none;
  }
  dd.active {
    // display: block;
    border-color: #d19e29;
    color: #d19e29;
    background: #fff;
    em {
      position: absolute;
      right: -0.25rem;
      bottom: -0.25rem;
      width: 0.5rem;
      height: 0.5rem;
      background: #d19e29;
      transform: rotate(45deg);
    }
  }
  dd:nth-child(5n) {
    margin-right: 0;
  }
}

.amount-wrap {
  padding: 0.57rem 0.2rem 0.41rem;
  border-bottom: 1px solid #dfdfdd;
  background: #fff;
  .title {
    font-size: 0.3rem;
    color: #333;
    padding-bottom: 0.35rem;
  }
  .input-main {
    height: 0.78rem;
    overflow: hidden;
    line-height: 0.78rem;
    font-size: 0.28rem;
    color: #999;
    input {
      width: 2.36rem;
      height: 0.78rem;
      border: 1px solid #d4d4d4;
      border-radius: 5px;
      box-sizing: border-box;
      font-size: 0.43rem;
      color: #e02828;
      text-align: center;
      outline: none;
    }
  }
  .input-main.and {
    input {
      width: 1rem;
      border-radius: 0;
      border-left: 0;
      border-right: 0;
      color: #757575;
    }
    button {
      width: 0.78rem;
      height: 0.78rem;
      background: #fff;
      border: none;
      outline: none;
      color: #757575;
      font-size: 0.5rem;
      border: 1px solid #d4d4d4;
      border-radius: 0 5px 5px 0;
    }
    button:active {
      background-color: #d4d4d4;
      color: #fff;
    }
    button:nth-child(1) {
      border-radius: 5px 0 0 5px;
    }
  }
  p.max {
    font-size: 0.25rem;
    color: #999;
    padding-top: 0.23rem;
  }
}

.explain-wrap {
  margin-top: 0.2rem;
  border-top: 1px solid #dfdfdd;
  border-bottom: 1px solid #dfdfdd;
  padding: 0 0.2rem;
  margin-bottom: 0.2rem;
  background: #fff;
  .img-wrap {
    width: 100%;
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    .list-img {
      margin-right: 0.3rem;
      margin-top: 0.2rem;
      position: relative;
      width:30%;
      img {
        width: 2rem;
        height: 2rem;
      }
      .del {
        position: absolute;
        top: -0.15rem;
        right: -0.15rem;
        font-size: 0.5rem;
        color:#f00;
        background-color:#fff;
        border-radius:50%;
        border:none;
      }
    }
    .list-img:nth-child(4n) {
      margin-right: 0;
    }
    .input-btn {
      position: relative;
      overflow: hidden;
      width: 2rem;
      height: 2rem;
      background: url(../../assets/img-btn.jpg) no-repeat;
      background-size: 100% 100%;
      margin-top: 0.2rem;
      input {
        width: 200%;
        height: 200%;
        position: absolute;
        left: -100%;
        top: -100%;
        outline: none;
      }
    }
  }
  .title {
    font-size: 0.25rem;
    color: #333;
    padding: 0.45rem 0 0.33rem;
  }
  textarea {
    width: 7.1rem;
    height: 1.2rem;
    padding: 0.2rem;
    resize: none;
    border: 1px solid #dfdfdd;
    font-size: 0.25rem;
    box-sizing: border-box;
    margin-bottom: 0.15rem;
  }
  .addMost {
    font-size: 0.21rem;
    color: #ccc;
    padding: 0.25rem 0;
  }
}

.form-btn-wrap {
  width: 7.1rem;
  padding: 0.2rem;
  background: #fff;
  button {
    width: 7.1rem;
    height: 0.9rem;
    background: #d19e29;
    border: none;
    color: #fff;
    font-size: 0.32rem;
    outline: none;
  }
  button:active {
    box-shadow: 0 5px 5px #f9781e;
  }
}
</style>