// https://github.com/liaoruoxue/pm2rd/issues/73
const API = new function(){
  const fetchURL = "https://c.diaox2.com/view/app"
  // 下列接口都是GET请求
  return {
    // 礼物搜索接口
    giftq: {
      url: `${fetchURL}/giftq`
    }
    // 获取首页默认（攻略）数据接口 目前无需提供数据
    ,giftDefault: {
      url: `${fetchURL}/gift_default`
    }
    // 逛一逛接口 目前无需提供数据
    ,giftBrowser: {
      url: `${fetchURL}/gift_browser`
    }
    ,gotogo: {
      url: `...`
    }
    // 获取文章信息接口
    ,getArticle: {
      // https://c.diaox2.com/view/app/?m=wechat&id=2345
      // https://c.diaox2.com/view/app/wechat/1234.html
      url: `${fetchURL}/wechat`
    }
    // SKU接口
    ,getFullSku: {
      // https://c.diaox2.com/view/app/?m=wsku&id=1234
      // https://c.diaox2.com/view/app/wsku/1234.html
      url: `${fetchURL}/wsku`
    }
  }
}
export default API
export const HEADER = {'Content-Type': 'application/json'}
