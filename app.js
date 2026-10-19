'use strict';
const playIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>';
const pauseIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
const buttons=[...document.querySelectorAll('.play-together')];
buttons.forEach(button=>button.addEventListener('click',async()=>{
  const section=button.closest('.comparison');
  const videos=[...section.querySelectorAll('video')];
  const shouldPause=button.getAttribute('aria-pressed')==='true';
  document.querySelectorAll('video').forEach(v=>v.pause());
  buttons.forEach(b=>{b.setAttribute('aria-pressed','false');b.innerHTML=playIcon+'Play together';});
  if(shouldPause)return;
  videos.forEach(v=>{v.currentTime=0;v.muted=true;});
  const outcomes=await Promise.allSettled(videos.map(v=>v.play()));
  const failed=outcomes.some(o=>o.status==='rejected');
  button.setAttribute('aria-pressed',failed?'false':'true');
  button.innerHTML=failed?playIcon+'Play together':pauseIcon+'Pause together';
  section.querySelector('.status').textContent=failed?'Use the playback controls on each video to start playback.':'';
}));
document.querySelectorAll('video').forEach(v=>{
  v.addEventListener('error',()=>{v.closest('.comparison').querySelector('.status').textContent='A video could not be loaded. Try its download link.';});
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){document.querySelectorAll('video').forEach(v=>v.pause());buttons.forEach(b=>{b.setAttribute('aria-pressed','false');b.innerHTML=playIcon+'Play together';});}});
const copyButton=document.querySelector('#copy-citation');
copyButton.addEventListener('click',()=>{
  const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('#bibtex'));selection.removeAllRanges();selection.addRange(range);
  let copied=false;try{copied=document.execCommand('copy');}catch{}
  copyButton.textContent=copied?'Copied':'Citation selected — copy with Ctrl/Cmd+C';
  if(copied)selection.removeAllRanges();
});
const dialog=document.querySelector('#figure-dialog');
document.querySelectorAll('.zoom-link').forEach(link=>link.addEventListener('click',e=>{
  if(!dialog.showModal)return;
  e.preventDefault();const original=link.querySelector('img');
  dialog.querySelector('img').src=original.src;dialog.querySelector('img').alt=original.alt;
  dialog.showModal();
}));
dialog.querySelector('button').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
