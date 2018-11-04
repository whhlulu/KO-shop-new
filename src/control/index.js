import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = { //创建数据仓库
    //资讯相关-start
    //首页
    KOhome_data: '', //轮播数据来源-移动端网页banner
    categoryLists:[],
    homeNewList: [],
    AllNewList: [],
    //列表页相关数据
    //END


    /*
        数据
    */
    search_value: '', //搜索内容
    amount: '', //充值金额
    guigeName: [], //所有规格名字
    guigeidname: [], //选中规格名字
    guigeid: [], // 选中套餐
    matchGood: '', // 套餐
    goods: '', //结算商品信息
    price: '', //结算价格
    order_number: '', //订单号
    footprint: '', //我的足迹
    order: '', //我的订单
    home_data: '', //主页
    braDetails: '', //品拍馆详细
    news_data: '', //我的消息
    news_con: '', //我的消息-内容
    my_wallet: '', //我的钱包
    user_Imag: '', //用户头像
    goods_id: '', //选取规格后的商品id
    commodity_val: 1, //商品购买选择个数 默认为1
    commodity_number: '', //商品购买选择个数
    commodity_data: '', //商品详情
    catr_number: 0, //购物车数量
    transformation_num: null, //转换后的购物车数量
    package_cart_data: '', //套餐购物车数据
    cart_data: [], //购物车
    cart_computer: '', //感兴趣的物品
    dataLeave: '', //猜你喜欢
    select_coupon: [],
    invoice_id: '', //发票id
    invoice_package_arr: [], //套餐购买发票id
    isInvoicePackage: false, //是否套餐购买发票
    invoicePackageIndex: '', //套餐购买发票第几位
    agreenmentName:'',//协议名

    /*
        状态
    */
    no_data: false, //购物车没数据时
    const_join: false, //商品详情按钮状态
    const_coupon: false, //优惠券详情按钮状态
    const_coupon_num: 0, //优惠券-店铺ID
    const_coupon_money: [], //优惠券-每个优惠券
    const_coupon_price: 0.00, //优惠总金额
    const_coupon_price_package: [], //优惠总金额-套餐
    const_coupon_price_package_index: 0, //优惠总金额-套餐--位置
    load_wrap: true, //home页面加载动画开关
    cart_load: true, //购物车load
    class_load: true, //分类load
    order_load_wrap: true, //订单load动画
    invoice: false, //发票信息 默认为不开发票
    type: null, //发票类型状态
    type_id: '', //选中发票类型id
    rise: null, //发票抬头状态
    rise_id: '', //选中发票抬头id
    content: null, //发票内容状态
    content_id: '', //选中发票内容id
    type_data: ['普通发票', '增值发票'], //发票类型
    res_data: ['个人', '单位'], //发票抬头
    content_data: ['办公用品', '耗材', '电脑配件', '明细'], //发票内容
    invoice_switch: [{ invoice_title: '普通发票', invoice_type: '个人', content: '办公用品' }], //发票信息 设置默认为个人


    /*
        订单
    */
    order_title: '', //订单头部
    order_load: false, //订单ajax切换状态
    order_status: '', //订单状态 空为全部订单，-1：已取消；0 待付款，1，待处理，3待收货，4已完成
    status: '', //头部展示状态
    order_ommodity: '', //评论商品-商品信息储存
    order_details: '', //订单详情
    logis_data: '', //物流信息
    repair: '', //退货返修

    /*
        退款
    */
    setvuce_data: '', //申请退货数据

    /*
        我的评论
    */
    my_comment: '', //我的评论
    chart_review: '', //有图评论

    /*
        店铺
    */

    shop_class_show: false, //店铺分类是否显示

}
const mutations = {
    logis(state, inf) { //变更物流信息
        state.logis_data = inf;
    },
    setvuce(state, inf) { //变更退货数据
        state.setvuce_data = inf;
    },
    my_comment(state, inf) { //我的评论
        state.my_comment = inf;
    },
    chart_review(state, inf) { //有图评论
        state.chart_review = inf;
    },
    initial_rise(state, inf) {
        state.rise = null;
    },
    initial_content(state, inf) {
        state.content = null;
    },
    initial_type(state, inf) {
        state.type = null;
    },
    initial_invoice(state, inf) {
        state.invoice = false;
    },
}
const store = new Vuex.Store({
    state,
    mutations
});
export default store;