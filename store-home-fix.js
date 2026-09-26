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
  function valid(p){return p&&typeof p==='object'&&p.id&&p.name&&Number.isFinite(Number(p.price));}
  function ensure(){
    try{
      const raw=localStorage.getItem(KEY);
      const data=raw?JSON.parse(raw):null;
      if(!Array.isArray(data)||!data.length||!data.some(valid)){
        localStorage.setItem(KEY,JSON.stringify(defaults));
        return defaults;
      }
      return data.filter(valid);
    }catch(e){
      localStorage.setItem(KEY,JSON.stringify(defaults));
      return defaults;
    }
  }
  function refresh(){
    ensure();
    try{if(typeof renderHomeProducts==='function')renderHomeProducts();}catch(e){console.error('BRAVEN home render:',e);}
  }
  refresh();
  window.addEventListener('pageshow',refresh);
  window.addEventListener('storage',refresh);
})();
