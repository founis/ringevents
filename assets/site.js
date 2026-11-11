// Standalone preview version. Leads open a composed WhatsApp message; there is no server-side CRM.
document.documentElement.classList.add('js-enabled');
(()=>{
 const menuBtn=document.getElementById('menuToggle'), menu=document.getElementById('siteNav');
 if(menuBtn&&menu){menuBtn.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'סגירת תפריט':'פתיחת תפריט')});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}})}
 if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}})},{rootMargin:'0px 0px 30px 0px',threshold:.06});document.querySelectorAll('.reveal').forEach(e=>io.observe(e))}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));
 document.querySelectorAll('.filters').forEach(group=>{group.addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;const filter=btn.dataset.filter;group.querySelectorAll('button').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});const grid=group.nextElementSibling;grid?.querySelectorAll('.gallery-item').forEach(card=>{card.classList.toggle('is-hidden',filter!=='all'&&card.dataset.kind!==filter)})})});
 const dialog=document.getElementById('lightbox');if(dialog&&typeof dialog.showModal==='function'){document.querySelectorAll('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=btn.dataset.image;img.alt=btn.dataset.title;dialog.querySelector('p').textContent=btn.dataset.title;dialog.showModal()}));dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()})}
 const forms=document.querySelectorAll('.lead-form');forms.forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const name=form.querySelector('[name=name]').value.trim();const phone=form.querySelector('[name=phone]').value.trim();const area=form.querySelector('[name=area]').value;const date=form.querySelector('[name=date]').value;const note=form.querySelector('[name=note]').value.trim();const agree=form.querySelector('#leadConsent').checked;const m=form.querySelector('.form-message');m.classList.remove('error','success');if(name.length<2){m.textContent='נשמח לקבל שם מלא כדי שנדע איך לפנות אליכם.';m.classList.add('error');form.querySelector('[name=name]').focus();return}if(!/^0?5\d[\d\s-]{7,11}$/.test(phone.replace(/\s/g,''))){m.textContent='נא להזין מספר טלפון נייד ישראלי תקין.';m.classList.add('error');form.querySelector('[name=phone]').focus();return}if(!agree){m.textContent='כדי להמשיך, יש לאשר את מדיניות הפרטיות.';m.classList.add('error');form.querySelector('#leadConsent').focus();return}let msg=['שלום Ring Events, אשמח לקבל פרטים ולתכנן הצעת נישואין 💍',`שם: ${name}`,`טלפון: ${phone}`];if(area)msg.push(`אזור: ${area}`);if(date)msg.push(`תאריך: ${date}`);if(note)msg.push(`פרטים נוספים: ${note}`);msg.push('אשמח שתחזרו אליי.');let url='https://wa.me/972585781866?text='+encodeURIComponent(msg.join('\n'));m.textContent='ההודעה מוכנה. WhatsApp ייפתח לאישור ולשליחה שלכם.';m.classList.add('success');let win=window.open(url,'_blank','noopener,noreferrer');if(!win){window.location.href=url}}));
})();


// Signature Experience v2: explicit opt-out, engagement quiz, motion that respects user preference.
(()=>{
 'use strict';
 const $=(s,scope=document)=>scope.querySelector(s);
 const STORAGE_KEY='ringEventsExitDismissedV2';
 const getDismissed=()=>{try{return sessionStorage.getItem(STORAGE_KEY)==='1'}catch(e){return Boolean(window.__ringExitDismissed)}};
 const rememberDismissal=()=>{try{sessionStorage.setItem(STORAGE_KEY,'1')}catch(e){window.__ringExitDismissed=true}};
 const motionOK=window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
 const progress=$('.scroll-progress');
 const hero=$('.hero-photo img');
 let scrollPending=false, maxScroll=0;
 function updateScroll(){
   const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight), y=Math.max(0,window.scrollY);
   const pct=Math.min(100,(y/max)*100);
   if(progress)progress.style.width=pct.toFixed(2)+'%';
   document.body.classList.toggle('has-scrolled',y>95);
   maxScroll=Math.max(maxScroll,y);
   if(hero&&motionOK&&y<Math.max(750,window.innerHeight*1.1)){
      hero.style.transform='scale(1.055) translate3d(0,'+Math.min(24,y*.045).toFixed(1)+'px,0)';
   }
   scrollPending=false;
 }
 window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll)}},{passive:true});
 updateScroll();
 // Restore a graceful dark placeholder when old remote image URLs cannot be loaded.
 document.querySelectorAll('img[src*="ringevents.co.il/"]').forEach(img=>{
   const useFallback=()=>{if(img.naturalWidth===0){const holder=img.closest('.hero-photo,.intro-photo,.service-image,.article-image,.extras-image,.gallery-item,.style-image,.about-portrait,.manifesto-photo,.inner-hero');if(holder)holder.classList.add('image-fallback')}};
   img.addEventListener('error',useFallback,{once:true});
   if(img.complete&&img.naturalWidth===0)useFallback();
 });
 // Three-choice personal style finder. Never stores personal data or claims real-time availability.
 const stage=$('#conceptStage'), counter=$('#conceptCounter'), bar=$('#conceptProgress'), back=$('#conceptBack');
 if(stage&&counter&&bar&&back){
   const answers=[];
   const steps=[
     {label:'STEP 01 — STYLE',title:'איזה סגנון מרגיש הכי אתם?',hint:'הבחירה הראשונה בדרך לרגע שלא תשכחו.', key:'style', options:[['✦','רומנטי וקלאסי','נרות, פרחים ורגע מלא רגש'],['❊','טבע ובוהו שיק','אווירה טבעית, שקיעה וקסם'],['◇','הפקה מרשימה','אותיות מוארות ועיצוב עוצר נשימה']]},
     {label:'STEP 02 — LOCATION',title:'איפה תדמיינו את הרגע?',hint:'אפשר לשנות בהמשך — אנחנו כאן כדי לחשוב יחד.',key:'area',options:[['☼','ים ושקיעה','אור זהוב מול הגלים'],['◇','כנרת והצפון','נוף מים, טבע ושקט'],['✧','לוקיישן אחר','עיר, גן, מלון או כל מקום בארץ']]},
     {label:'STEP 03 — COMPANY',title:'את מי תרצו לידכם?',hint:'גם הרכב המשתתפים משפיע על העיצוב ועל האווירה.',key:'guests',options:[['♡','רק שנינו','רגע אינטימי ומרגש'],['✦','משפחה וחברים','לחגוג עם האנשים הכי קרובים'],['…','עוד לא החלטנו','נשמח להתייעץ יחד']]}
   ];
   let step=0;
   function el(tag,cls,content){const a=document.createElement(tag);if(cls)a.className=cls;if(content!==undefined)a.textContent=content;return a}
   function showStep(){
     stage.replaceChildren();
     counter.textContent=String(step+1).padStart(2,'0')+' / 03';
     bar.style.width=((step+1)*100/3)+'%';
     back.hidden=step===0;
     if(step===3){return showResult()}
     const d=steps[step];stage.append(el('span','concept-kicker',d.label),el('h3','',d.title),el('p','',d.hint));
     const opts=el('div','concept-options');opts.setAttribute('role','group');opts.setAttribute('aria-label',d.title);
     d.options.forEach(([symbol,title,desc])=>{
       const btn=el('button','concept-choice');btn.type='button';btn.setAttribute('aria-label',title+' — '+desc);
       btn.append(el('span','choice-symbol',symbol),el('strong','',title),el('small','',desc),el('span','choice-arrow','↗'));
       btn.querySelector('.choice-symbol').setAttribute('aria-hidden','true');btn.querySelector('.choice-arrow').setAttribute('aria-hidden','true');
       btn.addEventListener('click',()=>{answers[step]=title;step++; if(step===3)showResult();else showStep()});opts.append(btn);
     });stage.append(opts);
   }
   function showResult(){
     stage.replaceChildren();counter.textContent='03 / 03';bar.style.width='100%';back.hidden=false;
     stage.append(el('span','concept-kicker','YOUR SIGNATURE MOMENT'),el('h3','','כבר אפשר לדמיין את הרגע שלכם.'),el('p','','הנה הכיוון שבחרתם. את הפרטים ואת העיצוב המדויק נבנה יחד בשיחה.'));
     const res=el('div','concept-result'),ico=el('div','concept-result-symbol','◇'),txt=el('div','');
     txt.append(el('strong','',answers[0]||'הצעה אישית'),el('span','',(answers[1]||'מיקום לבחירתכם')+' • '+(answers[2]||'חוויה בהתאמה אישית')));res.append(ico,txt);stage.append(res);
     const msg=['שלום Ring Events 💍','התנסיתי בבחירת סגנון באתר וארצה לשמוע על הפקה בהתאמה אישית:',`סגנון: ${answers[0]}`,`לוקיישן: ${answers[1]}`,`משתתפים: ${answers[2]}`,'אפשר לקבל פרטים ולתכנן יחד?'].join('\n');
     const actions=el('div','concept-final-cta'),wa=el('a','btn btn-gold'),gallery=el('a','');
     wa.href='https://wa.me/972585781866?text='+encodeURIComponent(msg);wa.target='_blank';wa.rel='noopener noreferrer';wa.textContent='לקבלת רעיון מותאם ב־WhatsApp ↗';
     gallery.href='gallery.html';gallery.textContent='קודם לראות עוד הפקות';
     actions.append(wa,gallery);stage.append(actions);
   }
   back.addEventListener('click',()=>{if(step>0){step--;showStep();}});
   stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&step>0&&e.target===stage){step--;showStep()}});
   showStep();
 }
 // Exit intent shown at most once per browser tab session; desktop pointer leaving via top only.
 const exit=$('#exitIntent');
 if(exit&&typeof exit.showModal==='function'){
   const openedAt=Date.now();let shown=false;const desktop=()=>window.matchMedia('(min-width: 851px) and (hover: hover) and (pointer: fine)').matches;
   const close=()=>{if(exit.open)exit.close();rememberDismissal();};
   exit.querySelectorAll('[data-close-exit]').forEach(el=>el.addEventListener('click',close));
   exit.addEventListener('cancel',()=>rememberDismissal());
   exit.addEventListener('click',e=>{if(e.target===exit)close()});
   const link=$('#exitQuiz');if(link){link.href=$('#concept-quiz')?'#concept-quiz':'index.html#concept-quiz';link.addEventListener('click',()=>{rememberDismissal();exit.close()})}
   exit.querySelectorAll('a').forEach(a=>a.addEventListener('click',rememberDismissal));
   function doOpen(){
     if(shown||getDismissed()||!desktop()||exit.open)return;
     if(document.querySelector('.lightbox[open]')||document.querySelector('.lead-form:focus-within')||document.querySelector('#conceptExperience:focus-within'))return;
     if(Date.now()-openedAt<20000 || maxScroll<Math.min(260,window.innerHeight*.25))return;
     shown=true;rememberDismissal();exit.showModal();exit.querySelector('.exit-close')?.focus();
   }
   document.addEventListener('mouseout',e=>{if(!e.relatedTarget&&e.clientY<=6)doOpen()});
 }
 // Mobile: no unreliable exit-popup. One optional small nudge after deliberate engagement.
 const nudge=$('#softNudge');
 if(nudge){
   const nudgeLink=nudge.querySelector('.nudge-link');nudgeLink.href=$('#concept-quiz')?'#concept-quiz':'index.html#concept-quiz';
   const started=Date.now();let nudgeUsed=false;
   const dismiss=()=>{nudge.hidden=true;nudgeUsed=true;rememberDismissal();};
   nudge.querySelector('.nudge-close')?.addEventListener('click',dismiss);
   nudgeLink?.addEventListener('click',dismiss);
   window.addEventListener('scroll',()=>{
      if(nudgeUsed||getDismissed()||!window.matchMedia('(max-width:850px)').matches||document.querySelector('#conceptExperience:focus-within'))return;
      if(Date.now()-started<45000||maxScroll<Math.max(650,window.innerHeight))return;
      nudgeUsed=true;nudge.hidden=false;
   },{passive:true});
 }
 // Gallery: add next/previous and keyboard arrows to let visitors explore continuously.
 const lightbox=$('#lightbox');
 if(lightbox){
    let at=0, visible=[];
    const img=$('img',lightbox), label=$('p',lightbox);
    function collection(){visible=[...document.querySelectorAll('.gallery-item:not(.is-hidden)')];}
    function update(){const item=visible[at];if(!item)return;img.src=item.dataset.image;img.alt=item.dataset.title;label.textContent=(at+1)+' / '+visible.length+'  ·  '+item.dataset.title}
    function go(delta){collection();if(!visible.length)return;at=(at+delta+visible.length)%visible.length;update()}
    const prev=document.createElement('button'),next=document.createElement('button');
    prev.type=next.type='button';prev.className='lightbox-nav lightbox-prev';next.className='lightbox-nav lightbox-next';prev.textContent='→';next.textContent='←';prev.setAttribute('aria-label','תמונה קודמת');next.setAttribute('aria-label','תמונה הבאה');lightbox.append(prev,next);
    prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
    document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{collection();at=Math.max(0,visible.indexOf(item));update()}));
    document.addEventListener('keydown',e=>{if(!lightbox.open)return;if(e.key==='ArrowRight'){e.preventDefault();go(-1)}if(e.key==='ArrowLeft'){e.preventDefault();go(1)}});
 }
})();



// V3: optional inspiration shortlisting. No tracking network requests, no personal data stored.
(()=>{
 'use strict';
 const $=(s,scope=document)=>scope.querySelector(s);
 const KEY='RingEvents_Inspirations_v3';
 let memory=[];
 function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.slice(0,15):[]}catch(_){return memory}}
 function write(items){memory=items;try{localStorage.setItem(KEY,JSON.stringify(items))}catch(_){}}
 function event(name,params={}){if(Array.isArray(window.dataLayer))window.dataLayer.push({event:name,...params})}
 let current=null;
 const modal=$('#lightbox'),save=$('#saveGalleryItem'),launcher=$('#favoritesFloat'),count=$('#favoritesCount'),drawer=$('#favoritesDialog'),list=$('#favoritesList'),send=$('#favoritesSend');
 if(!drawer||!launcher||!list||!count)return;
 function updateLauncher(){const n=read().length; count.textContent=String(n); launcher.hidden=n===0;}
 function syncSave(){if(!save||!current)return;const exists=read().some(x=>x.image===current.image);save.setAttribute('aria-pressed',String(exists));save.textContent=exists?'♥  נוסף להשראות שלי':'♡  שמירה להשראות שלי';}
 function toItem(node){return {title:(node.dataset.title||'השראה להפקה').slice(0,100),image:(node.dataset.image||'').slice(0,500)};}
 document.querySelectorAll('.gallery-item').forEach(card=>card.addEventListener('click',()=>{current=toItem(card);syncSave()}));
 save?.addEventListener('click',()=>{
   if(!current)return;
   let items=read();const existing=items.findIndex(x=>x.image===current.image);
   if(existing>=0)items.splice(existing,1);else items=[...items,current].slice(-12);
   write(items);syncSave();updateLauncher();event('ring_inspiration_toggle',{saved:existing<0,count:items.length});
 });
 function buildMessage(){const items=read();return ['שלום Ring Events 💍','ראיתי באתר שלכם כמה רעיונות שאהבתי, ואשמח לקבל הצעה בהתאמה אישית:', ...items.map((x,i)=>(i+1)+'. '+x.title),'אפשר לדבר על סגנון, מיקום ותאריך?'].join('\n')}
 function render(){list.replaceChildren();const items=read();if(!items.length){const p=document.createElement('p');p.className='favorite-empty';p.textContent='עדיין לא נשמרו השראות. פתחו תמונה בגלריה ולחצו על הלב כדי להוסיף אותה.';list.append(p);send.setAttribute('aria-disabled','true');send.setAttribute('tabindex','-1');send.href='https://wa.me/972585781866';return}
   send.removeAttribute('aria-disabled');send.removeAttribute('tabindex');send.href='https://wa.me/972585781866?text='+encodeURIComponent(buildMessage());
   items.forEach(item=>{const div=document.createElement('div');div.className='favorite-card';const image=document.createElement('img');image.src=item.image;image.alt='';image.loading='lazy';image.addEventListener('error',()=>{image.src='assets/hero-concept.webp';});const title=document.createElement('b');title.textContent=item.title;const del=document.createElement('button');del.type='button';del.className='favorite-remove';del.textContent='הסר';del.setAttribute('aria-label','הסרת '+item.title+' מההשראות');del.addEventListener('click',()=>{write(read().filter(x=>x.image!==item.image));render();updateLauncher();syncSave()});div.append(image,title,del);list.append(div)})
 }
 launcher.addEventListener('click',()=>{render();if(typeof drawer.showModal==='function')drawer.showModal();event('ring_inspiration_open')});
 drawer.querySelectorAll('[data-close-favorites]').forEach(b=>b.addEventListener('click',()=>drawer.close()));
 drawer.addEventListener('click',e=>{if(e.target===drawer)drawer.close()});
 send.addEventListener('click',()=>{event('ring_inspiration_whatsapp',{count:read().length})});
 updateLauncher();
 // Allow other components to use the drawer for user-selected inspirations.
 window.RingEventsInspiration={count:()=>read().length};
})();

// Only hide the concept disclosure after a real client photo has successfully loaded.
(()=>{const holder=document.querySelector('.hero-photo');const image=holder?.querySelector('img');if(!image)return;const verify=()=>{if(image.naturalWidth>0)holder.classList.add('image-real');else holder.classList.add('image-fallback')};image.addEventListener('load',verify,{once:true});image.addEventListener('error',verify,{once:true});if(image.complete)verify()})();

/* ===== merge: films + exit offer form ===== */
(()=>{
 'use strict';
 const WA='972585781866';
 const push=(ev,d)=>{try{(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:ev},d||{}))}catch(e){}};
 document.querySelectorAll('.reels-section').forEach(sec=>{
   const track=sec.querySelector('.reels-track');
   sec.querySelectorAll('.reel button[data-yt]').forEach(b=>b.addEventListener('click',()=>{
     track.querySelectorAll('iframe').forEach(f=>f.src='about:blank');
     const id=b.dataset.yt,f=document.createElement('iframe');
     f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
     f.title='סרטון הפקת הצעת נישואין';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
     b.replaceWith(f);push('video_play',{video:id});
   }));
   const step=d=>{const c=track.querySelector('.reel');if(c)track.scrollBy({left:d*(c.offsetWidth+18)*2,behavior:'smooth'})};
   sec.querySelector('.reels-next')?.addEventListener('click',()=>step(-1));
   sec.querySelector('.reels-prev')?.addEventListener('click',()=>step(1));
 });
 document.querySelectorAll('.exit-form').forEach(f=>f.addEventListener('submit',e=>{
   e.preventDefault();
   const n=f.elements.namedItem('name'),p=f.elements.namedItem('phone'),a=f.elements.namedItem('area'),m=f.querySelector('.exit-form-msg');
   const ph=p.value.replace(/[^\d+]/g,'');
   const bad=[[n,n.value.trim().length<2],[p,!/^(\+?972|0)5\d{8}$/.test(ph)&&!/^0[2-9]\d{7,8}$/.test(ph)],[a,!a.value]];
   bad.forEach(([el,b])=>el.setAttribute('aria-invalid',b?'true':'false'));
   const first=bad.find(x=>x[1]);
   if(first){m.textContent='נא למלא שם, טלפון תקין ואזור.';m.classList.add('error');first[0].focus();return}
   const msg='שלום Ring Events, ראיתי באתר הצעה החל מ־1,200 ₪ ואשמח לפרטים.\nשם: '+n.value.trim()+'\nטלפון: '+ph+'\nאזור: '+a.value;
   const url='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
   m.classList.remove('error');m.innerHTML='תודה! אם WhatsApp לא נפתח, <a href="'+url+'" target="_blank" rel="noopener">לחצו כאן לשליחה</a>.';
   try{sessionStorage.setItem('ringEventsExitDismissedV2','1')}catch(err){}
   push('lead',{form_source:f.dataset.source,region:a.value});
   const w=window.open(url,'_blank');if(!w)location.href=url;
 }));
})();
