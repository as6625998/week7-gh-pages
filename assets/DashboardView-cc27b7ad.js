import{_ as l,r,o as u,c as h,d as t,e as n,w as i,g as d,i as v}from"./index-217795b9.js";const k={data(){return{}},methods:{logout(){document.cookie="hexToken=; expires=; path=/",this.$router.push("/")}}},f={class:"navbar navbar-expand-lg navbar-dark bg-dark"},g={class:"container-fluid"},$={class:"navbar-nav d-flex"};function x(a,e,p,_,m,o){const s=r("router-link");return u(),h("nav",f,[t("div",g,[t("div",$,[n(s,{to:"/admin/orders",class:"nav-link text-light ps-4"},{default:i(()=>[d("訂單列表")]),_:1}),n(s,{to:"/admin/products",class:"nav-link text-light ps-4"},{default:i(()=>[d("商品列表")]),_:1})]),t("div",null,[t("button",{type:"button",href:"#",onClick:e[0]||(e[0]=v((...c)=>o.logout&&o.logout(...c),["prevent"])),class:"btn btn-danger ms-auto"},"登出")])])])}const b=l(k,[["render",x]]),{VITE_URL:V}={VITE_URL:"https://vue3-course-api.hexschool.io",VITE_PATH:"koung-hexschool",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},E={components:{AdminNavbar:b},methods:{checkLogin(){const a=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1");this.$http.defaults.headers.common.Authorization=a,this.$http.post(`${V}/v2/api/user/check`).then(e=>{console.log(e),e.data.success||this.$router.push("/login")}).catch(e=>{alert(e.response.data.message),this.$router.push("/login")})}},mounted(){this.checkLogin()}},T={class:"container py-5"};function w(a,e,p,_,m,o){const s=r("AdminNavbar"),c=r("router-view");return u(),h("div",null,[n(s),t("div",T,[n(c,{"check-admin":o.checkLogin},null,8,["check-admin"])])])}const L=l(E,[["render",w]]);export{L as default};
