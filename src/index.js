
const BASE_URL = "http://localhost:3000/pups";


const fetchPups = () => {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(pups => {
            renderPups(pups);
        })
        .catch(error => console.error("Error fetching pups:", error));
};


const renderPups = (pups) => {
    const dogBar = document.getElementById("dog-bar");
    dogBar.innerHTML = "";

    pups.forEach(pup => {
        const span = document.createElement("span");
        span.textContent = pup.name;
        span.addEventListener("click", () => showPupInfo(pup));
        dogBar.appendChild(span);
    });
};


const showPupInfo = (pup) => {
    const dogInfo = document.getElementById("dog-info");
    dogInfo.innerHTML = `
        <img src="${pup.image}" alt="${pup.name}">
        <h2>${pup.name}</h2>
        <button id="good-dog-btn">${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;

    const goodDogBtn = document.getElementById("good-dog-btn");
    goodDogBtn.addEventListener("click", () => toggleGoodDog(pup, goodDogBtn));
};


const toggleGoodDog = (pup, button) => {
    const updatedStatus = !pup.isGoodDog;

    fetch(`${BASE_URL}/${pup.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isGoodDog: updatedStatus })
    })
    .then(response => response.json())
    .then(updatedPup => {
        button.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!";
        pup.isGoodDog = updatedPup.isGoodDog;
    })
    .catch(error => console.error("Error updating pup:", error));
};

// Filter good dogs
let filterGoodDogs = false;
document.getElementById("good-dog-filter").addEventListener("click", (event) => {
    filterGoodDogs = !filterGoodDogs;
    event.target.textContent = `Filter good dogs: ${filterGoodDogs ? "ON" : "OFF"}`;

    fetch(BASE_URL)
        .then(response => response.json())
        .then(pups => {
            const filteredPups = filterGoodDogs ? pups.filter(pup => pup.isGoodDog) : pups;
            renderPups(filteredPups);
        })
        .catch(error => console.error("Error filtering pups:", error));
});

document.addEventListener("DOMContentLoaded", fetchPups);
