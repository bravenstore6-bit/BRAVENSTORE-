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
  function read(){
    try{
      const raw=localStorage.getItem(PRODUCT_KEY),data=raw?JSON.parse(raw):null;
      if(Array.isArray(data)&&data.length)return data;
    }catch(e){}
    const fresh=defaults.map(p=>({...p}));
    localStorage.setItem(PRODUCT_KEY,JSON.stringify(fresh));
    return fresh;
  }
  function write(data){
    localStorage.setItem(PRODUCT_KEY,JSON.stringify(Array.isArray(data)&&data.length?data:defaults));
  }
  window.bravenSafeAdminLogin=function(){
    const email=document.getElementById('adminEmail'),pass=document.getElementById('adminPass');
    const e=String(email&&email.value||'').trim().toLowerCase(),p=String(pass&&pass.value||'').trim();
    if(e!=='admin@braven.com'||p!=='123456'){if(typeof toast==='function')toast('بيانات الدخول غير صحيحة');return false;}
    sessionStorage.setItem('braven_admin','1');
    document.getElementById('adminLogin')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');
    if(typeof renderAdmin==='function')renderAdmin();
    return true;
  };
  window.saveProduct=function(e){
    e.preventDefault();
    try{
      const name=(document.getElementById('pName')?.value||'').trim(),price=Number(document.getElementById('pPrice')?.value),stock=Number(document.getElementById('pStock')?.value);
      if(!name||!Number.isFinite(price)||!Number.isFinite(stock)){toast('راجع اسم المنتج والسعر والمخزون');return false;}
      const products=read(),editId=(document.getElementById('editId')?.value||'').trim(),id=editId||'p'+Date.now(),old=products.find(p=>p.id===id)||{};
      const finish=images=>{
        const p={id,name,cat:document.getElementById('pCat')?.value||'men',price,old:Number(document.getElementById('pOld')?.value)||0,stock,rating:Number(document.getElementById('pRating')?.value)||5,description:(document.getElementById('pDescription')?.value||'').trim(),sizes:(document.getElementById('pSizes')?.value||'').split(',').map(x=>x.trim()).filter(Boolean),colors:(document.getElementById('pColors')?.value||'').split(',').map(x=>x.trim()).filter(Boolean),sku:(document.getElementById('pSku')?.value||'').trim(),featured:!!document.getElementById('pFeatured')?.checked,newProduct:!!document.getElementById('pNew')?.checked,lowStock:Number(document.getElementById('pLowStock')?.value)||3,images};
        p.image=images[0]||(document.getElementById('pImageUrl')?.value||'').trim()||old.image||'';
        const i=products.findIndex(x=>x.id===id);if(i>=0)products[i]=p;else products.unshift(p);write(products);
        if(typeof resetProductForm==='function')resetProductForm();
        if(typeof renderAdmin==='function')renderAdmin();
        if(typeof window.renderHomeProducts==='function')window.renderHomeProducts();
        toast('تم حفظ المنتج ✓');
      };
      const files=[...(document.getElementById('pImages')?.files||[])];
      if(!files.length){finish((document.getElementById('pImageUrl')?.value||'').trim()?[document.getElementById('pImageUrl').value.trim()]:((old.images&&old.images.length)?old.images:(old.image?[old.image]:[])));return false;}
      const out=[];let i=0,next=()=>{if(i>=files.length){finish(out);return;}const r=new FileReader();r.onload=()=>{out.push(r.result);i++;next()};r.onerror=()=>{i++;next()};r.readAsDataURL(files[i])};next();
    }catch(err){console.error(err);toast('حصل خطأ أثناء حفظ المنتج');}
    return false;
  };
})();
