<template>
    <div class="KOinfo">
        <div v-title data-title="图文详情">图文详情</div>
        <div v-if="news_type==1">
            <div class="info">
                <div class="header">{{title}}</div>
                <div class="info-detail" v-html="info">{{info}}</div>
            </div>
            <div class="info-footer">
            <span @click="btnGo" class="btnGo">
                <img src="../../assets/images/return_icon_top.png" alt="返回">
                返回
            </span>
                <span class="collect" :class="{active:is_collect}" @click="collect"></span>
            </div>
        </div>
        <div class="my-video" v-if="news_type==2">
            <div class="info-header">
            <span @click="btnGo" class="btnGo">
                <img src="../../assets/btn-return.png" alt="返回">
                返回
            </span>
                <span class="collect" :class="{active:is_collect}" @click="collect"></span>
            </div>
            <video-player class="video-player vjs-custom-skin"
                          ref="videoPlayer"
                          :options="{
                                        autoplay: false, //如果true,浏览器准备好时开始回放。
                                        muted: false, // 默认情况下将会消除任何音频。
                                        loop: false, // 导致视频一结束就重新开始。
                                        //preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                                        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                        sources: [{
                                            type: 'video/mp4',
                                            //type: 'video/x-flv',
                                            src: IMG_URL+video_url
                                            //src: 'http://m.fzxbwl.com/a.mp4'
                                        }],
                                        //techOrder: ['flash'],
                                        language: 'zh-CN',
                                        poster: IMG_URL+pic_url,
                                        notSupportedMessage: '此视频暂无法播放，请稍后再试',
                                    }"
                          customEventName="changed"
                          @play="onPlayerPlay($event)"
                          @pause="onPlayerPause($event)"
            >
            </video-player>
        </div>
    </div>
</template>
<script>
    import {videoPlayer} from 'vue-video-player'
    require('video.js/dist/video-js.css')
    require('vue-video-player/src/custom-theme.css')
    require('./children/video.css')
    import 'videojs-flash'
    import {Picker, MessageBox, Toast, InfiniteScroll} from 'mint-ui';
    import qs from 'qs';
    export default {
        name: 'newListScroll',
        data(){
            return {
                title: '图文详情',
                info: '',
                is_collect: false,
                news_type: '1',
                video_url: '',
                pic_url: '',
            }
        },
        components: {
            videoPlayer,
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        created(){
            document.body.scrollTop = 0;
            this.getInfo()
        },
        methods: {
            getInfo(){
                this.axios({
                    url: `${this.$httpConfig.articleInfo}/id/${this.$route.params.id}`,
                    method: 'get',
                    params: {
                        app_user_id: sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    this.news_type = res.data.data.news_type;
                    this.video_url = res.data.data.video;
                    this.pic_url = res.data.data.pic_url;
                    this.title = res.data.data.name;
                    this.info = res.data.data.content;
                    this.is_collect = res.data.data.is_collect;
                }).catch((err) => {
                    Toast('获取图文详情异常')
                    console.log(err);
                });
            },
            btnGo() {
                this.$router.go(-1);
            },
            collect() {
                this.axios({
                    url: `${this.$httpConfig.collectArticle}/${this.$route.params.id}`,
                    method: 'get',
                    params: {
                        app_user_id: sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    if (res.data.status == 10001) {
                        this.$router.push('/LogIn');
                    } else if (res.data.status == 1) {
                        this.is_collect = !this.is_collect;
                        Toast(res.data.data.msg || '操作成功')
                    } else {
                        Toast('点击收藏异常')
                    }
                }).catch((err) => {
                    Toast('点击收藏异常')
                    console.log(err);
                });
            },
            onPlayerPlay(player) {
                var otherPlays = this.$refs.videoPlayer;
                if (otherPlays.length > 0) {
                    otherPlays.map((play) => {
                        if (play.player != player) {
                            play.player.pause()
                        }
                    })
                }
            },
            onPlayerPause(player){
                player.pause()
                console.log("pause");
            },
        }
    }
</script>
<style>
    .video-js .vjs-big-play-button {
        font-size: 2.5em;
        line-height: 2.3em;
        height: 2.5em;
        width: 2.5em;
        -webkit-border-radius: 2.5em;
        -moz-border-radius: 2.5em;
        border-radius: 2.5em;
        background-color: #73859f;
        background-color: rgba(115, 133, 159, .5);
        border-width: 0.15em;
        margin-top: -1.25em;
        margin-left: -1.75em;
    }

    /* 中间的播放箭头 */
    .vjs-big-play-button .vjs-icon-placeholder {
        font-size: 1.63em;
    }

    /* 加载圆圈 */
    .vjs-loading-spinner {
        font-size: 2.5em;
        width: 2em;
        height: 2em;
        border-radius: 1em;
        margin-top: -1em;
        margin-left: -1.5em;
    }
</style>
<style lang="less">
    .info-detail {
        * {
            font-size: 17px;
            word-wrap: break-word;
            text-align: justify;
            color: #505050;
            line-height: 1.647;
            padding: 0;
            margin-bottom: 8px;
            font-family: helvetica !important;
        }
        img {
            width: 300px !important;
        }
        .video-js {
            width: 320px;
            height: auto;
        }
    }

</style>
<style lang="less" scoped>
    .KOinfo {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        .info {
            height: 100%;
            box-sizing: border-box;
            padding: 0rem .4rem 50px .4rem;
            overflow-y: auto;
            .header {
                font-size: 20px;
                margin: .2rem 0;
            }
        }
        .info-footer {
            position: absolute;
            left: 0px;
            bottom: 0px;
            height: 50px;
            width: 100%;
            background: #fff;
            .btnGo {
                height: 50px;
                line-height: 50px;
                img {
                    width: 26px;
                    height: 26px;
                    margin: 12px 0 12px 16px;
                }
            }
            .collect {
                position: absolute;
                top: .24rem;
                right: .3rem;
                width: .52rem;
                height: .48rem;
                background: url(../../assets/images/xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
            .collect.active {
                background: url(../../assets/images/xu_xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
        }
        .my-video{
            height: 100%;
            width: 100%;
            background: #000000;
            .video-player.vjs-custom-skin{
                position: relative;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
            }
            .info-header {
                z-index: 100;
                position: absolute;
                left: 0px;
                bottom: 0px;
                height: 50px;
                width: 100%;
                background: #000;
                color: #fff;
                .btnGo {
                    height: 50px;
                    line-height: 50px;
                    img {
                        width: 26px;
                        height: 26px;
                        margin: 12px 0 12px 16px;
                    }
                }
                .collect {
                    position: absolute;
                    top: .24rem;
                    right: .3rem;
                    width: .52rem;
                    height: .48rem;
                    background: url(../../assets/images/xinxin.png) no-repeat;
                    background-size: 100% 100%;
                }
                .collect.active {
                    background: url(../../assets/images/xu_xinxin.png) no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }
</style>