(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { command, saran, ratings, nextLink } = message

        if (command == 'run-page-1') {
            const links = Array.from(document.querySelectorAll('#w5-container tbody tr [data-col-seq="7"] div a.btn'), 
                el => el.textContent != 'Sudah Isi' ? ({ link: el.href, status: el.textContent }) : null
            )
            .filter(link => link != null)
            
            sendResponse({ links, linkID: 26 })
            window.location.href = links[26].link
        }

        if (command == 'run-page-2') {
            (async () => {
                const ratingButtonsAll = Array.from(document.querySelectorAll(`.content table:nth-of-type(3) tbody input[type="radio"]`), el => el)
                .reduce((prevValue, currentValue, index) => {
                    if(index % 4 == 0 || index == 0) {
                        prevValue.push([])
                    }

                    prevValue[prevValue.length - 1].push(currentValue)
                    return prevValue
                }, [])

                console.log(ratingButtonsAll);

                const ratingButtons = ratingButtonsAll.map((ratingButtons, index) => {
                    return ratingButtons.filter(ratingButton =>  {
                        return ratingButton.value == ratings[index]
                    })[0]
                })

                console.log(ratingButtons);

                const saranEl = document.querySelector('#saran')
                const tombolSelesai = document.querySelector('#tombolselesai')


                for (const ratingButton of ratingButtons) {
                    ratingButton.click()
                    await new Promise((resolve, reject) => setTimeout(resolve, 100));
                }

                saranEl.value = saran

                // tombolSelesai.click()

                await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                window.location.href = nextLink || 'https://sia.akademik.unsoed.ac.id/krskhskuis/index'
            })()
        }

    })
})()