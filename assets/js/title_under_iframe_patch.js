
(function(){
  function $(s, root){ return (root||document).querySelector(s); }
  function injectCSS(css){
    var style = document.createElement('style'); style.type='text/css';
    style.appendChild(document.createTextNode(css)); document.head.appendChild(style);
  }
  injectCSS('.control-box{display:flex;align-items:center;gap:12px;max-width:1200px;margin:8px auto 0 auto;padding:10px 0}.control-box .gname-control{margin-right:auto;font-weight:800;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.control-box .control-right{display:flex;gap:10px;align-items:center}');
  function move(){
    var ctrl = $('#control-box'); if(!ctrl) return;
    var title = $('#gname') || $('.gname-control');
    if(!title){ title = document.createElement('span'); title.id='gname'; title.className='gname-control'; }
    if(ctrl.firstChild !== title){ ctrl.insertBefore(title, ctrl.firstChild||null); }
    var fsBtn = $('#fullscreen'), open = $('#opennew');
    if(fsBtn || open){
      var right = ctrl.querySelector('.control-right');
      if(!right){ right = document.createElement('div'); right.className='control-right'; ctrl.appendChild(right); }
      if(open && open.parentElement!==right) right.appendChild(open);
      if(fsBtn && fsBtn.parentElement!==right) right.appendChild(fsBtn);
    }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', move); } else { move(); }
  setTimeout(move, 300); setTimeout(move, 1000);
})();
