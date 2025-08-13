
function updatePlasmaBorders() {
  document.querySelectorAll('.main-content-box').forEach(box => {
    // Look for direct structure: main-content > main-deets > main-summary (with deets closed)
    const deets = box.querySelector('.main-content > details.main-deets');
    const summary = deets?.querySelector(':scope > summary.main-summary');
    // Glow if found and not open
    box.classList.toggle('has-unopened-details', !!deets && !!summary && !deets.open);
  });
}
updatePlasmaBorders();

// Listen only on direct .main-deets under .main-content in each .main-content-box
document.querySelectorAll('.main-content-box .main-content > details.main-deets').forEach(details => {
  details.addEventListener('toggle', updatePlasmaBorders);
});
