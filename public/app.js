(function(){
  var root=document.documentElement;
  var LANGS={en:'en',zh:'zh-CN',fr:'fr',hrv:'hr'};
  function apply(l){
    if(!LANGS[l])l='en';
    root.setAttribute('data-lang',l);root.setAttribute('lang',LANGS[l]);
    for(var k in LANGS){var b=document.getElementById('lang-'+k);if(b)b.setAttribute('aria-pressed',k===l?'true':'false');}
  }
  window.setLang=function(l){apply(l);try{localStorage.setItem('agon-lang',l);}catch(e){}};
  var saved=null;try{saved=localStorage.getItem('agon-lang');}catch(e){}
  if(!saved){var nl=(navigator.language||'').toLowerCase();
    if(nl.indexOf('zh')===0)saved='zh';else if(nl.indexOf('fr')===0)saved='fr';else if(nl.indexOf('hr')===0)saved='hrv';}
  apply(saved||'en');
})();
