(function(){
  'use strict';
  const PRODUCT_KEY='braven_new_products';
  const defaults=[
    {id:'p1',name:'Shadow Oversized Tee',cat:'oversized',price:650,old:800,stock:12,rating:5},
    {id:'p2',name:'Minimal Tee',cat:'men',price:540,old:650,stock:18,rating:4.8},
    {id:'p3',name:'Essential Hoodie',cat:'hoodies',price:990,old:1150,stock:8,rating:5},
    {id:'p4',name:'Better Days Tee',cat:'men',price:590,old:700,stock:15,rating:4.9},
    {id:'p5',name:'Good Things Tee',cat:'women',price:620,old:750,stock:10,rating:4.7},
    {id:'p6',name:'Braven Kids Tee',cat:'kids',price:450,old:550,stock:20,rating:4.8}
  ];
  try{
    const raw=localStorage.getItem(PRODUCT_KEY);
    let products=raw?JSON.parse(raw):null;
    if(!Array.isArray(products)||products.length===0){
      localStorage.setItem(PRODUCT_KEY,JSON.stringify(defaults));
    }
  }catch(e){
    localStorage.setItem(PRODUCT_KEY,JSON.stringify(defaults));
  }
  window.bravenSafeAdminLogin=function(){
    const email=document.getElementById('adminEmail');
    const pass=document.getElementById('adminPass');
    const e=String(email&&email.value||'').trim().toLowerCase();
    const p=String(pass&&pass.value||'').trim();
    if(e!=='admin@braven.com'||p!=='123456'){
      if(typeof toast==='function')toast('بيانات الدخول غير صحيحة');
      return false;
    }
    sessionStorage.setItem('braven_admin','1');
    const login=document.getElementById('adminLogin');
    const dashboard=document.getElementById('dashboard');
    if(login)login.classList.add('hidden');
    if(dashboard)dashboard.classList.remove('hidden');
    try{ if(typeof renderAdmin==='function')renderAdmin(); }
    catch(err){ console.error('BRAVEN admin render:',err); }
    return true;
  };
})();
