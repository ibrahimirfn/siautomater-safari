let saran, ratings, stateLink = null, stateSemester = null, tab, initSemesterState
let semester = []
let links = []
const info = document.querySelector('.info')
const run = document.querySelector('#run')
let scrollDown = true

const initSemester = async () => {
    semester = await chrome.tabs.sendMessage(tab.id, {
        command: 'get-semester'
    })
    
    await chrome.tabs.sendMessage(tab.id, {
        command: "goto",
        href: semester[0]
    })
    stateSemester = 0
}

run.addEventListener('click', async function () {
    try {
        saran = document.querySelector('#saran').value
        ratings = Array.from(document.querySelectorAll('.rating-container input[type="radio"]:checked'), el => el.value)
        const dataTab = await chrome.tabs.query({ active: true, currentWindow: true });
        tab = dataTab[0]

        initSemesterState = await chrome.tabs.sendMessage(tab.id, {
            command: 'initialization'
        })
    } catch (error) {
        console.log(error)
        info.style.display = "block"
        info.textContent = "Hayo Error: Coba reload webnya dulu, kalo bingung DM aja"
    }
})

chrome.tabs.onUpdated.addListener(async (tabId, change) => {
    if (change.status == 'complete') {

        info.style.display = "block"
        run.textContent = "Running"
        run.setAttribute("disabled", true)

        if (scrollDown) {
            window.scrollTo(0, document.body.scrollHeight);
            scrollDown = false
        }

        if (initSemesterState) {
            initSemester()
            initSemesterState = false
        }

        if (stateSemester != null) {
            // cek isi array links setiap ganti page semester
            if (links.length == 0) {
                // ambil data links
                links = await chrome.tabs.sendMessage(tab.id, {
                    command: 'get-links'
                });

                // jika data array links ada, redirect ke page link awal
                if (links.length != 0) {
                    stateLink = links.length - 2

                    await chrome.tabs.sendMessage(tab.id, {
                        command: "goto",
                        href: links[stateLink]
                    })
                } else { // jika datanya tidak ada, redirect ke page semester selanjutnya
                    stateSemester++

                    // jika sudah semester akhir, redirect ke page index
                    if(stateSemester == semester.length) {
                        await chrome.tabs.sendMessage(tab.id, {
                            command: "goto",
                            href: 'https://sia.akademik.unsoed.ac.id/krskhskuis/index'
                        })
                    } else { // jika belum semester akhir, redirect ke semester selanjutnya
                        links = []

                        await chrome.tabs.sendMessage(tab.id, {
                            command: "goto",
                            href: semester[stateSemester]
                        })
                    }

                }

                // berhenti disini
                return
            }

            if (stateLink < links.length) {
                // ngisi kuisioner
                let ok = await chrome.tabs.sendMessage(tabId, {
                    command: "filling",
                    saran,
                    ratings
                })

                // lanjut ke next link
                stateLink++
                
                // jika sudah link terakhir, redirect ke next semester
                if(stateLink == links.length) {
                    stateSemester++

                    // jika sudah semester akhir, redirect ke page index
                    if(stateSemester == semester.length) {
                        await chrome.tabs.sendMessage(tab.id, {
                            command: "goto",
                            href: 'https://sia.akademik.unsoed.ac.id/krskhskuis/index'
                        })
                    } else {
                        // kalo belum, reset array links
                        links = []

                        // redirect ke next semester
                        await chrome.tabs.sendMessage(tab.id, {
                            command: "goto",
                            href: semester[stateSemester]
                        })
                    }
                } else { // kalo belum link terakhir, redirect ke next link
                    let oks = await chrome.tabs.sendMessage(tab.id, {
                        command: "goto",
                        href: links[stateLink]
                    })
                }
            }

            if (stateLink == links.length && stateSemester == semester.length) {
                info.textContent = "DONE, EZ BGT!!!"
                run.textContent = "Run"
                run.removeAttribute("disabled")
            }
        }
    }
})