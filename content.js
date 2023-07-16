(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { command, saran, rating, nextLink } = request

        if (command == 'run-page-1') {
            const links = Array.from(document.querySelectorAll('#w5-container tbody tr [data-col-seq="7"] div a'), el => ({ link: el.href, status: el.textContent }))

            for (const [index, link] of links.entries()) {
                if (link.status != 'Sudah Isi') {
                    sendResponse({ links, linkID: 26 })
                    window.location.href = links[26].link
                    break
                }
            }
        }

        if (command == 'run-page-2') {
            (async () => {
                const ratingButtons = Array.from(document.querySelectorAll(`.content table:nth-of-type(3) tbody input[value="${rating}"]`), el => el)

                const saranEl = document.querySelector('#saran')
                const tombolSelesai = document.querySelector('#tombolselesai')

                for (const ratingButton of ratingButtons) {
                    ratingButton.click()
                    await new Promise((resolve, reject) => setTimeout(resolve, 100));
                }

                saranEl.value = saran

                tombolSelesai.click()

                await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                window.location.href = nextLink || 'https://sia.akademik.unsoed.ac.id/krskhskuis/index'
            })()
        }

    })
})()