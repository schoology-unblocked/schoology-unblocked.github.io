/* Map lessons to games using STRING IDs (and numbers if you like).
 * You can map by "label" (must match games.json label) OR by direct "game_url".
 */
window.lessonMap = {
  "math-1": { "label": "1v1 Lol" },
  "math-2": { "label": "Slope" },
  "geo-1":  { "label": "Basketball Stars" },
  "science-5": { "game_url": "https://example.com/customtest.html", "label": "Özel Oyun" },
  "1": { "label": "Retro Bowl" }  /* numeric IDs can still be used alongside */
};
