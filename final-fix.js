(function(){
  'use strict';
  const KEY='braven_new_products';
  const DEFAULTS=[
    {id:'p1',name:'Shadow Oversized Tee',cat:'oversized',price:650,old:800,stock:12,rating:5},
    {id:'p2',name:'Minimal Tee',cat:'men',price:540,old:650,stock:18,rating:4.8},
    {id:'p3',name:'Essential Hoodie',cat:'hoodies',price:990,old:1150,stock:8,rating:5},
    {id:'p4',name:'Better Days Tee',cat:'men',price:590,old:700,stock:15,rating:4.9},
    {id:'p5',name:'Good Things Tee',cat:'women',price:620,old:750,stock:10,rating:4.7},
    {id:'p6',name:'Braven Kids Tee',cat:'kids',price:450,old:550,stock:20,rating:4.8}
  ];
  function valid(p){return p&&typeof p==='object'&&String(p.id||'').trim()&&String(p.name||'').trim()&&Number.isFinite(Number(p.price));}
  function read(){
    try{
      const raw=localStorage.getItem(KEY), data=raw?JSON.parse(raw):null;
      const good=Array.isArray(data)?data.filter(valid):[];
      if(good.length){
        localStorage.setItem(KEY,JSON.stringify(good));
        return good;
      }
    }catch(e){}
    const fresh=DEFAULTS.map(p=>({...p}));
    localStorage.setItem(KEY,JSON.stringify(fresh));
    return fresh;
  }
  function write(data){
    const good=Array.isArray(data)?data.filter(valid):[];
    const value=good.length?good:DEFAULTS.map(p=>({...p}));
    localStorage.setItem(KEY,JSON.stringify(value));
    return value;
  }
  function notify(text){if(typeof window.toast==='function')window.toast(text);}

  window.getProducts=read;
  window.setProducts=write;

  window.renderHomeProducts=function(){
    const el=document.getElementById('homeProducts');
    if(!el)return;
    const products=read().slice(0,4);
    el.innerHTML=products.map(p=>{
      const image=p.image?`style="background-image:url('${p.image}');background-size:cover;background-position:center"`:'';
      return `<article class="product-card" onclick="openProduct('${p.id}')"><div class="product-image" ${image}>${p.old&&p.old>p.price?'<span class="sale">خصم</span>':''}${p.image?'':'<span>BRAVEN</span>'}</div><div class="product-body"><h3>${p.name}</h3><div class="rating">★★★★★ <small>${p.rating||5}</small></div><div><b class="price">${Number(p.price).toLocaleString('en-US')} ج.م</b>${p.old?`<span class="old">${Number(p.old).toLocaleString('en-US')} ج.م</span>`:''}</div><button class="add-btn" onclick="event.stopPropagation();addToCart('${p.id}')">أضف للسلة</button></div></article>`;
    }).join('');
    if(typeof window.updateCartCount==='function')window.updateCartCount();
  };

  window.saveProduct=function(e){
    if(e)e.preventDefault();
    try{
      const name=(document.getElementById('pName')?.value||'').trim();
      const price=Number(document.getElementById('pPrice')?.value);
      const stock=Number(document.getElementById('pStock')?.value);
      if(!name||!Number.isFinite(price)||!Number.isFinite(stock)){
        notify('راجع اسم المنتج والسعر والمخزون');
        return false;
      }
      const products=read();
      const editId=(document.getElementById('editId')?.value||'').trim();
      const id=editId||'p'+Date.now();
      const old=products.find(p=>p.id===id)||{};
      const fileInput=document.getElementById('pImages');
      const files=[...(fileInput?.files||[])];
      const oldImages=Array.isArray(old.images)&&old.images.length?old.images:(old.image?[old.image]:[]);
      const finish=function(images){
        const url=(document.getElementById('pImageUrl')?.value||'').trim();
        const finalImages=images.length?images:(url?[url]:oldImages);
        const p={
          id:id,name:name,
          cat:document.getElementById('pCat')?.value||'men',
          price:price,
          old:Number(document.getElementById('pOld')?.value)||0,
          stock:stock,
          rating:Number(document.getElementById('pRating')?.value)||5,
          description:(document.getElementById('pDescription')?.value||'').trim(),
          sizes:(document.getElementById('pSizes')?.value||'').split(',').map(x=>x.trim()).filter(Boolean),
          colors:(document.getElementById('pColors')?.value||'').split(',').map(x=>x.trim()).filter(Boolean),
          sku:(document.getElementById('pSku')?.value||'').trim(),
          featured:!!document.getElementById('pFeatured')?.checked,
          newProduct:!!document.getElementById('pNew')?.checked,
          lowStock:Number(document.getElementById('pLowStock')?.value)||3,
          images:finalImages
        };
        p.image=finalImages[0]||old.image||'';
        const index=products.findIndex(x=>x.id===id);
        if(index>=0)products[index]=p;else products.unshift(p);
        write(products);
        if(typeof window.resetProductForm==='function')window.resetProductForm();
        if(typeof window.renderAdmin==='function')window.renderAdmin();
        window.renderHomeProducts();
        notify('تم حفظ المنتج ✓');
        return true;
      };
      if(files.length){
        const out=[];let i=0;
        const next=function(){
          if(i>=files.length){finish(out);return;}
          const reader=new FileReader();
          reader.onload=function(){out.push(reader.result);i++;next()};
          reader.onerror=function(){i++;next()};
          reader.readAsDataURL(files[i]);
        };
        next();
      }else finish([]);
    }catch(err){
      console.error('BRAVEN final save error',err);
      notify('حصل خطأ أثناء حفظ المنتج');
    }
    return false;
  };

  function boot(){
    if(document.getElementById('homeProducts'))window.renderHomeProducts();
    if(typeof window.applyTheme==='function')window.applyTheme();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('pageshow',boot);
})();
