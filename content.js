(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { command, saran, ratings, href } = message

        if (command == 'initialization') {
            window.location.href = "https://sia.akademik.unsoed.ac.id/krskhskuis/index"
            sendResponse(true)
        }

        if(command == "goto") {
            window.location.href = href
            sendResponse("ok")
        }

        if (command == "get-semester") {
            const semester = Array.from(document.querySelectorAll('#w5 .card .kv-panel-before a.btn'), el => el.href)
            sendResponse(semester)
        }

        if (command == 'get-links') {
            const links = Array.from(document.querySelectorAll('#w5-container tbody tr [data-col-seq="7"] div a.btn'), 
                el => el.textContent != 'Sudah Isi' ? el.href : null
            )
            .filter(link => link != null)
            
            sendResponse(links)
        }

        if (command == 'filling') {
            (async () => {
                const ratingButtonsAll = Array.from(document.querySelectorAll(`.content table:nth-of-type(3) tbody input[type="radio"]`), el => el)
                .reduce((prevValue, currentValue, index) => {
                    if(index % 4 == 0 || index == 0) {
                        prevValue.push([])
                    }

                    prevValue[prevValue.length - 1].push(currentValue)
                    return prevValue
                }, [])

                const ratingButtons = ratingButtonsAll.map((ratingButtons, index) => {
                    return ratingButtons.filter(ratingButton =>  {
                        return ratingButton.value == ratings[index]
                    })[0]
                })

                const saranEl = document.querySelector('#saran')
                const tombolSelesai = document.querySelector('#tombolselesai')

                for (const ratingButton of ratingButtons) {
                    ratingButton.click()
                    await new Promise((resolve, reject) => setTimeout(resolve, 300));
                }

                saranEl.value = saran

                // tombolSelesai.click()
                
                await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                sendResponse("ok")
            })()
        }

        return true

    })
})()