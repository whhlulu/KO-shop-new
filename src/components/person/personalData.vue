<template>
	<div class="personData" v-loading="loading" element-loading-text="上传中……">
		<div v-title :data-title="title">{{title}}</div>
		<personal-header :text="title"></personal-header>
		<div class="person-wrap">
			<div class="hd">
				<div class="status fl">我的头像</div>
				<img v-if="data.user_header" :src="URL+data.user_header" class="fr" v-show="!hdimg">
				<img v-else src="../../assets/my_user_pic.png" class="fr" v-show="!hdimg">
				<img :src="URL+hdimg" class="fr" v-show="hdimg" v-model="user_header">
				<div class="icon-btn"></div>
				<div v-if="show">
					<input type="file" @change="imgChange($event)" ref="int">
				</div>
			</div>
			<ul class="dd">
				<li class="clearfix">
					<span class="userStatus fl">用户名<span>*</span></span>
					<span class="userName fr">{{data.user_name}}</span>
					<div class="icon-btn"></div>
				</li>
				<li class="clearfix" @click="modify('nickname')">
					<span class="userStatus fl">昵称<span>*</span></span>
					<span class="userName fr">{{data.nick_name|| '请填写'}}</span>
					<div class="icon-btn"></div>
				</li>
				<li class="clearfix" @click="modify('email')">
					<span class="userStatus fl">邮箱</span>
					<span class="userName fr">{{data.email || '请填写'}}</span>
					<div class="icon-btn"></div>
				</li>
				<li class="clearfix" @click="modify('sex')">
					<span class="userStatus fl">性别</span>
					<span class="userName fr">{{data.sex || '请填写'}}</span>
					<div class="icon-btn"></div>
				</li>
				<li class="clearfix" @click="bir">
					<span class="userStatus fl">生日</span>
					<span class="userName fr">{{data.birthday|formatDate}}</span>
					<div class="icon-btn"></div>
				</li>
			</ul>
		</div>
		<div class="from-btn" @click="preservation">确认修改</div>
		<div class="prompt"><span>*</span>为必填项</div>
		<mt-datetime-picker ref="picker" type="date" v-model="pickerVisible" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="dataChange" :start-date="startDate" :end-date="endDate">
		</mt-datetime-picker>
		<mt-popup v-model="popupVisible" position="bottom">
			<ul class="sex-wrap">
				<li v-for="(item,index) in sex" :key="item.id" @click="setSex(index)">{{item}}</li>
				<li @click="setSex('del')">取消</li>
			</ul>
		</mt-popup>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
import personalHeader from "@/components/page/children/header.vue";
import qs from "qs";
import {
  Picker,
  Button,
  MessageBox,
  Toast,
  DatetimePicker,
  Actionsheet,
  Popup
} from "mint-ui";
export default {
  name: "personalData",
  data() {
    return {
      title: "个人资料",
      data: [],
      pickerVisible: false,
      popupVisible: false,
      user_header: "",
      startDate: new Date("January 01 1960 11:19:47 GMT+0800 (CST)"),
      endDate: new Date(),
      hdimg: "",
      sex: ["女", "男"],
      load: false,
      img_type: "",
      show: true,
      token: "",
      s_token: "",
      loading: false
    };
  },
  filters: {
    formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + MM + "-" + d;
    }
  },
  created() {
      this.axios({
        method: "get",
        url: this.$httpConfig.userinfo,
        params: {
        }
      })
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.push("/LogIn");
          } else if (res.data.status == 1) {
            console.log(res.data.data, "生日");
            this.data = res.data.data;
            console.log(this.data, "2");
            if (res.data.data.sex == 0) {
              this.data.sex = "女";
            } else if (res.data.data.sex == 1) {
              this.data.sex = "男";
            }
            if (res.data.birthday != 0) {
              this.data.birthday = Number(res.data.data.birthday);
            } else {
              this.data.birthday = res.data.data.birthday;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
  },
  methods: {
    bir() {
      this.$refs.picker.open();
    },
    del() {
      this.popupVisible = false;
    },
    enter() {
      this.data.birthday = this.birthday;
      this.popupVisible = false;
    },
    setSex(index) {
      this.popupVisible = false;
      if (index == "del") return;
      this.data.sex = this.sex[index];
    },
    modify(v) {
      switch (v) {
        case "email":
          MessageBox.prompt("请输入您要修改的电子邮箱")
            .then(({ value, action }) => {
              if (
                /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(
                  value
                )
              ) {
                this.data.email = value;
                return;
              }
              Toast("请填写正确的邮箱");
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case "sex":
          this.popupVisible = true;
          break;
        case "nickname":
          MessageBox.prompt("请输入您要修改的昵称")
            .then(({ value, action }) => {
              this.data.nick_name = value;
            })
            .catch(err => {
              console.log(err);
            });
          break;
      }
    },
    dataChange(val) {
      this.data.birthday =
        val.getFullYear() +
        "-" +
        this.todo(val.getMonth() + 1) +
        "-" +
        this.todo(val.getDate());
    },
    todo(n) {
      return n < 10 ? "0" + n : n + "";
    },
    imgChange(e) {
      this.loading = true;
      var that = this;
      let file = e.target.files[0];
      this.show = false;
      const reader = new FileReader();
      this.img_type = "data:" + file.type + ";base64,";
      reader.readAsDataURL(file);
      let param = new FormData(); // 创建form对象
      param.append("adv_content", file, file.name); // 通过append向form对象添加数据
      param.append("chunk", "0"); // 添加form表单中其他数据
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.axios
        .post(this.$httpConfig.uploadPicture, param, config)
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.push("/LogIn");
          } else {
            if (res.data.status === 1) {
              this.user_header = res.data.data;
              this.hdimg = res.data.data;
            } else {
              Toast(res.data.message);
            }
            this.show = true;
            this.loading = false;
          }
        });
    },
    preservation() {
      this.load = true;
      let sex = "";
      if (this.data.sex == "男") {
        sex = 1;
      } else {
        sex = 0;
      }
      this.axios
        .post(
          this.$httpConfig.editUserInfo,
          qs.stringify({
            nick_name: this.data.nick_name,
            email: this.data.email,
            sex: sex,
            birthday: this.data.birthday,
            user_header: this.data.img_url,
            img_new: this.user_header,
            type: this.img_type
          })
        )
        .then(res => {
          if (res.data.status == 10001) {
            this.$router.push("/LogIn");
          } else {
            Toast(res.data.message);
            if (res.data.status == 1) {
              this.$router.back(-1);
            }
            this.load = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {},
  components: {
    personalHeader
  }
};
</script>
<style lang="less" scoped>
.person-wrap {
  background: #fff;
  .hd {
    padding: 0.2rem 0.73rem 0.2rem 0.2rem;
    height: 1.14rem;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    overflow: hidden;
    input {
      width: 300%;
      height: 100%;
      position: absolute;
      left: -200%;
      top: 0;
    }
    img {
      width: 1.14rem;
      height: 1.14rem;
      border-radius: 100%;
      box-sizing: border-box;
    }
    .status {
      line-height: 1.14rem;
      font-size: 0.32rem;
    }
    .icon-btn {
      position: absolute;
      top: 50%;
      right: 0.2rem;
      margin-top: -0.12rem;
      width: 0.14rem;
      height: 0.24rem;
      background: url(../../assets/btn-right.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .dd {
    li:nth-child(1) {
      .icon-btn {
        display: none;
      }
    }
    li {
      height: 0.9rem;
      border-bottom: 1px solid #e7e7e7;
      position: relative;
      line-height: 0.9rem;
      padding: 0 0.45rem 0 0.2rem;
      .userStatus {
        font-size: 0.32rem;
        color: #3d4245;
        span {
          font-size: 0.32rem;
          color: #d0111b;
        }
      }
      .userName {
        font-size: 0.32rem;
        color: #999;
      }
      .icon-btn {
        position: absolute;
        top: 50%;
        right: 0.2rem;
        margin-top: -0.12rem;
        width: 0.14rem;
        height: 0.24rem;
        background: url(../../assets/btn-right.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

.button-wrap {
  padding: 0.2rem;
}

.from-btn {
  width: 7.1rem;
  height: 0.9rem;
  text-align: center;
  line-height: 0.9rem;
  background: #c79a01;
  border-radius: 20px;
  box-sizing: border-box;
  color: #fff;
  font-size: 0.32rem;
  margin: 0.6rem auto 0.2rem;
}

.from-btn:active {
  box-shadow: 0 5px 5px #ccc;
}

.prompt {
  text-align: center;
  font-size: 0.24rem;
  color: #3d4245;
  position: relative;
  span {
    font-size: 0.32rem;
    color: #d0111b;
    position: absolute;
    top: 50%;
    left: 3.1rem;
    margin-top: -0.15rem;
  }
}

.sex-wrap {
  width: 7.5rem;
  text-align: center;
  li {
    height: 0.8rem;
    line-height: 0.8rem;
    border-top: 1px solid #ccc;
    box-sizing: border-box;
    color: #26a2ff;
    font-size: 0.3rem;
    background: #fff;
  }
  li:nth-child(3) {
    margin-top: 0.2rem;
  }
}
</style>
<style lang="less">
.personData {
  font-size: 0.28rem;
  .mint-popup-bottom {
    font-size: 0.28rem;
    .picker-item {
      font-size: 0.28rem;
      text-align: center;
    }
  }
  .mint-popup {
    font-size: 0.28rem;
    background: none;
    // padding-bottom:.2rem;
  }
  .picker.mint-datetime-picker {
    background: #fff;
  }
}
</style>