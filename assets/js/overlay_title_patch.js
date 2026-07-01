
(function(){
  function $(s, r){ return (r||document).querySelector(s); }

  function ensureTitleUnderCover(){
    var overlay = $('#overlay');
    if(!overlay) return;
    var cover = $('#gamecover');
    if(!cover) return;

    // If a title container already exists, don't duplicate
    var holder = $('#overlay-gamename');
    if(!holder){
      holder = document.createElement('div');
      holder.id = 'overlay-gamename';
      // Insert RIGHT AFTER the cover image
      if(cover.nextSibling){
        cover.parentNode.insertBefore(holder, cover.nextSibling);
      } else {
        cover.parentNode.appendChild(holder);
      }
    }

    // Put the game name inside. Prefer existing #gname text if set by game.js
    var gnameText = '';
    var gnameSpan = $('#gname') || $('.gname-control');
    if(gnameSpan && gnameSpan.textContent.trim()){
      gnameText = gnameSpan.textContent.trim();
    }
    // If not yet filled (game.js may set later), set up a retry
    if(!gnameText){
      setTimeout(ensureTitleUnderCover, 300);
      setTimeout(ensureTitleUnderCover, 1000);
      return;
    }

    // Update the overlay title text
    holder.textContent = gnameText;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensureTitleUnderCover);
  } else {
    ensureTitleUnderCover();
  }
  // Re-run after a short delay in case game.js populates later
  setTimeout(ensureTitleUnderCover, 300);
  setTimeout(ensureTitleUnderCover, 1000);
})();
