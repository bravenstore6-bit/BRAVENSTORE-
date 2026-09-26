(function(){'use strict';
const keys=['braven_new_products','braven_new_cart','braven_new_orders'];
for(const k of keys){try{const v=localStorage.getItem(k);if(v!==null)JSON.parse(v)}catch(e){localStorage.removeItem(k)}}
try{
  const raw=localStorage.getItem('braven_new_products');
  const products=raw?JSON.parse(raw):null;
  if(!Array.isArray(products)||products.length===0){
    const defaults=[
      {id:'p1',name:'Shadow Oversized Tee',cat:'oversized',price:650,old:800,stock:12,rating:5},
      {id:'p2',name:'Minimal Tee',cat:'men',price:540,old:650,stock:18,rating:4.8},
      {id:'p3',name:'Essential Hoodie',cat:'hoodies',price:990,old:1150,stock:8,rating:5},
      {id:'p4',name:'Better Days Tee',cat:'men',price:590,old:700,stock:15,rating:4.9},
      {id:'p5',name:'Good Things Tee',cat:'women',price:620,old:750,stock:10,rating:4.7},
      {id:'p6',name:'Braven Kids Tee',cat:'kids',price:450,old:550,stock:20,rating:4.8}
    ];
    localStorage.setItem('braven_new_products',JSON.stringify(defaults));
  }
}catch(e){}
try{
  const style=document.createElement('style');
  style.id='braven-theme-repair';
  style.textContent='.theme-dark{background:#111;color:#eee}.theme-dark .topbar,.theme-dark .admin-top{background:#111;color:#eee;border-color:#333}.theme-dark .section,.theme-dark .admin-card,.theme-dark .form-card,.theme-dark .admin-login-box{background:#181818;color:#eee;border-color:#333}.theme-dark .product-card,.theme-dark input,.theme-dark select,.theme-dark textarea{background:#202020;color:#eee;border-color:#444}.theme-dark a{color:inherit}.theme-dark .dark-section{background:#0b0b0b}.theme-dark .old,.theme-dark small{color:#aaa}.theme-dark .theme-toggle{background:#eee;color:#111}';
  document.head.appendChild(style);
  if(typeof applyTheme==='function')applyTheme();
}catch(e){}
})();