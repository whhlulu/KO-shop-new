<template>
    <div>
        <div class="new-all" v-for="(item,index) in newList" :key="item.id">
            <div v-if="item.news_type==1">
                <div class="new">
                    <img v-if="item.pic_url" v-lazy="IMG_URL+item.pic_url" class="fl" @click="toDetails(item)">
                    <div class="fl words" :class="{allspan:!item.pic_url}">
                        <p class="text" @click="toDetails(item)">{{item.name}}</p>
                        <p class="clearfix text company">{{item.intro}}</p>
                    </div>
                </div>
                <!--<div class="opt">-->
                <!--<span class="like fl" :class="{active:item.like}" @click="seat()"></span>-->
                <!--</div>-->
            </div>
            <div v-if="item.news_type==2">
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
                                            src: IMG_URL+item.video
                                            //src: 'http://m.youyoulegou.cn/a.mp4'
                                        }],
                                        //techOrder: ['flash'],
                                        language: 'zh-CN',
                                        poster: IMG_URL+item.pic_url,
                                        notSupportedMessage: '此视频暂无法播放，请稍后再试',
                                    }"
                              customEventName="changed"
                              @play="onPlayerPlay($event)"
                              @pause="onPlayerPause($event)"
                >
                </video-player>
            </div>
        </div>
    </div>
</template>
<script>
    import {videoPlayer} from 'vue-video-player'
    require('video.js/dist/video-js.css')
    require('vue-video-player/src/custom-theme.css')
    require('./video.css')
    import 'videojs-flash'
    export default {
        name: 'newList',
        data(){
            return {
                imgs: require('@/assets/cp.png'),
            }
        },
        props: ["newList"],
        components: {
            videoPlayer,
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        methods: {
            onPlayerPlay(player) {
                var otherPlays = this.$refs.videoPlayer;
                if (otherPlays.length > 0) {
                    otherPlays.map((play) => {
                        if (play.player!=player) {
                            play.player.pause()
                        }
                    })
                }
            },
            onPlayerPause(player){
                console.log("pause");
            },
            toDetails(item){
                this.$router.push('/KOinfo/'+item.id);
            }
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
<style lang="less" scoped>
    .new-all {
        position: relative;
        background: #fff;
        padding: .13rem .2rem;
        margin-bottom: 6px;
        .my-video {
            width: 100%;
        }
        .new {
            height: 1.46rem;
            img {
                width: 1.46rem;
                height: 1.46rem;
            }
            .words.allspan {
                width: 6.8rem;
            }
            .words {
                width: 5.24rem;
                .text {
                    padding: 0 .2rem;
                    font-size: .32rem;
                    color: #333;
                    line-height: .45rem;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .company {
                    height: 26px;
                    font-size: 12px;
                    line-height: 14px;
                    color: #B6B4B5;
                    padding-top: 10px;
                    padding-left: .2rem;
                }
            }
        }
        .opt {
            height: .48rem;
            position: relative;
            .like {
                position: absolute;
                right: .2rem;
                width: .52rem;
                height: .48rem;
                background: url(../../../assets/images/xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
            .like.active {
                background: url(../../../assets/images/xu_xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
        }
    }

</style>
