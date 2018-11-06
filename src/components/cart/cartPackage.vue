<template>
	<div class="goos" v-if="$store.state.package_cart_data">
		<div>
			<dl class="mark-wrap" v-for="(items,index1) in $store.state.package_cart_data" v-bind:key="index1">
				<dt>
					<label class="checkBox" :class="{active:items.checked}" @click="addShop(index1,items)"><span></span></label>
					<a @click="enterShop(items)">{{items.store_name}}</a>
					<span class="clearfix" @click="deit(index1,$event)">
						<i class="fl">{{total.fn}}</i>
						<em class="fl"></em>
					</span>
					<span class="all" :class="{allColor:items.checked}">全选</span>
				</dt>
				<div class="package">
					<div class="package-box" v-for="(itemPackage,index2) in items.cart" :key="index2">
						<div class="title title1">
							<label class="checkBox checkBox1" :class="{active:itemPackage.checked}" @click="addCom1(index2,index1,itemPackage)" checked><span></span></label>
							<label v-show="isEdit" class="checkBox checkBox1" :class="{active:itemPackage.checked}" 
							@click="addCom1(index2,index1,itemPackage)" checked><span></span></label>
							<span class="package-name">{{itemPackage.title}}</span>

							<div class="delete fr" v-show="!total.deit" @click="remove(index2,index1,itemPackage)">
								<div class="icon"></div>
							</div>
							<div class="input-wrap fr" v-show="!total.deit">
								<button @click="reduce(index2,itemPackage)">-</button>
								<input type="number" v-model="itemPackage.package_num" v-on:input="cartNumModify(itemPackage)">
								<button @click="add(index2,itemPackage)">+</button>
							</div>
						</div>
						<dd class="clearfix clearfix1" 
            v-for="(item,index) in itemPackage.goods" 
            :key="item.id" 
             @click="enterDetail(index,item)"
            :class="{active:!total.deit}">
							<img v-lazy="URL + item.puc_url" class="fl">
							<div class="pull-right fl">
								<p class="text">{{item.title}}</p>
								<p class="price-wrap clearfix">
									<span class="fl price">￥<span>{{item.discount}}</span>
                    <b class="old-price">￥{{item.price_member}}</b>
                  </span>
									<span class="number fr">x{{itemPackage.package_num}}</span>
								</p>
							</div>
						</dd>
					</div>
				</div>
			</dl>
			<div class="footer-wrap">
				<div class="seat"></div>
				<div class="footer clearfix">
					<label class="chicked fl" :class="{active:flag}" @click="seat(flag)">
						<span></span>
						<b class="all">{{total.setData}}</b>
					</label>
					<button class="set-btn fr" v-show="total.deit" @click="toOrder">去结算({{total.seleNumber}})</button>
					<div class="total fl" v-show="total.deit">
						<div class="total-metre clearfix">
							<div>
								<span class="title fl">总计&nbsp;:&nbsp;</span>
								<span class="con fl">￥<span>{{price.toFixed(2)}}</span></span>
							</div>
						</div>
						<div class="total-price">
							<p>原价:￥{{(bottomPrice.oldPrice).toFixed(2)}}</p><p>立减:￥{{(bottomPrice.oldPrice-price).toFixed(2)}}</p>
						</div>
					</div>
					<!-- <div class="immig fr" v-show="!total.deit" @click="collection">移入收藏</div> -->
				</div>
			</div>
		</div>
		
		<Shopsn></Shopsn>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
		<div class="load-wrap" v-show="$store.state.cart_load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
import { MessageBox, Toast } from "mint-ui";
import qs from "qs";
import hotGoods from "@/components/home/children/hotGoods";
import Shopsn from "@/components/page/Shopsn.vue";
export default {
  name: "cart1",
  data() {
    return {
      load: false,
      load_wrap: true,
      total: {
        seleNumber: 0,
        newPrice: 0,
        price: 0,
        dis: 0,
        seat: "",
        deit: true,
        setData: "全选",
        fn: "编辑"
      },
      scrollWatch: true,
      data: "",
      status: [],
      computer: "",
      goos_id: [],
      goods: [],
      id: [],
      flag: false,
      price: 0,
      length: [],
      delRemove: [],
      isEdit: true,
      cartId: [],
      news: [],
      nav: [
        { name: "商品", isSelected: true },
        { name: "推荐套餐", isSelected: false }
      ],
      bottomPrice: {
        oldPrice: 0,
        newPrice: 0,
        discount: 0
      },
    };
  },
  props:{
    cart:''
  },
  mounted() {
    this.$store.state.cart_load = false;
    document.body.scrollTop = 0;
  },
  methods: {
    enterShop(items) {
      this.$router.push({
        name: "shopHome",
        params: {
          id: items.cart[0].store_id,
          index:0
        }
      });
    },
    enterList() {
      this.$router.push({
        path: "/list/1/search"
      });
    },
    enterDetail(index, item) {
      this.$router.push({
        name: "product",
        params: {
          id: item.goods_id,
          status: 1
        }
      });
    },
    addgoods(goods) {
      if (this.goods.length > 0) {
        for (var j = 0; j < this.goods.length; j++) {
          if (this.goods[j].id == goods.id) {
            return;
          } else {
            this.goods.push(goods);
            this.total.seleNumber = this.goods.length;
            return;
          }
        }
      } else {
        this.goods.push(goods);
        this.total.seleNumber = this.goods.length;
      }
    },
    deletegoods(goods) {
      if (this.goods.length == 0) {
        return;
      } else {
        for (var j = 0; j < this.goods.length; j++) {
          if (this.goods[j].id == goods.id) {
            this.goods.splice(j, 1);
            return;
          }
        }
      }
    },
    deit(index1, e) {
      //编辑购物车
      var list = this.$store.state.package_cart_data[index1].cart,
        len = list.length;
      if (this.total.deit) {
        for (var i = 0; i < len; i++) {
          this.total.deit = false;
          this.total.fn = "完成";
          this.isEdit = false;
        }
      } else {
        this.getAllprice();
        for (var i = 0; i < len; i++) {
          this.total.deit = true;
          this.total.fn = "编辑";
          this.isEdit = true;
        }
      }
    },
    addShop(index, items) {
      var list = this.$store.state.package_cart_data[index]["cart"],
        len = list.length;
      if (this.$store.state.package_cart_data[index]["checked"]) {
        for (var i = 0; i < len; i++) {
          list[i]["checked"] = false;
          this.deletegoods(list[i]);
        }
      } else {
        for (var i = 0; i < len; i++) {
          list[i]["checked"] = true;
          this.addgoods(list[i]);
        }
      }
      this.$store.state.package_cart_data[index]["checked"] = !this.$store.state.package_cart_data[index]["checked"];
      this.getAllprice();
      this.hasAllchecked();
    },
    addCom1(index, index1, item) {
      //单选
      var list = this.$store.state.package_cart_data[index1]["cart"];
      var len = list.length;
      if (list[index]["checked"]) {
        this.$store.state.package_cart_data[index1]["checked"] = false;
        console.log(this.cart)
        this.flag = false;
        list[index]["checked"] = !list[index]["checked"];
        for (var i = 0; i < this.goods.length; i++) {
          if (this.goods[i].id == item.id) {
            this.goods.splice(i, 1);
            break;
          }
        }
      } else {
        list[index]["checked"] = !list[index]["checked"];
        // 判断是否选择当前店铺的全选
        var off = true;
        for (var j = 0; j < len; j++) {
          if (
            typeof list[j]["checked"] == "undefined" ||
            list[j]["checked"] == false
          ) {
            off = false;
          }
        }
        off == true
          ? (this.$store.state.package_cart_data[index1]["checked"] = true)
          : (this.$store.state.package_cart_data[index1]["checked"] = false);
        this.goods.push(list[index]);
        this.total.seleNumber = this.goods.length;
      }
      this.getAllprice();
      this.hasAllchecked();
    },
    seat(flag) {
      //全选
      var offon = true;
      if (this.flag) {
        offon = false;
      }
      for (var i = 0, len = this.$store.state.package_cart_data.length; i < len; i++) {
        this.$store.state.package_cart_data[i]["checked"] = offon;
        var list = this.$store.state.package_cart_data[i]["cart"];
        for (var k = 0, len1 = list.length; k < len1; k++) {
          list[k]["checked"] = offon;
          if (this.flag == false) {
            this.addgoods(list[k]);
            this.total.seleNumber = this.goods.length;
          } else if (this.flag == true) {
            this.deletegoods(list[k]);
            this.total.seleNumber = this.goods.length;
          }
        }
      }
      this.flag = !this.flag;
      this.getAllprice();
    },
    getAllprice() {
      if (!this.$store.state.package_cart_data){
          this.$store.state.no_data = true;return;
      } 
      let allprice = 0,
        oldPrice = 0;
      let num = 0;
      this.$store.state.package_cart_data.forEach((value, index) => {
        value.cart.forEach((value, index) => {
          if (value.checked) {
            allprice += parseFloat(value.discount) * Number(value.package_num);
            value.goods.forEach((value, index) => {
              oldPrice += parseFloat(value.price_member);
            });
            oldPrice = parseFloat(oldPrice) * Number(value.package_num);
          }
        });
      });
      this.total.seleNumber =
        this.goods.length > 99 ? "99+" : this.goods.length;
      this.price = allprice;
      this.bottomPrice.newPrice = allprice;
      this.bottomPrice.oldPrice = oldPrice;
      this.bottomPrice.discount = parseFloat(oldPrice - allprice);
    },
    hasAllchecked() {
      var flag1 = true;
      for (var i = 0, len = this.$store.state.package_cart_data.length; i < len; i++) {
        if (
          typeof this.$store.state.package_cart_data[i]["checked"] === "undefined" ||
          this.$store.state.package_cart_data[i]["checked"] == false
        ) {
          flag1 = false;
          break;
        }
      }
      flag1 == true ? (this.flag = true) : (this.flag = false);
    },
    cartNumModify(item) {
      if (item.package_num == 0) {
        return;
      } else {
        this.axios
          .post(
            this.$httpConfig.cartPackageNumModify,
            qs.stringify({
              id: item.id,
              package_num: item.package_num
            })
          )
          .then(res => {
            if (res.data.status == 10001) {
              this.$router.push("/LogIn");
            } else {
              this.load = false;
              if (res.data.status != 1) {
                Toast(res.data.message);
                item.package_num = 1;
                return false;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    reduce(index, item) {
      //商品减少
      if (item.package_num <= 1) {
        item.package_num = 1;
        Toast("不能再减少了哟!!");
        return false;
      } else if (item.package_num > 1) {
        this.axios
          .post(
            this.$httpConfig.cartPackageNumReduce,
            qs.stringify({
              id: item.id
            })
          )
          .then(res => {
            if (res.data.status == 10001) {
              this.$router.push("/LogIn");
            } else {
              item.package_num--;
              this.load = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
        this.getAllprice();
      }
    },
    add(index, item) {
      //商品增加
      this.axios
        .post(
          this.$httpConfig.cartPackageNumPlus,
          qs.stringify({
            id: item.id
          })
        )
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.push("/LogIn");
          } else {
            if (res.data.status == 1) {
              item.package_num++;
              this.load = false;
            } else {
              Toast(res.data.message);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    remove(index, key, item) {
      //从购物车中删除商品
      MessageBox.confirm("确定删除此商品?")
        .then(action => {
          this.axios
            .post(
              this.$httpConfig.cartPackageDel,
              qs.stringify({
                id: item.id
              })
            )
            .then(res => {
              if (res.data.status == 10001) {
                this.$router.push("/LogIn");
              } else {
                if (res.data.status == 1) {
                  this.$store.state.package_cart_data[key].cart.splice(index, 1);
                }
                if (this.$store.state.package_cart_data[key].cart.length == 0) {
                  this.$store.state.package_cart_data.splice(key, 1);
                }
                if (this.$store.state.package_cart_data.length == 0) {
                  this.$store.state.package_cart_data = '';
                }
                Toast("删除成功！");
                this.getAllprice();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    keepTwoNum (value) {
      value = Number(value);
      var b = value.toFixed(3);
      return b.substring(0, b.toString().length - 1)
    },
    toOrder() {
      //去结算
      sessionStorage.removeItem('invoiceGroup');
      sessionStorage.removeItem('invoiceInit');
      sessionStorage.removeItem('invoiceSign');
      this.$store.state.invoice = false;
      this.$store.state.rise = null;
      this.$store.state.type = null;
      this.$store.state.content = null;
      this.$store.state.invoice_id = "";
      //this.loader = true;
      if (this.goods == "") {
        Toast("请选择您要购买的物品！");
        this.load = false;
        return;
      }
      for (var i = 0; i < this.goods.length; i++) {
        this.cartId.push(this.goods[i].id);
      }
      let oldPrice = this.keepTwoNum(this.bottomPrice.oldPrice);
      let reduction = this.keepTwoNum(this.bottomPrice.oldPrice - this.price);
      this.$router.push({
        name: "cartOrderPackage",
        params: {
          cart_id: this.cartId.join(","),
          oldPrice:oldPrice,
          reduction :reduction
        }
      });
    },
    collection() {
      //添加到收藏
      this.delRemove = [];
      for (var i = 0; i < this.goods.length; i++) {
        this.delRemove.push(this.goods[i].id);
      }
      if (this.goods == "") {
        Toast("请选择您要收藏的物品!");
        return;
      }
      this.axios
        .post(
          this.$httpConfig.cartAddCollection,
          qs.stringify({
            goods: this.delRemove.join(",")
          })
        )
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.push("/LogIn");
          } else {
            Toast({
              message: res.data.message
            });
            if (res.data.status == 1) {
              location.reload();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    hotGoods,
    Shopsn
    
  },
  watch: {
    cart(){
      this.flag = false;
      this.bottomPrice.oldPrice = 0;
      this.bottomPrice.discount = 0;
      this.bottomPrice.newPrice = 0;
      this.total.seleNumber = 0;
      this.price = 0;
      this.goods = [];
    }
  },

  destroyed() {
    this.scrollWatch = false;
  }
};
</script>
<style scoped>
.old-price {
  text-decoration: line-through;
  color: #999;
  margin-left: 0.1rem;
}
.package-box + .package-box {
  border-top: 1px solid #ddd;
}
.package {
  background-color: #f1f1f1;
}
.clearfix1 {
  background: #f1f1f1 !important;
}
.title1 {
  color: #444;
  font-size: 0.2rem;
  padding: 0 1rem;
  height: 0.6rem;
  line-height: 0.6rem;
  position: relative;
  margin-top: 0.1rem;
}
.checkBox1 {
  top: none !important;
  height: 0.4rem !important;
  width: 0.4rem !important;
  top: 0.1rem !important;
}
.title1 .package-name {
  width: 2.5rem;
  display: flex;
}
.package .delete {
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  right: 0.1rem;
  top: 0;
  color: #fff;
  text-align: center;
}
.package .delete .icon {
  width: 0.5rem;
  height: 0.5rem;
  background: url(../../assets/images/delete_color.png) no-repeat;
  background-size: 100% 100%;
}
.package .input-wrap {
  height: 0.5rem;
  position: absolute;
  right: 0.6rem;
  top: 0;
}
.package .input-wrap input[type="number"] {
  border: none;
  width: 1.8rem;
  text-align: center;
  font-size: 0.36rem;
  color: #333;
  background: #fafafa;
  outline: none;
  height: 0.5rem;
}
.package .input-wrap button {
  border: none;
  background: none;
  color: #999;
  outline: none;
  width: 0.8rem;
  text-align: center;
  font-size: 0.5rem;
  height: 0.4rem;
  line-height: 0.5rem;
}
</style>

<style lang="less" scoped>
.goos {
  background: #f1f1f1;
  margin-bottom: 1rem;
  .nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 0.9rem;
    li {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    li.active {
      color: #d19e29;
      border-bottom: 0.03rem solid #d19e29;
    }
  }
  .footer-wrap {
    position: absolute;
    z-index: 9999;
    .seat {
      height: 1rem;
    }
    .footer {
      position: fixed;
      left: 0;
      bottom: 1rem;
      width: 7.4rem;
      padding-left: 0.1rem;
      height: 1rem;
      background: #fff;
      .chicked.active {
        color: #d19e29;
        span {
          border: none;
          width: .44rem;
				  height: .44rem;
          background: url(../../assets/check_bj.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .immig {
        width: 2.72rem;
        height: 1rem;
        line-height: 1rem;
        background: #d19e29;
        color: #fff;
        text-align: center;
        font-size: 0.36rem;
      }
      .set-btn {
        width: 2rem;
        color: #fff;
        height: 100%;
        border: none;
        text-align: center;
        line-height: 1rem;
        background: #d19e29;
        font-size: 0.36rem;
      }
      .total {
        padding: 0 0.1rem;
        float: right;
        width: 4.5rem;
        .total-metre {
          padding-top: 0.1rem;
          .title {
            font-size: 0.3rem;
            color: #757575;
            padding: 0 !important;
          }
          .con {
            font-size: 0.3rem;
            color: #ff7200;
            span {
              font-size: 0.36rem;
              font-weight: bold;
            }
          }
        }
        .total-metre > div {
          float: right;
        }
        .total-price {
          font-size: 0.18rem;
          color: #999;
          display: -webkit-box;
          overflow: hidden;
          white-space: normal !important;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          height: 0.3rem;
          line-height: 0.3rem;
          p {
            float: right;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            padding: 0 0.05rem;
            height: 0.3rem;
            line-height: 0.3rem;
          }
        }
      }
      .chicked {
        margin: 0.1rem 0;
        display: flex;
        flex-direction: column;
        width: 0.6rem;
        height: 0.8rem;
        font-size: 0.28rem;
        color: #999;
        align-items: center;
        span {
          width: 0.4rem;
          height: 0.4rem;
          border: 1px solid #8d8d8d;
          border-radius: 100%;
          text-align: center;
          line-height: 0.4rem;
          color: #f9781e;
        }
        .all {
          width: 0.6rem;
          height: 0.4rem;
          text-align: center;
        }
      }
    }
  }
  .interested {
    .title {
      text-align: center;
      position: relative;
      font-size: 0.28rem;
      line-height: 0.8rem;
      height: 0.8rem;
      color: #666;
      span {
        position: absolute;
        top: 50%;
        width: 2.3rem;
        height: 1px;
        background: #cdcdcd;
      }
      span:nth-child(1) {
        left: 0;
      }
      span:nth-child(2) {
        right: 0;
      }
    }
    .content-main {
      background: #f1f1f1;
      li {
        width: 3.7rem;
        height: 4.96rem;
        background: #fff;
        margin-bottom: 0.1rem;
        margin-right: 0.08rem;
        img {
          width: 3.7rem;
          height: 3.7rem;
        }
        .desi {
          font-size: 0.3rem;
          color: #333;
          padding: 0.2rem 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .price {
          padding-left: 0.2rem;
          color: #e02828;
          font-size: 0.3rem;
          span {
            font-size: 0.36rem;
          }
        }
      }
      li:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
  .cart-active {
    padding-top: 1rem;
    img {
      width: 3.07rem;
      width: 2.74rem;
    }
    .text {
      font-size: 0.32rem;
      color: #666;
      padding-top: 0.4rem;
      a {
        font-size: 0.32rem;
        color: #c32e27;
        border-bottom: 1px solid #c32e27;
        padding-bottom: 0.02rem;
      }
    }
  }
}

.cart-header {
  width: 100%;
  height: 0.62rem;
  background: #d19e29;
  padding: 0.16rem 0;
  overflow: hidden;
  text-align: center;
  position: relative;
  color: #fff;
  font-size: 0.36rem;
  line-height: 0.62rem;
  span {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    margin: -0.23rem;
    width: 0.47rem;
    height: 0.46rem;
    background: url(../../assets/news1.png) no-repeat;
    background-size: 100% 100%;
  }
}

.mark-wrap {
  margin-bottom: 0.2rem;
  dt {
    box-sizing: border-box;
    width: 100%;
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    font-size: 0.32rem;
    color: #d19e29;
    background: #fff;
    border-bottom: 1px solid #dfdfdd;
    position: relative;
    .all {
      position: absolute;
      top: 50%;
      right: 82.5%;
      display: inline-block;
      font-size: 0.32rem;
      z-index: 0;
    }
    a {
      font-size: 0.32rem;
      color: #d19e29;
    }
    .allColor {
      color: #d19e29;
    }
    span {
      position: absolute;
      right: 0.2rem;
      top: 50%;
      height: 0.31rem;
      margin-top: -0.155rem;
      color: #999;
      line-height: 0.31rem;
      z-index: 2;
      i {
        font-style: normal;
        font-size: 0.24rem;
        padding-right: 0.2rem;
      }
      em {
        width: 0.32rem;
        height: 0.31rem;
        background: url(../../assets/edit.jpg) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  dd.active {
    background: #fafafa;
  }
  dd + dd {
    border-top: 1px solid #dfdfdd;
  }
  dd {
    background: #fff;
    padding: 0.25rem 0;
    margin-left: 0.7rem;
    height: 1.55rem;
    position: relative;
    img {
      width: 1.55rem;
      height: 1.55rem;
    }

    .pull-right {
      padding-left: 0.2rem;
      .text {
        width: 4.6rem;
        height: 0.65rem;
        font-size: 0.24rem;
        color: #454545;
        line-height: 0.32rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .price-wrap {
        padding-top: 0.4rem;
        .price {
          font-size: 0.26rem;
          color: #e02828;
          span {
            font-size: 0.38rem;
          }
        }
        .number {
          font-size: 0.32rem;
          color: #333;
        }
      }
    }
  }
  .checkBox.active {
    /*background:#D19E29;*/
    span {
      border: none;
      width: .44rem;
			height: .44rem;
      background: url(../../assets/check_bj.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .checkBox {
    position: absolute;
    left: 0.1rem;
    top: 0;
    width: 0.7rem;
    height: 100%;
    z-index: 1;
    span {
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -0.2rem;
      width: 0.4rem;
      height: 0.4rem;
      border: 1px solid #8d8d8d;
      border-radius: 50%;
      text-align: center;
      line-height: 0.4rem;
      font-size: 0.3rem;
      color: #f9781e;
    }
  }
}

.mint-popup {
  width: 5rem;
  height: 3rem;
  border-radius: 3px;
  p {
    font-size: 0.3rem;
    text-align: center;
    color: #333;
    line-height: 1.8rem;
    padding-bottom: 0.2rem;
  }
  span {
    font-size: 0.28rem;
    padding-left: 20%;
    color: #333;
    float: left;
  }
  span:nth-of-type(2) {
    float: right;
    padding-right: 20%;
    color: #1caceb;
    padding-left: 0.4rem;
  }
}
</style>