
function applyTheme(){
  const theme=localStorage.getItem('braven_theme')||'light';
  document.body.classList.toggle('theme-dark',theme==='dark');
  document.querySelectorAll('#themeToggle').forEach(b=>{b.textContent=theme==='dark'?'☀️ الوضع الفاتح':'🌙 الوضع الداكن';});
}
function toggleTheme(){
  const next=(localStorage.getItem('braven_theme')||'light')==='dark'?'light':'dark';
  localStorage.setItem('braven_theme',next); applyTheme();
}
document.addEventListener('DOMContentLoaded',applyTheme);
const KEY='braven_new_products', CART='braven_new_cart', ORDERS='braven_new_orders', ACCOUNT='braven_new_account', SETTINGS='braven_settings';
// Migrate older store settings key once so existing phone/name values are preserved.
(function(){try{const oldKey='braven_new_settings';if(!localStorage.getItem(SETTINGS)){const old=localStorage.getItem(oldKey);if(old)localStorage.setItem(SETTINGS,old);}}catch(e){}})();
const defaults=[
{id:'p1',name:'Shadow Oversized Tee',cat:'oversized',price:650,old:800,stock:12,rating:5},
{id:'p2',name:'Minimal Tee',cat:'men',price:540,old:650,stock:18,rating:4.8},
{id:'p3',name:'Essential Hoodie',cat:'hoodies',price:990,old:1150,stock:8,rating:5},
{id:'p4',name:'Better Days Tee',cat:'men',price:590,old:700,stock:15,rating:4.9},
{id:'p5',name:'Good Things Tee',cat:'women',price:620,old:750,stock:10,rating:4.7},
{id:'p6',name:'Braven Kids Tee',cat:'kids',price:450,old:550,stock:20,rating:4.8}
];
function getProducts(){let x=JSON.parse(localStorage.getItem(KEY));if(!x){x=defaults;localStorage.setItem(KEY,JSON.stringify(x))}return x}
function setProducts(x){localStorage.setItem(KEY,JSON.stringify(x))}
function getCart(){return JSON.parse(localStorage.getItem(CART)||'[]')}
function setCart(x){localStorage.setItem(CART,JSON.stringify(x));updateCartCount()}
function money(n){return Number(n).toLocaleString('en-US')+' ج.م'}
function imgStyle(p){return p.image?`style="background-image:url('${p.image}');background-size:cover;background-position:center"`:''}
function card(p){return `<article class="product-card"><div class="product-image" ${imgStyle(p)}>${p.old&&p.old>p.price?'<span class="sale">خصم</span>':''}${p.image?'':'<span>BRAVEN</span>'}</div><div class="product-body"><h3>${p.name}</h3><div class="rating">★★★★★ <small>${p.rating||5}</small></div><div><b class="price">${money(p.price)}</b>${p.old?`<span class="old">${money(p.old)}</span>`:''}</div><button class="add-btn" onclick="addToCart('${p.id}')">أضف للسلة</button></div></article>`}
function renderHomeProducts(){updateCartCount();let el=document.getElementById('homeProducts');if(el)el.innerHTML=getProducts().slice(0,4).map(card).join('')}
function initShop(){updateCartCount();const u=new URLSearchParams(location.search);document.getElementById('categorySelect').value=u.get('cat')||'';renderShop()}
function renderShop(){let q=(document.getElementById('searchInput').value||'').toLowerCase(),c=document.getElementById('categorySelect').value,s=document.getElementById('sortSelect').value;let a=getProducts().filter(p=>(!q||p.name.toLowerCase().includes(q))&&(!c||p.cat===c));if(s==='low')a.sort((x,y)=>x.price-y.price);if(s==='high')a.sort((x,y)=>y.price-x.price);document.getElementById('shopProducts').innerHTML=a.map(card).join('')||'<p>لا توجد منتجات مطابقة.</p>'}
function addToCart(id){let p=getProducts().find(x=>x.id===id);if(!p)return;let c=getCart(),i=c.findIndex(x=>x.id===id);if(i>-1)c[i].qty=Math.min(c[i].qty+1,p.stock);else c.push({id,qty:1});setCart(c);toast('تمت إضافة المنتج للسلة')}
function updateCartCount(){let n=getCart().reduce((s,x)=>s+x.qty,0);document.querySelectorAll('#cartCount').forEach(e=>e.textContent=n)}
function renderCart(){
  updateCartCount();
  let c=getCart(),ps=getProducts(),el=document.getElementById('cartArea');
  let html='';
  if(c.length){
    let total=0;
    html+=c.map(x=>{
      let p=ps.find(y=>y.id===x.id); if(!p)return'';
      total+=p.price*x.qty;
      return `<div class="cart-row"><div class="mini-img" ${imgStyle(p)}>BRAVEN</div><div><b>${p.name}</b><small style="display:block;color:#777">${money(p.price)}</small></div><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button> ${x.qty} <button onclick="changeQty('${p.id}',1)">+</button></div><strong>${money(p.price*x.qty)}</strong><button class="remove" onclick="removeCart('${p.id}')">×</button></div>`
    }).join('');
    html+=`<div class="cart-total"><b>الإجمالي: ${money(total)}</b><a class="btn dark-btn" href="checkout.html">إتمام الطلب</a></div>`;
  }else{
    html+='<div class="form-card"><h3>السلة فارغة</h3><a class="btn dark-btn" href="shop.html">ابدأ التسوق</a></div>';
  }
  html+=renderOrderStatuses();
  html+=renderPreviousOrders();
  el.innerHTML=html;
}
function getOrders(){return JSON.parse(localStorage.getItem(ORDERS)||'[]')}
function renderOrderStatuses(){
  let active=getOrders().filter(o=>(o.status||'قيد الانتظار')!=='مكتمل' && (o.status||'قيد الانتظار')!=='ملغي');
  if(!active.length)return '<div class="form-card order-status-list"><h3>حالة طلباتك</h3><p>لا توجد طلبات قيد المتابعة.</p></div>';
  return '<div class="form-card order-status-list"><h3>حالة طلباتك</h3>'+active.slice(0,20).map(o=>`<div class="customer-order-status"><div><b>${o.id}</b><small>${o.date}</small></div><strong>${o.status||'قيد الانتظار'}</strong></div>`).join('')+'</div>'
}
function renderPreviousOrders(){
  let done=getOrders().filter(o=>o.status==='مكتمل');
  if(!done.length)return '<div class="form-card previous-orders"><h3>الطلبات السابقة</h3><p>لا توجد طلبات مكتملة حتى الآن.</p></div>';
  return '<div class="form-card previous-orders"><h3>الطلبات السابقة</h3>'+done.slice(0,20).map(o=>{
    let items=(o.items||[]).map(i=>{let p=getProducts().find(x=>x.id===i.id);return p?`<span>${p.name} × ${i.qty}</span>`:''}).join('');
    return `<div class="previous-order"><div class="order-head"><b>${o.id}</b><small>${o.date}</small><strong>${money(o.total)}</strong></div><div class="previous-items">${items}</div></div>`
  }).join('')+'</div>'
}
function changeQty(id,d){let c=getCart(),i=c.findIndex(x=>x.id===id),p=getProducts().find(x=>x.id===id);if(i<0)return;c[i].qty+=d;if(c[i].qty<1)c.splice(i,1);if(p)c[i]&&(c[i].qty=Math.min(c[i].qty,p.stock));setCart(c);renderCart()}
function removeCart(id){setCart(getCart().filter(x=>x.id!==id));renderCart()}
function renderCheckout(){
  let c=getCart(),ps=getProducts(),total=0;
  c.forEach(x=>{let p=ps.find(y=>y.id===x.id);if(p)total+=p.price*x.qty});
  document.getElementById('checkoutSummary').innerHTML=`<h3>ملخص الطلب</h3>${c.map(x=>{let p=ps.find(y=>y.id===x.id);return p?`<p>${p.name} × ${x.qty} — <b>${money(p.price*x.qty)}</b></p>`:''}).join('')}<hr><h2>${money(total)}</h2>`;
  document.getElementById('checkoutForm').onsubmit=e=>{
    e.preventDefault();
    if(!c.length){toast('السلة فارغة');return}
    let data=Object.fromEntries(new FormData(e.target));
    let psNow=getProducts();
    for(let item of c){let p=psNow.find(x=>x.id===item.id);if(!p||Number(p.stock)<item.qty){toast('الكمية المتاحة غير كافية: '+(p?.name||'منتج'));return}}
    c.forEach(item=>{let p=psNow.find(x=>x.id===item.id);p.stock=Math.max(0,Number(p.stock)-item.qty)});
    setProducts(psNow);
    let order={id:'ORD-'+Date.now(),date:new Date().toLocaleString('ar-EG'),customer:data,total,items:c,status:'قيد الانتظار',createdAt:Date.now()};
    let orders=getOrders();orders.unshift(order);localStorage.setItem(ORDERS,JSON.stringify(orders));setCart([]);
    e.target.innerHTML='<div class="form-card"><h2>تم استلام طلبك ✓</h2><p>رقم الطلب: '+order.id+'</p><p>الحالة: قيد الانتظار</p><a class="btn dark-btn" href="index.html">العودة للرئيسية</a></div>';
  }
}
function saveAccount(){localStorage.setItem(ACCOUNT,JSON.stringify({name:document.getElementById('accountName').value,phone:document.getElementById('accountPhone').value}));document.getElementById('accountMsg').textContent='تم حفظ البيانات ✓'}
function loadAccount(){let a=JSON.parse(localStorage.getItem(ACCOUNT)||'{}');if(a.name)document.getElementById('accountName').value=a.name;if(a.phone)document.getElementById('accountPhone').value=a.phone}
function subscribe(e){e.preventDefault();toast('تم الاشتراك بنجاح ✓');e.target.reset()}
function toast(t){let x=document.getElementById('toast');if(!x)return;x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function openSearch(){location.href='shop.html'}
function initAdmin(){if(sessionStorage.getItem('braven_admin')==='1')showDashboard();else document.getElementById('dashboard').classList.add('hidden')}
function adminLogin(){let e=document.getElementById('adminEmail').value,p=document.getElementById('adminPass').value;if(e==='admin@braven.com'&&p==='123456'){sessionStorage.setItem('braven_admin','1');showDashboard()}else toast('بيانات الدخول غير صحيحة')}
function adminLogout(){sessionStorage.removeItem('braven_admin');location.reload()}
function showDashboard(){document.getElementById('adminLogin').classList.add('hidden');document.getElementById('dashboard').classList.remove('hidden');renderAdmin()}
function renderAdmin(){
  let ps=getProducts(),orders=getOrders();
  document.getElementById('statOrders').textContent=orders.length;
  document.getElementById('statSales').textContent=orders.filter(o=>o.status==='مكتمل').reduce((s,o)=>s+Number(o.total||0),0).toLocaleString();
  document.getElementById('statProducts').textContent=ps.length;
  document.getElementById('statStock').textContent=ps.reduce((s,p)=>s+Number(p.stock||0),0);
  document.getElementById('adminProducts').innerHTML=ps.map(p=>`<div class="admin-product"><div class="admin-thumb" ${imgStyle(p)}>BRAVEN</div><div><b>${p.name}</b><small>${money(p.price)} · مخزون ${p.stock}</small></div><div class="admin-actions"><button onclick="editProduct('${p.id}')">تعديل</button><button onclick="deleteProduct('${p.id}')">حذف</button></div></div>`).join('');
  document.getElementById('adminOrders').innerHTML=orders.length?orders.map(o=>`<div class="order"><div class="order-head"><span>${o.id}</span><span>${money(o.total)}</span></div><small>${o.date} — ${o.customer?.name||''} — ${o.customer?.phone||''}</small><p>${(o.items||[]).map(i=>{let p=ps.find(x=>x.id===i.id);return p?p.name+' × '+i.qty:''}).join('، ')}</p><div class="order-status"><label>حالة الطلب<select onchange="updateOrderStatus('${o.id}',this.value)"><option ${o.status==='قيد الانتظار'?'selected':''}>قيد الانتظار</option><option ${o.status==='قيد التجهيز'?'selected':''}>قيد التجهيز</option><option ${o.status==='مكتمل'?'selected':''}>مكتمل</option><option ${o.status==='ملغي'?'selected':''}>ملغي</option></select></label></div></div>`).join(''):'<p>لا توجد طلبات حتى الآن.</p>';
  renderRevenueDashboard(orders,ps);
  let settings=JSON.parse(localStorage.getItem(SETTINGS)||'{"name":"BRAVEN","phone":"01000000000"}');
  document.getElementById('storeName').value=settings.name;document.getElementById('storePhone').value=settings.phone;
}
function renderRevenueDashboard(orders,ps){
  let el=document.getElementById('revenueDashboard'); if(!el)return;
  let completed=orders.filter(o=>o.status==='مكتمل'),cancelled=orders.filter(o=>o.status==='ملغي'),active=orders.filter(o=>!['مكتمل','ملغي'].includes(o.status||'قيد الانتظار'));
  let now=new Date(), y=now.getFullYear(), m=now.getMonth(), prevM=m===0?11:m-1, prevY=m===0?y-1:y;
  const inMonth=(o,yy,mm)=>{let d=new Date(o.createdAt||Date.parse(o.date));return d.getFullYear()===yy&&d.getMonth()===mm};
  let sum=a=>a.reduce((x,o)=>x+Number(o.total||0),0);
  let revenue=sum(completed), today=completed.filter(o=>{let d=new Date(o.createdAt||Date.parse(o.date));return d.toDateString()===now.toDateString()}), month=completed.filter(o=>inMonth(o,y,m)), year=completed.filter(o=>new Date(o.createdAt||Date.parse(o.date)).getFullYear()===y), prev=completed.filter(o=>inMonth(o,prevY,prevM));
  let productRev={}; completed.forEach(o=>(o.items||[]).forEach(i=>{let p=ps.find(x=>x.id===i.id);if(p)productRev[p.name]=(productRev[p.name]||0)+Number(p.price)*Number(i.qty)}));
  let top=Object.entries(productRev).sort((a,b)=>b[1]-a[1]).slice(0,3);
  el.innerHTML=`<h2>الإيرادات والإحصائيات</h2><div class="stats revenue-stats"><div><b>${money(revenue)}</b><span>إجمالي الإيرادات المكتملة</span></div><div><b>${money(sum(today))}</b><span>إيرادات اليوم</span></div><div><b>${money(sum(month))}</b><span>إيرادات الشهر</span></div><div><b>${money(sum(year))}</b><span>إيرادات السنة</span></div><div><b>${completed.length?money(revenue/completed.length):money(0)}</b><span>متوسط الطلب المكتمل</span></div><div><b>${money(sum(active))}</b><span>قيمة قيد المتابعة</span></div><div><b>${money(sum(cancelled))}</b><span>قيمة الملغى</span></div><div><b>${cancelled.length}</b><span>عدد الطلبات الملغاة</span></div></div><p>مقارنة الشهر السابق: ${money(sum(prev))} مقابل ${money(sum(month))} هذا الشهر.</p><h3>أعلى 3 منتجات تحقيقاً للإيراد</h3><ol>${top.length?top.map(x=>`<li>${x[0]} — ${money(x[1])}</li>`).join(''):'<li>لا توجد مبيعات مكتملة بعد.</li>'}</ol><h3>الطلبات المكتملة</h3><div>${completed.length?completed.map(o=>`<div class="order"><b>${o.id}</b> — ${money(o.total)} — ${o.date}</div>`).join(''):'<p>لا توجد طلبات مكتملة.</p>'}</div><h3>الطلبات الملغاة</h3><div>${cancelled.length?cancelled.map(o=>`<div class="order"><b>${o.id}</b> — ${money(o.total)} — ${o.date}</div>`).join(''):'<p>لا توجد طلبات ملغاة.</p>'}</div>`;
}
function updateOrderStatus(id,status){
  let orders=getOrders(),o=orders.find(x=>x.id===id);if(!o)return;
  let old=o.status||'قيد الانتظار';
  if(old!==status){
    let ps=getProducts();
    if(status==='ملغي' && old!=='ملغي' && old!=='مكتمل'){
      (o.items||[]).forEach(i=>{let p=ps.find(x=>x.id===i.id);if(p)p.stock=Number(p.stock||0)+Number(i.qty||0)});
    }
    if(old==='ملغي' && status!=='ملغي' && status!=='مكتمل'){
      (o.items||[]).forEach(i=>{let p=ps.find(x=>x.id===i.id);if(p)p.stock=Math.max(0,Number(p.stock||0)-Number(i.qty||0))});
    }
    setProducts(ps);
  }
  o.status=status;o.updatedAt=Date.now();localStorage.setItem(ORDERS,JSON.stringify(orders));toast('تم تحديث حالة الطلب ✓');renderAdmin();
}
function saveProduct(e){e.preventDefault();let ps=getProducts(),id=document.getElementById('editId').value||'p'+Date.now(),old=ps.find(p=>p.id===id),file=document.getElementById('pImage').files[0],save=(image)=>{let p={id,name:document.getElementById('pName').value,cat:document.getElementById('pCat').value,price:Number(document.getElementById('pPrice').value),old:Number(document.getElementById('pOld').value)||0,stock:Number(document.getElementById('pStock').value),rating:Number(document.getElementById('pRating').value)||5,image:image||old?.image||''};let i=ps.findIndex(x=>x.id===id);if(i>-1)ps[i]=p;else ps.unshift(p);setProducts(ps);resetProductForm();renderAdmin();toast('تم حفظ المنتج ✓')};if(file){let r=new FileReader();r.onload=()=>save(r.result);r.readAsDataURL(file)}else save(document.getElementById('pImageUrl').value||old?.image||'')}
function editProduct(id){let p=getProducts().find(x=>x.id===id);if(!p)return;document.getElementById('editId').value=p.id;document.getElementById('pName').value=p.name;document.getElementById('pCat').value=p.cat;document.getElementById('pPrice').value=p.price;document.getElementById('pOld').value=p.old||'';document.getElementById('pStock').value=p.stock;document.getElementById('pRating').value=p.rating||5;document.getElementById('pImageUrl').value=p.image?.startsWith('http')?p.image:'';document.getElementById('productFormTitle').textContent='تعديل المنتج';scrollTo({top:0,behavior:'smooth'})}
function resetProductForm(){document.getElementById('productForm').reset();document.getElementById('editId').value='';document.getElementById('productFormTitle').textContent='إضافة منتج'}
function deleteProduct(id){if(!confirm('حذف المنتج؟'))return;setProducts(getProducts().filter(p=>p.id!==id));renderAdmin()}
function saveSettings(){localStorage.setItem(SETTINGS,JSON.stringify({name:document.getElementById('storeName').value,phone:document.getElementById('storePhone').value}));toast('تم حفظ الإعدادات')}
