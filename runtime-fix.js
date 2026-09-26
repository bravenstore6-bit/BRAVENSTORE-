(function(){
  'use strict';
  const KEY='braven_new_products';
  const defaults=[
    {id:'p1',name:'Shadow Oversized Tee',cat:'oversized',price:650,old:800,stock:12,rating:5},
    {id:'p2',name:'Minimal Tee',cat:'men',price:540,old:650,stock:18,rating:4.8},
    {id:'p3',name:'Essential Hoodie',cat:'hoodies',price:990,old:1150,stock:8,rating:5},
    {id:'p4',name:'Better Days Tee',cat:'men',price:590,old:700,stock:15,rating:4.9},
    {id:'p5',name:'Good Things Tee',cat:'women',price:620,old:750,stock:10,rating:4.7},
    {id:'p6',name:'Braven Kids Tee',cat:'kids',price:450,old:550,stock:20,rating:4.8}
  ];
  function parse(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch(e){return fallback}}
  function valid(p){return p&&typeof p==='object'&&String(p.id||'')&&String(p.name||'').trim()&&Number.isFinite(Number(p.price))}
  function readProducts(){
    const data=parse(KEY,null);
    if(!Array.isArray(data)||!data.length){localStorage.setItem(KEY,JSON.stringify(defaults));return defaults.slice()}
    const good=data.filter(valid);
    if(!good.length){localStorage.setItem(KEY,JSON.stringify(defaults));return defaults.slice()}
    return good;
  }
  function writeProducts(data){localStorage.setItem(KEY,JSON.stringify(data));return data}
  window.getProducts=readProducts;
  window.setProducts=writeProducts;
  window.getCart=function(){const x=parse('braven_new_cart',[]);return Array.isArray(x)?x:[]};
  window.getOrders=function(){const x=parse('braven_new_orders',[]);return Array.isArray(x)?x:[]};
  window.getReviews=function(){const x=parse('braven_reviews',[]);return Array.isArray(x)?x:[]};
  window.getWishlist=function(){const x=parse('braven_wishlist',[]);return Array.isArray(x)?x:[]};

  window.applyTheme=function(){
    const dark=localStorage.getItem('braven_theme')==='dark';
    document.body.classList.toggle('theme-dark',dark);
    document.querySelectorAll('#themeToggle').forEach(b=>b.textContent=dark?'☀️ الوضع الفاتح':'🌙 الوضع الداكن');
  };
  window.toggleTheme=function(){
    localStorage.setItem('braven_theme',localStorage.getItem('braven_theme')==='dark'?'light':'dark');
    window.applyTheme();
  };

  window.renderHomeProducts=function(){
    const el=document.getElementById('homeProducts');
    if(!el)return;
    try{
      const products=readProducts();
      el.innerHTML=products.slice(0,4).map(p=>window.card(p)).join('');
      if(typeof window.updateCartCount==='function')window.updateCartCount();
    }catch(e){
      console.error('BRAVEN home render failed',e);
      el.innerHTML='<p class="home-error">تعذر تحميل المنتجات. تم الحفاظ على بيانات المتجر.</p>';
    }
  };

  window.saveProduct=function(e){
    e.preventDefault();
    try{
      const ps=readProducts();
      const editId=document.getElementById('editId').value.trim();
      const id=editId||'p'+Date.now();
      const old=ps.find(p=>p.id===id);
      const name=document.getElementById('pName').value.trim();
      const price=Number(document.getElementById('pPrice').value);
      const stock=Number(document.getElementById('pStock').value);
      if(!name||!Number.isFinite(price)||!Number.isFinite(stock)){toast('راجع اسم المنتج والسعر والمخزون');return}
      const files=[...(document.getElementById('pImages')?.files||[])];
      const oldImages=old?.images||((old?.image)?[old.image]:[]);
      const finish=uploaded=>{
        const images=uploaded.length?uploaded:oldImages;
        const p={
          id,name,cat:document.getElementById('pCat').value,price,
          old:Number(document.getElementById('pOld').value)||0,stock,
          rating:Number(document.getElementById('pRating').value)||5,
          description:document.getElementById('pDescription').value.trim(),
          sizes:document.getElementById('pSizes').value.split(',').map(x=>x.trim()).filter(Boolean),
          colors:document.getElementById('pColors').value.split(',').map(x=>x.trim()).filter(Boolean),
          sku:document.getElementById('pSku').value.trim(),
          featured:document.getElementById('pFeatured').checked,
          newProduct:document.getElementById('pNew').checked,
          lowStock:Number(document.getElementById('pLowStock').value)||3,
          images
        };
        p.image=images[0]||document.getElementById('pImageUrl').value.trim()||old?.image||'';
        const i=ps.findIndex(x=>x.id===id);
        if(i>=0)ps[i]=p;else ps.unshift(p);
        writeProducts(ps);
        if(typeof resetProductForm==='function')resetProductForm();
        if(typeof renderAdmin==='function')renderAdmin();
        if(typeof window.renderHomeProducts==='function')window.renderHomeProducts();
        if(typeof toast==='function')toast('تم حفظ المنتج ✓');
      };
      if(files.length){
        const out=[];let i=0;
        const next=()=>{if(i>=files.length){finish(out);return}const r=new FileReader();r.onload=()=>{out.push(r.result);i++;next()};r.onerror=()=>{i++;next()};r.readAsDataURL(files[i])};
        next();
      }else{
        const url=document.getElementById('pImageUrl').value.trim();
        finish(url?[url]:oldImages);
      }
    }catch(err){console.error('BRAVEN save product failed',err);if(typeof toast==='function')toast('حصل خطأ أثناء حفظ المنتج، والبيانات القديمة لم تُحذف')}
  };

  function bootHome(){if(document.getElementById('homeProducts'))window.renderHomeProducts();window.applyTheme()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootHome);else bootHome();
  window.addEventListener('pageshow',bootHome);
})();
