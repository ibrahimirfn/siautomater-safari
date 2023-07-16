document.querySelector('#run').addEventListener('click', async function () {
    const saran = document.querySelector('#saran').value
    const rating = document.querySelector('#rating:checked').value
    const info = document.querySelector('.info')

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let { links, linkID } = await chrome.tabs.sendMessage(tab.id, {
        command: 'run-page-1'
    });

    chrome.tabs.onUpdated.addListener((tabId, change) => {
        if (change.status == 'complete' && linkID < links.length) {
            info.style.display = "block"
            this.textContent = "Running"

            linkID++

            if (linkID >= links.length) {
                info.textContent = "Selesai"
                this.textContent = 'Run'
            }

            chrome.tabs.sendMessage(tabId, {
                command: "run-page-2",
                saran,
                rating,
                nextLink: links[linkID]?.link,
            })
        }
    })
})