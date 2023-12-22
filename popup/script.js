let saran, ratings, links, linkID
const info = document.querySelector('.info')
const run = document.querySelector('#run')
let scrollDown = true

run.addEventListener('click', async function () {
    saran = document.querySelector('#saran').value
    ratings = Array.from(document.querySelectorAll('.rating-container input[type="radio"]:checked'), el => el.value)
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const data = await chrome.tabs.sendMessage(tab.id, {
        command: 'run-page-1'
    });

    links = data.links
    linkID = data.linkID
})

chrome.tabs.onUpdated.addListener((tabId, change) => {
    if (change.status == 'complete') {
        info.style.display = "block"
        run.textContent = "Running"
        run.setAttribute("disabled", true)

        if (scrollDown) {
            window.scrollTo(0, document.body.scrollHeight);
            scrollDown = false
        }

        if (linkID == links.length) {
            info.style.display = "none"
            run.textContent = "Run"
            run.removeAttribute("disabled")
        }

        if (linkID < links.length) {
            linkID++
            chrome.tabs.sendMessage(tabId, {
                command: "run-page-2",
                saran,
                ratings,
                nextLink: links[linkID]?.link,
            })
        }
    }
})