chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL('welcome/index.html')
    let tab = await chrome.tabs.create({ url })
})