let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let notFound = document.querySelector(".not_found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

let apiKey = "cbefad44-6dc1-42dd-b141-a14f180ed74f";

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // clear data
  audioBox.innerHTML = "";
  notFound.innerText = "";
  defBox.innerText = "";

  //get input data

  let word = input.value;

  // call api get data\

  if (word === "") {
    alert("word is required");
    return;
  }

  getData(word);
});

async function getData(word) {
  loading.style.display = "block";
  //ajax call

  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );
  const Data = await response.json();

  //    console.log(Data);
  // if empty result
  if (!Data.length) {
    loading.style.display = "none";
    notFound.innerHTML = "no result found";
    return;
  }

  // if result is suggestion

  if (typeof Data[0] === "string") {
    loading.style.display = "none";

    let heading = document.createElement("h3");
    heading.innerText = "Did you mean ? ";
    notFound.appendChild(heading);

    Data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      notFound.appendChild(suggestion);
    });
    return;
  }

  // result fouund
  loading.style.display = "none";

  let defination = Data[0].shortdef[0];
  defBox.innerText = defination;

  //sound

  const soundName = Data[0].hwi.prs[0].sound.audio;

  if (soundName) {
    renderSound(soundName);
  }

  console.log(Data);
}

function renderSound(soundName) {
  // https://media.merriam-webster.com/soundc11

  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;

  audioBox.appendChild(aud);
}