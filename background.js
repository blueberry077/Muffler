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

async function getVolumeState() {
  const data = await chrome.storage.session.get('tabVolumes');
  return data.tabVolumes || {};
}

async function getOldTabId() {
  const data = await chrome.storage.session.get('oldTabId');
  return data.oldTabId || null;
}

async function setVolumeState(state) {
  await chrome.storage.session.set({ tabVolumes: state });
}

async function setOldTabId(Id) {
  await chrome.storage.session.set({ oldTabId: Id });
}

async function syncTabs(activeInfo) {
  const currentTabId = activeInfo.tabId;
  
  const settings = await chrome.storage.local.get({
    duckPercent: 25,
    duckNonYoutube: true
  });
  
  const duckMultiplier = settings.duckPercent / 100;

  try {
    const currentTab = await chrome.tabs.get(currentTabId);
    
    if (!currentTab.url?.includes("youtube.com") && !settings.duckNonYoutube) {
      return; 
    }
  } catch (e) {
    return;
  }

  const storedVolumes = await getVolumeState();
  const oldTabId = await getOldTabId();

  if (oldTabId && oldTabId !== currentTabId) {
    try {
      const oldTab = await chrome.tabs.get(oldTabId);
      if (oldTab.url?.includes("youtube.com")) {
        const [injection] = await chrome.scripting.executeScript({
          target: { tabId: oldTabId },
          func: () => { const v = document.querySelector('video'); return v ? v.volume : null; }
        }).catch(() => [null]);

        const playerVolume = injection?.result;

        if (playerVolume !== null && playerVolume !== undefined) {
          const baseline = storedVolumes[oldTabId] ?? 0.5;
          const expectedDuck = baseline * duckMultiplier;

          if (Math.abs(playerVolume - expectedDuck) > 0.01 && Math.abs(playerVolume - baseline) > 0.01) {
            storedVolumes[oldTabId] = playerVolume;
          }
        }
      }
    } catch (e) {}
  }

  const youtubeTabs = await chrome.tabs.query({ url: "https://*.youtube.com/*" });

  for (const tab of youtubeTabs) {
    if (storedVolumes[tab.id] === undefined) {
      storedVolumes[tab.id] = 0.5;
    }

    const baseline = storedVolumes[tab.id];
    const targetVolume = (tab.id === currentTabId) ? baseline : (baseline * duckMultiplier);

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (vol) => { const v = document.querySelector('video'); if (v) v.volume = vol; },
      args: [targetVolume]
    }).catch(() => {});
  }

  await setVolumeState(storedVolumes);
  await setOldTabId(currentTabId);
}

chrome.tabs.onActivated.addListener(syncTabs);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if (changeInfo.status === 'complete' && tabInfo.url?.includes("youtube.com")) {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (activeTab) syncTabs({ tabId: activeTab.id });
    });
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const storedVolumes = await getVolumeState();
  delete storedVolumes[tabId];
  await setVolumeState(storedVolumes);

  const oldTabId = await getOldTabId();
  if (oldTabId === tabId) {
    await setOldTabId(null);
  }
});