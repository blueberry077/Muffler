/*

	Muffler - Auto-Duck Volume Extension for Chrome
	
	AUTHOR Marc-Daniel DALEBA
	DATE 2026-06-05
	LICENSE MIT
	DESC
		Extension for Chrome-based browsers.
		Nice extension to auto-duck Youtube tabs if you
		have multiple running.

*/

const slider = document.getElementById('duckPercent');
const duckVal = document.getElementById('duckVal');
const checkbox = document.getElementById('duckNonYoutube');

chrome.storage.local.get({ duckPercent: 25, duckNonYoutube: true }, (items) => {
  slider.value = items.duckPercent;
  duckVal.textContent = `${items.duckPercent}%`;
  checkbox.checked = items.duckNonYoutube;
});

slider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value, 10);
  duckVal.textContent = `${val}%`;
  chrome.storage.local.set({ duckPercent: val });
});

checkbox.addEventListener('change', (e) => {
  chrome.storage.local.set({ duckNonYoutube: e.target.checked });
});