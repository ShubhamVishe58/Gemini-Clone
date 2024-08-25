const sideNavigation = document.querySelector(".sideNavigation");
const sideBarToggle = document.querySelector(".fa-bars");
const startContentUl = document.querySelector(".startContent ul");
const inputArea = document.querySelector(".inputArea input");
const sendRequest = document .querySelector(".fa-paper-plane");
const chatHistory = document.querySelector(".chatHistory ul");
const startContent = document.querySelector(".startContent")
const chatContent = document.querySelector(".chatContent");
const results = document.querySelector(".results");


promptQuestions = [
    {
        question: "Write a thank you note to my subscribers",
        icon: "fa-solid fa-wand-magic-sparkles",
    },
    {
        question: "Write a Sample code to learn javaScript",
        icon: "fa-solid fa-code",
    },
    {
        question: "How to beacome a full-stack developer",
        icon: "fa-solid fa-laptop-code",
    },
    {
        question: "How to become a front-end Developer",
        icon: "fa-solid fa-database",
    },
];

window.addEventListener("load", () =>{
    promptQuestions.forEach((data) => {
        let item = document.createElement("li");
        item.addEventListener("click", ()=>{
            getGeminiResponse(data.question, true);
        })
        item.innerHTML = `<div class ="promptSuggestion">
        <p>${data.question}</p>
        <div class="icon">
        <i class="${data.icon}"></i>
        </div>
        </div>`;
        startContentUl.append(item);
    });
});


sideBarToggle.addEventListener("click", () =>{
    sideNavigation.classList.toggle("expandClose");
});

inputArea.addEventListener("keyup", (e)=>{
    if(e.target.value.length > 0){
        sendRequest.style.display ="inline"; 
    }else{
        sendRequest.style.display = "none";
    }
});

sendRequest.addEventListener("click", ()=>{
    getGeminiResponse(inputArea.value, true);
});

function getGeminiResponse(question, appendHistory){
    console.log(question);
if(appendHistory){
    let historyLi = document.createElement("li");
    historyLi.addEventListener("click", ()=>{
        getGeminiResponse(question, false)
    })
    historyLi.innerHTML = `<i class ="fa-regular fa-message"></i>${question}`;
    chatHistory.append(historyLi);
}
    results.innerHTML="";
    inputArea.value="";

    startContent.style.display="none";
    chatContent.style.display="block";

let resultTitle =`<div class="resultTitle>
<img src="" />
<p>${question}</p>
</div>`;

let resultData = `<div class="resultData" id="ress">
<img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"/>
<div class="loader">
<div class="animatedBG"></div>
<div class="animatedBG"></div>
<div class="animatedBG"></div>
</div>
</div>`;

    results.innerHTML += resultTitle;
    results.innerHTML += resultData;

    const AIURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCdv_sr4t546zjrt1vnAYnU4GOZGSonaRI`
    fetch(AIURL, {
        method: "POST",
        body: JSON.stringify({
            contents: [{parts: [{text: question}] }],
        })
    }).then((response)=>response.json())
        .then((data)=>{
        // document.getElementById("ress").remove;
        
        let responseData =jsonEscape(data.candidates[0].content.parts[0].text) 
        let responseArray = responseData.split("**");
        let newResponse="";

        for(let i = 0; i < responseArray.length; i++){
            if(i==0 || i %2 !== 1){
                newResponse+=responseArray[i];
            }else{
                newResponse+="<strong>"+responseArray[i].split(" ").join("&nbsp")+"</strong>";
            }
        }

        let newResponse2 = newResponse.split("*").join(" ");

        let textArea = document.createElement("textarea");
        textArea.innerHTML = newResponse2;


        results.innerHTML = `
        <div class="resultResponse">
        <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"/>
        <p id="typeEffect"></p>
        </div>`;

        let newResponseData = newResponse2.split(" ");
        for(let j = 0; j < newResponseData.length; j++){
            timeOut(j, newResponseData[j]+" ");
        }
    });
}

const timeOut = (index, nextWord)=>{
    setTimeout(function(){
        document.getElementById("typeEffect").innerHTML += nextWord;
    }, 75*index);
}

function newChat(){
    startContent.style.display = "block";
    chatContent.style.display= "none";
}

function jsonEscape(str){
    return str.replace(new RegExp("\r?\n\n","g"),"<br>")
    .replace(new RegExp("\r?\n","g"),"<br>");
}