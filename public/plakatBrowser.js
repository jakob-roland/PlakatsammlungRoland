var data = await fetch("/data")
    .then(response => response.json());

console.log(window.location.host)

function removeAllElements(){
    let altImg = document.getElementsByClassName("image");
    let altText = document.getElementById("keineErgebnisse");
    let altText2 = document.getElementById("ergebnisse");
    let altOverlay = document.getElementsByClassName("overlay")
    let altOverlayText = document.getElementsByClassName("overlayText")
    let altContainer = document.getElementsByClassName("container")

    removeOneElement(altText)
    removeOneElement(altText2)
    removeElements(altImg)
    removeElements(altOverlay)
    removeElements(altOverlayText)
    removeElements(altContainer)
}

function removeOneElement(element){
    if (element != null){
        element.remove()  
    }
}

function removeElements(eleArray){
    let length = eleArray.length
    for (let i = 0; i < length; i++){
        eleArray[0].remove()
    }
}

function neueSuche(){
    return document.getElementById("suchfeld").value;
}

function getResults(suchbegriff, daten, suchfelder){
    if (suchbegriff == "") {return daten}
    let exakt = document.getElementById("cbExakt").checked
    let results = new Set()
    console.log(suchbegriff)
    for (let i = 0; i < daten.length; i++) {
        // Spezialsuche für das Auffinden aller PLakate ohne Nachweis
        if (suchbegriff == "Kein Nachweis"){
            console.log("yes")
            if (daten[i]["Nachweis"][0] == "Kein Nachweis"){
                results.add(daten[i])
            }
            continue
        }
        for (let n = 0; n < suchfelder.length; n++){
            if (exakt == false){
                if (daten[i][suchfelder[n]].toLowerCase().includes(suchbegriff.toLowerCase())) {
                results.add(daten[i])
                }
            } else {
                if (daten[i][suchfelder[n]].toLowerCase() == suchbegriff.toLowerCase()) {
                    results.add(daten[i])
                }
            }
        }
    }
    return Array.from(results)
}

function neuesBild(result){
    let container = document.createElement("div");
    container.classList.add("container");
    document.getElementById("display").appendChild(container);

    if (result["ID"].includes("a")){
        var IDb = result["ID"].substring(0, result["ID"].length - 3)
    } else {var IDb = result["ID"]}

    let img_folder = "thumbnails"

    let bild = document.createElement("img");
    bild.src = `${img_folder}/P_${IDb}.JPG`;
    bild.alt = `Bild nicht gefunden. ID = ${IDb}`;
    bild.classList.add("image");
    bild.loading = "lazy"
    container.appendChild(bild);

    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.addEventListener("click", () => createModal(result, attributeAlle)) // eventlistener für Modal
    container.appendChild(overlay);

    let overlayText = document.createElement("div");
    overlayText.classList.add("overlayText");
    overlayText.addEventListener("click", () => createModal(result, attributeAlle)) // eventlistener für Modal
    container.appendChild(overlayText);

    for (let i = 0; i < attributePreview.length; i++){ // Attributetext
        let paragraph = document.createElement("p");
        paragraph.innerHTML = `${attributePreview[i]}: ${result[attributePreview[i]]}`;
        overlayText.appendChild(paragraph);
    }
}

function createModal(result, attribute){
    let oldModalText = document.getElementsByClassName("remove");
    removeElements(oldModalText);

    let modal = document.getElementById("modal");       // modal
    let modalTextContainer = document.getElementById("modalTextContainer")

    let modalIMG = document.getElementById("modalIMG"); // gets modal img
    let imgLink = document.getElementById("imgLink")

    let img_folder = "https://res.cloudinary.com/dppoc515v/image/upload/v1762814197"
    // If there are more than one picture associated with an ID...
    if (result["ID"].includes("a")){
        let name = result["ID"].substring(0, result["ID"].length - 3)
            
        modalIMG.src = `${img_folder}/P_${name}a.JPG`;
        imgLink.href = `${img_folder}/P_${name}a.JPG`

        /* Für Elemente mit meheren Bilder (IDa-c). 
        Erstellt Pfeile und fügt Eventlistener zum Wechseln hinzu */

        let pfeilLinks = document.createElement("button")
        pfeilLinks.id = "pfeilLinks"
        pfeilLinks.innerHTML = "<"
        pfeilLinks.classList.add("remove")
        modalTextContainer.appendChild(pfeilLinks)

        let nextBild = document.createElement("t")
        nextBild.innerHTML = "  Nächstes Bild  "
        nextBild.classList.add("remove")
        modalTextContainer.appendChild(nextBild)

        let pfeilRechts = document.createElement("button")
        pfeilRechts.id = "pfeilRechts"
        pfeilRechts.innerHTML = ">"
        pfeilRechts.classList.add("remove")
        modalTextContainer.appendChild(pfeilRechts)
        
        pfeilLinks.addEventListener("click", () => nextPicModal("Links", result))
        pfeilRechts.addEventListener("click", () => nextPicModal("Rechts", result))

    } else {
        modalIMG.src = `${img_folder}/P_${result["ID"]}.JPG`;
        imgLink.href = `${img_folder}/P_${result["ID"]}.JPG`
    }

    let EDITbutton = false // document.getElementById("edit").checked; EDIT MODE DEACTIVATED

    if (EDITbutton == false) { // normal mode
        for (let i = 0; i < attribute.length; i++){         // Attributetext
            if (attribute[i] == "Nachweis") {  // zeigt Links für Nachweis an
                let paragraph = document.createElement("p");
                paragraph.classList.add("remove");
                paragraph.innerHTML = `${attribute[i]}:`;
                paragraph.style.fontWeight = "bold"
                modalTextContainer.appendChild(paragraph);
                for (let i = 0; i < result["Nachweis"].length; i++){
                    if (result["Nachweis"][i].startsWith("http")) {
                        let link = document.createElement("a")
                        link.setAttribute("target", "_blank")
                        link.classList.add("remove");
                        link.href = result["Nachweis"][i]
                        link.innerHTML = result["Nachweis"][i]
                        link.style.display = "block"    
                        modalTextContainer.appendChild(link)
                    } else {
                        let link = document.createElement("p")
                        link.innerHTML = result["Nachweis"][i]
                        link.classList.add("remove");
                        modalTextContainer.appendChild(link)
                    }
                }
            } else { // alle anderen Parameter außer Nachweis
                let paragraph = document.createElement("p");
                paragraph.classList.add("remove");
                paragraph.innerHTML = `${attribute[i]}:`;
                paragraph.style.fontWeight = "bold"
                modalTextContainer.appendChild(paragraph);

                paragraph = document.createElement("p");
                paragraph.classList.add("remove");
                paragraph.innerHTML = `${result[attribute[i]]}`;
                modalTextContainer.appendChild(paragraph);
            }}
        // adds permalink
            let paragraph = document.createElement("p");
            paragraph.classList.add("remove");
            paragraph.innerHTML = "Link:";
            paragraph.style.fontWeight = "bold"
            modalTextContainer.appendChild(paragraph);

            let link = document.createElement("a");
            link.href = `${window.location.pathname}?id=${result["ID"]}`
            link.innerHTML = `${window.location.host}${window.location.pathname}?id=${result["ID"]}`
            link.classList.add("remove");
            modalTextContainer.appendChild(link);
        
        } else { // edit Mode
        for (let i = 0; i < attribute.length; i++){
            if (attribute[i] == "ID"){  // erstellt ID paragraph -- nicht editierbar
                let paragraph = document.createElement("p");
                paragraph.classList.add("remove");
                paragraph.innerHTML = `${attribute[i]}: ${result[attribute[i]]}`;
                modalTextContainer.appendChild(paragraph);
            } else {
                let editContainer = document.createElement("div") // erstellt restliche Attribute mit Textfeld

                let editField = document.createElement("input");
                editField.classList.add("editField", "remove");
                editField.id = attribute[i] + "EditField"
                // nimmt die Werte der Felder direkt aus der JSON Datenbank, damit die Nachweise richtig formatiert sind
                fetch(`/data/${result["ID"]}`) 
                    .then((response) => response.json())
                    .then((data => editField.value = data[attribute[i]]))

                let editLabel = document.createElement("label")
                editLabel.for = "editField"
                editLabel.classList.add("remove")
                editLabel.innerHTML = attribute[i] + ": "
                
                modalTextContainer.appendChild(editContainer);
                editContainer.appendChild(editLabel);
                editContainer.appendChild(editField);   
            }  
            // changes the size of the text box according to its content
            /* let temp = document.getElementById(attribute[i] + "EditField")
            console.log(temp.value) */ 
        }
        let newLine = document.createElement("br")
        newLine.classList.add("remove")
        modalTextContainer.appendChild(newLine)

        // Save Button to trigger the editSave function
        let saveButton = document.createElement("button")
        saveButton.textContent = "Speichern"
        saveButton.addEventListener("click", () => editSave(attribute, result[attribute[0]]))
        saveButton.classList.add("remove", "popup")
        modalTextContainer.appendChild(saveButton)

        // Popup to confirm save
        let popup = document.createElement("span");
        popup.classList.add("popuptext")
        popup.id = "myPopup"
        popup.innerHTML = "Änderungen gespeichert!"
        saveButton.appendChild(popup)
    }
    // makes modal visible
    modal.style.display = "block";                      
}

function editSave(attribute, ID){
    // Function, to save edits made by the user in edit mode. The changed object is sent to the server and the working data

    var newObject = {ID: ID}
    for (let i = 1; i < attribute.length; i++){   // i = 1 um ID zu überspringen (nicht editierbar)
        let wert = document.getElementById(attribute[i] + "EditField")
        if (attribute[i] == "Nachweis") { // bei Nachweis wird der String zuerst in ein Array gesplittet
            newObject[attribute[i]] = wert.value.split(",")
        } else {
            newObject[attribute[i]] = wert.value // String im Textfield wird übernommen
        }
    }

    fetch(`/data/${ID}`, { // senden der geänderten Daten an den Server
        method: "put",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newObject)
    })
    // Feedback, if changes where successfully sent to the server. Popup triggers accordingly
        .then(res => {
            let popup = document.getElementById("myPopup");
            if (res.ok == true){popup.innerHTML = "Änderungen gespeichert"}
            else {popup.innerHTML = "ERROR! Änderungen nicht gespeichert"}
            popup.classList.toggle("show")
        })
    var index = data.findIndex(i => i.ID == newObject.ID);
    data[index] = newObject  // aktualisieren der Daten im client (changes sent to working data)
    masterFunc(neueSuche(), data, suchfelder) // aktualisieren der Ergebnisse
}

function nextPicModal(richtung, result){
    let img_folder = "https://res.cloudinary.com/dppoc515v/image/upload/v1762814197"

    let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    let letters = alphabet.slice(0, alphabet.indexOf(result["ID"].slice(-1))+1)
    
    let img = document.getElementById("modalIMG")
    let imgLink = document.getElementById("imgLink")
    let index = letters.indexOf(img.src.slice(-5)[0])  // index in letters of the letter that is the active modal image

    if (richtung == "Rechts") {
        index += 1
        if (index == letters.length) {index = 0}
    }
    if (richtung == "Links") {
        index -= 1
        if (index < 0) {index = letters.length-1}
    }
    
    let name = result["ID"].substring(0, result["ID"].length - 3)
    modalIMG.src = `${img_folder}/P_${name}${letters[index]}.JPG`;
    imgLink.href = `/${img_folder}/P_${name}${letters[index]}.JPG`;
    console.log(img.src)
}

function checkCheckboxes(attribute){
    let on = []
    for (let i = 0; i < attribute.length; i++){
        if (document.getElementById(`cb${attribute[i]}`).checked){
            on.push(attribute[i])
        }
    }
    return on
}

function sortResults (results) {
    let sortierFeld = document.getElementById("sortierDropdown").value;
    let reverse = document.getElementById("reverseSort").checked;

    if (sortierFeld == "ID") {
        results.sort((a, b) => parseInt(a[sortierFeld]) - parseInt(b[sortierFeld]));
        if (reverse) {results.reverse()}
        return results
    } else {
        results.sort((a, b) => a[sortierFeld].localeCompare(b[sortierFeld])); // alphabetisch sortieren
        if (reverse) {results.reverse()}
        return results
    }
}

function masterFunc(suchbegriff, daten, attribute){
    removeAllElements()
    let suchfelder = checkCheckboxes(attribute); // kontrolliert, in welchen Feldern gesucht werden soll
    let results = getResults(suchbegriff, daten, suchfelder); // holt die Ergebnisse anhand des Suchbegriffs
    results = sortResults(results) // sorts results
    console.log(results)

    let text = document.createElement("text"); // Either "Ergebnisse" or "Keine Ergenisse"

    if (results.length == 0) { // Keine Ergebnisse
        text.innerHTML = "Keine Ergebnisse";
        text.setAttribute("id", "keineErgebnisse");
        document.getElementById("display").appendChild(text);

    } else { // Ergebnisse
        // Displays the number of results next to the searchbar
        if (results.length > 1) {text.innerHTML = `${results.length} Ergebnisse`}
        else {text.innerHTML = `${results.length} Ergebnis`};
        text.setAttribute("id", "ergebnisse"); // id necessary to find and remove element; no css attached
        document.getElementById("suchleiste").appendChild(text);

        // Shows all the pictures to the search results
        for (let i = 0; i < results.length; i++){
            neuesBild(results[i])
        }
    }
}

function changeCheckboxValue(attribute, checked){
    for (let i = 0; i < attribute.length; i++){
        document.getElementById(`cb${attribute[i]}`).checked = checked
    }
}

// Alle möglichen Attribute und checkboxIDs mit "cb" vorangestellt ("cbID", usw.)
const attributePreview = ["ID", "Ort - Institution - Firma", "Titel", "Jahr", "Künstler", "Druckerei", "Kategorie"] 
const suchfelder = [
    "ID", "Ort - Institution - Firma", "Titel", "Jahr", "Künstler", "Druckerei", "Kategorie", "Notae"] 
const attributeAlle = [
    "ID", "Ort - Institution - Firma", "Titel", "Jahr", "Künstler", "Druckerei", "Kategorie", "Nachweis", "Notae"]

// Suchevents
const losKnopf = document.getElementById("losKnopf") 
const searchbox = document.getElementById("suchfeld")
losKnopf.addEventListener("click", () => masterFunc(neueSuche(), data, suchfelder))
searchbox.addEventListener("search", () => masterFunc(neueSuche(), data, suchfelder))

/* Suche wird geupdated, wenn sich Sortierparameter ändern. 
Eigentlich müsste man da nicht die komplette Suche erneut durchführen (masterFunc ohne getResults) */
const sortierDropdown = document.getElementById("sortierDropdown")
const reversveSort = document.getElementById("reverseSort")
sortierDropdown.addEventListener("change", () => masterFunc(neueSuche(), data, suchfelder))
reversveSort.addEventListener("change", () => masterFunc(neueSuche(), data, suchfelder))

// Checkbox-Events für Feldersuche
const masterCheckbox = document.getElementById("cbAlle")
masterCheckbox.addEventListener("change", () => changeCheckboxValue(suchfelder, masterCheckbox.checked))

// Modal-Funktionen
var modal = document.getElementById("modal"); // Get the modal
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
span.onclick = () => modal.style.display = "none"; // When the user clicks on <span> (x), close the modal
window.onclick = (event) => {if (event.target == modal) {modal.style.display = "none";}} // When the user clicks anywhere outside of the modal, close it

// Define the search
// gets the query parameter id
var urlParams = new URLSearchParams(window.location.search);
var myParam = urlParams.get('id')

// creates an array with all artists
var allArtists = new Set()
for (let i = 0; i < data.length; i++) {
    var artist = data[i]["Künstler"]
    if (artist != "") {allArtists.add(artist)}
}
allArtists = Array.from(allArtists)

// sets the first search as the query parameter or an random artist if no query parameter is definded
var num = Math.floor(Math.random() * allArtists.length)
if (myParam != null){
    searchbox.value = myParam
    changeCheckboxValue(suchfelder, false)
    document.getElementById("cbID").checked = true
    document.getElementById("cbExakt").checked = true
/* } else {searchbox.value = allArtists[num]} */
} else {searchbox.value = ""}

masterFunc(neueSuche(), data, suchfelder)

