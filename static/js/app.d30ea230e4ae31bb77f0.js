webpackJsonp([0],[,,,function(t,e,a){"use strict";var n=a(4);e.a={mixins:[n.a],name:"app"}},function(t,e,a){"use strict";e.a={methods:{debug:function(t){console.log("debug",t)},go:function(t){"Post"===t.name&&this.$bar.start(),this.$router.push(t)},goBack:function(){this.$router.go(-1)}}}},function(t,e,a){"use strict";var n=a(4),s=a(19),i=a.n(s),r=a(20),o=a.n(r),c=new o.a;e.a={name:"List",mixins:[n.a],data:function(){return{tickers:null,global:null,selectedUnit:this.$root.$data.shared.isZh?"cny":"usd",selectedChange:"24h",lastUpdated:new Date,showError:!1,loading:!0}},methods:{setData:function(t){this.tickers=t.tickers,this.global=t.global},setUnit:function(){localStorage.setItem("unit",this.selectedUnit)},setChange:function(){localStorage.setItem("change",this.selectedChange)}},computed:{locale:function(){return this.$root.$data.shared.isZh?"zh_CN":"en_US"},totalMarketCap:function(){var t={cny:"¥"+i()(this.global.total_market_cap_cny/Math.pow(10,8)).format("0,000.00")+"亿",usd:"$"+i()(this.global.total_market_cap_usd/Math.pow(10,9)).format("0,000.00")+"B"};return/cny|usd/.test(this.selectedUnit)?t[this.selectedUnit]:t[this.$root.$data.shared.isZh?"cny":"usd"]}},filters:{format:function(t,e){return"btc"===e?i()(t*Math.pow(10,6)).format("0,000,000.00"):i()(t).format("0,0.00")},timeFormat:function(t,e){return c.format(t,e)}},created:function(){var t=this,e=localStorage.getItem("unit"),a=localStorage.getItem("change");e&&(this.selectedUnit=e),a&&(this.selectedChange=a);var n="wss://"+window.location.host+":8443";"localhost"===window.location.hostname&&(n="ws://localhost:8083");var s=new WebSocket(n);this.$bar.start(),s.onopen=function(e){t.$bar.finish(),console.log("websocket on open")},s.onmessage=function(e){console.log("ws msg",JSON.parse(e.data)),t.loading=!1,t.setData(JSON.parse(e.data)),t.lastUpdated=new Date}},mounted:function(){}}},function(t,e,a){"use strict";e.a={data:function(){return{percent:0,show:!1,canSuccess:!0,duration:3e3,height:"2px",color:"#19c142",failedColor:"#ff0000"}},methods:{start:function(){var t=this;return this.show=!0,this.canSuccess=!0,this._timer&&(clearInterval(this._timer),this.percent=0),this._cut=1e4/Math.floor(this.duration),this._timer=setInterval(function(){t.increase(t._cut*Math.random()),t.percent>95&&t.finish()},100),this},set:function(t){return this.show=!0,this.canSuccess=!0,this.percent=Math.floor(t),this},get:function(){return Math.floor(this.percent)},increase:function(t){return this.percent=this.percent+Math.floor(t),this},decrease:function(t){return this.percent=this.percent-Math.floor(t),this},finish:function(){return this.percent=100,this.hide(),this},pause:function(){return clearInterval(this._timer),this},hide:function(){var t=this;return clearInterval(this._timer),this._timer=null,setTimeout(function(){t.show=!1,t.$nextTick(function(){setTimeout(function(){t.percent=0},200)})},500),this},fail:function(){return this.canSuccess=!1,this}}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(1),s=a(11),i=a(15),r=a(25);n.a.config.productionTip=!1,n.a.use(r.a);var o={isZh:/zh/.test(window.navigator.language)},c={zh:{list:{updateTime:"更新时间",rank:"排名",symbol:"名称",price:"最新价",change:"涨跌",error:"请求超时，请稍后刷新重试",totalMarketCap:"总市值",btcDominance:"BTC占比"}},en:{list:{updateTime:"last update",rank:"Rank",symbol:"Symbol",price:"Price",change:"Change",error:"Timeout, please retry",totalMarketCap:"Market Cap",btcDominance:"BTC Dominance"}}},l=new r.a({locale:o.isZh?"zh":"en",messages:c});new n.a({el:"#app",data:{shared:o},router:i.a,i18n:l,template:"<App/>",components:{App:s.a}})},,,,function(t,e,a){"use strict";function n(t){a(12)}var s=a(3),i=a(14),r=a(0),o=n,c=r(s.a,i.a,!1,o,null,null);e.a=c.exports},function(t,e){},,function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("header",[a("div",{staticClass:"title link",on:{click:function(e){t.go({path:"/"})}}},[t._v("\n        CoinMarket\n        "),a("span",{staticClass:"sub"},[t._v("Lite")])])]),t._v(" "),a("div",{staticClass:"container"},[a("keep-alive",[t.$route.meta.keepAlive?a("router-view"):t._e()],1),t._v(" "),t.$route.meta.keepAlive?t._e():a("transition",{attrs:{name:"fade"}},[a("router-view")],1)],1),t._v(" "),t._m(0)])},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("footer",[a("a",{attrs:{href:"https://github.com/cyio/coinmarket-pwa",target:"_blank"}},[t._v("cyio/coinmarket-pwa")])])}],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";var n=a(1),s=a(16),i=a(17),r=a(22),o=n.a.prototype.$bar=new n.a(r.a).$mount();document.body.appendChild(o.$el),n.a.use(s.a),e.a=new s.a({mode:"history",scrollBehavior:function(t,e,a){if(a)setTimeout(function(){window.scrollTo(a.x,a.y)},200);else if("Post"===t.name)return{x:0,y:0}},routes:[{path:"/",name:"Home",component:i.a,meta:{keepAlive:!0}},{path:"*",redirect:"/"}]})},,function(t,e,a){"use strict";function n(t){a(18)}var s=a(5),i=a(21),r=a(0),o=n,c=r(s.a,i.a,!1,o,null,null);e.a=c.exports},function(t,e){},,,function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home-view"},[a("div",{staticClass:"list"},[a("div",{staticClass:"info"},[t._v("\n      "+t._s(t.$t("list.totalMarketCap"))+":\n      "),t.loading?t._e():a("span",[t._v(t._s(t.totalMarketCap))]),t._v(" /\n      "+t._s(t.$t("list.btcDominance"))+":\n      "),t.loading?t._e():a("span",[t._v(t._s(t.global.bitcoin_percentage_of_market_cap)+"%")]),t._v(" /\n      "+t._s(t.$t("list.updateTime"))+"：\n      "),t.loading?t._e():a("span",[t._v(t._s(t._f("timeFormat")(t.lastUpdated,t.locale)))])]),t._v(" "),a("table",{staticClass:"table",attrs:{id:"products"}},[a("tbody",[a("tr",{staticClass:"headorder"},[a("th",{staticClass:"h-rank f-left"},[t._v(t._s(t.$t("list.rank")))]),t._v(" "),a("th",{staticClass:"h-name f-left"},[t._v(t._s(t.$t("list.symbol")))]),t._v(" "),a("th",{staticClass:"h-price f-left"},[t._v(t._s(t.$t("list.price"))+"\n            "),a("select",{directives:[{name:"model",rawName:"v-model",value:t.selectedUnit,expression:"selectedUnit"}],on:{change:[function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.selectedUnit=e.target.multiple?a:a[0]},t.setUnit]}},[a("option",{attrs:{value:"usd"}},[t._v("$")]),t._v(" "),a("option",{attrs:{value:"cny"}},[t._v("¥")]),t._v(" "),a("option",{attrs:{value:"btc"}},[t._v("Bits")])])]),t._v(" "),a("th",{staticClass:"h-change f-left"},[t._v(t._s(t.$t("list.change"))+"\n            "),a("select",{directives:[{name:"model",rawName:"v-model",value:t.selectedChange,expression:"selectedChange"}],on:{change:[function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.selectedChange=e.target.multiple?a:a[0]},t.setChange]}},[a("option",{attrs:{value:"24h"}},[t._v("24H")]),t._v(" "),a("option",{attrs:{value:"1h"}},[t._v("1H")]),t._v(" "),a("option",{attrs:{value:"7d"}},[t._v("7D")])])])]),t._v(" "),t.showError?a("div"):t._e(),t._v(" "),t._l(t.tickers,function(e){return t.loading?t._e():a("tr",{staticClass:"item"},[a("td",[a("span",[t._v(t._s(e.rank))])]),t._v(" "),a("td",[a("span",[t._v(t._s(e.symbol))])]),t._v(" "),a("td",{staticClass:"align-right"},[a("span",[t._v(t._s(t._f("format")(e["price_"+t.selectedUnit],t.selectedUnit)))])]),t._v(" "),a("td",{staticClass:"align-right"},[a("span",{staticClass:"change",class:{up:e["percent_change_"+t.selectedChange]>=0,down:e["percent_change_"+t.selectedChange]<0}},[t._v(t._s(t._f("format")(e["percent_change_"+t.selectedChange]))+"%")])])])})],2)])])])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(23)}var s=a(6),i=a(24),r=a(0),o=n,c=r(s.a,i.a,!1,o,"data-v-62a57d02",null);e.a=c.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"progress",style:{width:t.percent+"%",height:t.height,"background-color":t.canSuccess?t.color:t.failedColor,opacity:t.show?1:0}})},s=[],i={render:n,staticRenderFns:s};e.a=i}],[7]);
//# sourceMappingURL=app.d30ea230e4ae31bb77f0.js.map