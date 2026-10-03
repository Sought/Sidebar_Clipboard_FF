const PREFIX = "https://127.0.0.1:8081";

async function updateSidebar(tabId, url) {
    if (!url)
        await browser.sidebarAction.close();

    if (url.startsWith(PREFIX)) {
        await browser.sidebarAction.open();
    }
    else {
        await browser.sidebarAction.close();
    }
}

browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId);
    updateSidebar(tab.id, tab.url);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        updateSidebar(tabId, changeInfo.url);
    }
});