let featuredImg = document.getElementById("featuredImg")
let featured_rightArrow = document.getElementById("featured_rightArrow")
let featured_leftArrow = document.getElementById("featured_leftArrow")
let counter = document.getElementById("timeCounter")

let IDs = ["511", "524-verso", "532", "501", "1128a-f", "530", "673", "306", "387a-b", "1179a-c", "31a-d"]
let fotoIDs = ["511", "524-verso", "532", "501", "1128a", "530", "673", "306", "387a", "1179a", "31b"]
let img_folder = "images"

async function displayFeatured(num){
    let ID = IDs[num]
    let img = fotoIDs[num]

    featuredImg.src = `${img_folder}/P_${img}.JPG`
    featuredImg.alt = `ID = ${ID}`

    const attribute = [
        "ID", "Ort - Institution - Firma", "Titel", "Jahr", "Künstler"] 
    for (let i = 0; i < attribute.length; i++){
        let p = document.getElementById(`timeAttribute_${attribute[i]}`)
        fetch(`/data/${ID}`) 
            .then((response) => response.json())
            .then((response) => p.innerHTML = response[attribute[i]])
    }
    let a = document.getElementById("timeAttribute_Link")
    a.innerHTML = `${window.location.host}/plakatsuche.html?id=${ID}`
    a.href = `/plakatsuche.html?id=${ID}`

    
}

function nextFeatured(direction){
    let count = Number(counter.innerHTML)

    if (direction == "right" && count < fotoIDs.length - 1){counter.innerHTML = count + 1}
    else if (direction == "right" && count == fotoIDs.length - 1) {counter.innerHTML = "0"}
    else if (direction == "left" && count > 0){counter.innerHTML = count - 1}
    else if (direction == "left" && count == 0) {counter.innerHTML = fotoIDs.length - 1}

    displayFeatured(Number(counter.innerHTML))
}

// fills the featured Container on first load
displayFeatured(counter.innerHTML)

featured_rightArrow.addEventListener("click", () => nextFeatured("right"))
featured_leftArrow.addEventListener("click", () => nextFeatured("left"))

