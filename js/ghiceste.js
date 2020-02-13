let content_div;
let countdown_interval; //intervalul de numarare inversa
let curr_countdown_val;
let current_quizz; //intrebarea curenta
let correct_answers; //numarul de intrebari raspunde corect
let last_answer; //ultimul raspuns dat
let correct_answer_index // indexul raspunsului corect 
const nr_quizzuri = 5; //numarul intrebarilor
const wait_time = 1000; //timer tick
const nr_answers = 3; //numarul raspunsurilor
const nr_caini = 10; //numarul de poze cu caini
let caini = Array(nr_caini);

const nume_caini = [
    "Airdale Terrier",
    "Basset Griffon Vendeen",
    "Basset Hound",
    "Beauceron",
    "Beagle",
    "Bichon De Havana",
    "Basenji",
    "Akita japonez",
    "Bedlington Terrier",
    "Bergamasco"
];

window.addEventListener('load', function() {
    
    let start_button = document.getElementById("start-button");
    document.body.onkeydown = function(event){
        if(event.key == "Enter")
        {
            StartCountDown();
        }
    }
    start_button.addEventListener("click", StartCountDown); //numaratoarea inversa
    content_div = document.getElementById("content");
    content_div.addEventListener("click", ChangeGameBackground, true); //schimba background joc

    let game_div = document.getElementById("game");
    game_div.classList.add("hidden"); //ascunde jocul

    MoveContent();
    PushLog("Window loaded");

    for(let i = 0; i < nr_caini; i++) 
    {
        caini[i] = Object();
        caini[i].used = 0; //cainele nu a fost folosit inca
        caini[i].img = "img" + (i+1) + ".jpg"; //imaginea asociata cainelui
        caini[i].name = nume_caini[i];
        caini[i].index = i;
    }
})

function MoveContent()
{
    let nav = document.getElementById("navigatie");
    let style = window.getComputedStyle(nav);
    //console.log(style.height);
    //console.log(content_div.style.marginTop);
    content_div.style.marginTop = parseInt(style.height) + + "px";
    console.log(content_div.style.marginTop);
}

function ModifyLabelTextNode(element, text)
{
    //Trebuie modificat textNode-ul de dupa input.
    let childNodes = element.childNodes;
    console.log(element.childNodes);
    console.log(element.children);
    //console.log(childNodes);
    for(let i = 0; i < childNodes.length; i++)
    {
        if(childNodes[i].nodeName=="INPUT")
        {
            childNodes[i+1].nodeValue = text;
            return;
        }
    }
}

function NewQuizz()
{
    //Generare quizz
    let new_quizz = GenerateRandomQuizz(); //generare solutii + imagine random
    let caine_random = new_quizz.caine; //cainele random
    caini[caine_random.index].used = 1; //caine setat ca folosit

    let img = document.getElementById("quizz-img"); //imaginea cu cainele
    let labels = document.getElementsByName("solutie"); //optiunile
    let radios = document.getElementsByName("radio-button"); 

    img.src = "caini/" + caine_random.img;
    //console.log(new_quizz.answer);
    for(let i = 0; i < labels.length; i++)
    {
        //labels[i].textContent = new_quizz.answer[i]; //updateaza solutiile cu cele generate
        ModifyLabelTextNode(labels[i], new_quizz.answer[i]); //updateaza solutia cu cea generata
        radios[i].checked = false; //debifeaza toate optiunile
    }

    current_quizz += 1; //creste etapa
    let progress_text = document.getElementById("progress");
    let etapa = current_quizz;
    //console.log(etapa);
    let etape = nr_quizzuri;
    String.toString(etapa);
    String.toString(etape);
    //console.log(etapa);
    progress_text.innerHTML = "Etapa: " + etapa + "/" + etape + "<br> Raspunsuri corecte: " + correct_answers; //updatare progress
}

function SubmitPressed()
{
    PushLog("Submit pressed");
    let alertmsg = document.getElementById("alert-msg");
    let radios = document.getElementsByName("radio-button");
    let optiune = -1;
    let i = 0;
    //console.log(radios);
    for(radio of radios)
    {
        //console.log(radio);
        if(radio.checked == true)
        {
            //console.log(i);
            optiune = i;
        }
        i++;
    }

    console.log("optiune: " + optiune);

    if(optiune == -1){
        alertmsg.style.color = "red";
        alertmsg.style.fontSize = "1.5em";
        alertmsg.innerHTML = "Selecteaza o varianta inainte de a trimite raspunsul!";
        alertmsg.style.display = "block";
        let interval = setTimeout(function(){
            alertmsg.style.display = "none"; //stergere eroare;
        }, 2000)
        return 1;
    }

    //Verificare raspuns dat!
    if(optiune == correct_answer_index)
    {
        correct_answers += 1; //numarul de raspunsuri corecte creste.
    }

    //Afisare quizz nou
    if(current_quizz < nr_quizzuri) //Nu s-a terminat jocul
        NewQuizz();
    else {
        EndGame();
    }
}

function EndGame(){

    //Afisare rezultat + best-uri;
    let end_div = document.getElementById("endgame");
    end_div.style.display = "block";
    //console.log(end_div);
    let parent = end_div.parentElement;
    parent.style.backgroundColor = "inherit"; //resetare fundal
    let parentChilds = parent.children;
    for(let i = 0; i < parentChilds.length; i++)
    {
        if(parentChilds[i].id == "game")
        {
            //parentChilds[i].style.display = "none"; //ascunde jocul
            parentChilds[i].classList.add("hidden");
            //parentChilds[i].classList.toggle("hidden");
        }
        if(parentChilds[i].nodeName == "HEADER")
        {
            let h1 = parentChilds[i].getElementsByTagName("H1")[0];
            h1.innerHTML = "Nu s-a putut prelua mesaj de la server!";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    h1.innerHTML = xhttp.responseText;
                    console.log(xhttp.responseText);
                }
            };
            xhttp.open("GET", "http://localhost:8080/?scor="+ correct_answers, true);
            xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
            xhttp.send();
        }
    }

    //Actualizare tabel cu scoruri
    ShowScoreTable();

    //Activare ultima optiune din meniu
    document.getElementsByClassName("menu-option")[3].removeEventListener("click", DisableGameMenuOption);
}

function ShowScoreTable()
{
    let scoreObj;
    if(localStorage.getItem("score"))
    {
        scoreObj = JSON.parse(localStorage.getItem("score"));
    }
    else 
    {
        scoreObj = new Array();
    }

    //Update
    let aux = {
        'date' : 'none',
        'score' : correct_answers
    };
    let d = new Date;
    console.log(Date.now());
    aux.date = d.getDate() + "." + d.getMonth() + "." + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes();

    scoreObj.push(aux);
    console.log("scoreObj");
    console.log(scoreObj);

    //Update
    localStorage.setItem("score", JSON.stringify(scoreObj));

    //Afisare tabel
    scoreObj.sort(function(a, b) {
        if(a.score > b.score) return -1;
        else return 1;
    });
    console.log(scoreObj);
    PopulateTable(scoreObj);

}

function PopulateTable(scoreObj)
{
    let table = document.getElementById("tabel");
    let i = scoreObj.length;
    for(let i = 0; i < scoreObj.length; i++)
    {
        var tr_node = document.createElement("TR");
            //noduri TH
            var th_node1 = document.createElement("TH");
                //noduri TH-TEXT
                var th_node1_text = document.createTextNode(scoreObj[i].date);
                th_node1.appendChild(th_node1_text);

            var th_node2 = document.createElement("TH");
                var th_node2_text = document.createTextNode(scoreObj[i].score);
                th_node2.appendChild(th_node2_text);
        
        tr_node.appendChild(th_node1);
        tr_node.appendChild(th_node2);
        table.appendChild(tr_node);
    }
    PushLog("Sunt " + i + " scoruri");
}

function GenerateRandomQuizz()
{
    let response = Object();
    let caini_disponibili = Array();
    let i = 0;
    for(caine of caini)
    {
        if(caine.used == 0)
        {
            caini_disponibili.push(caine);
        }
        i++;
    }

    let rand = Math.floor(Math.random() * caini_disponibili.length); //generare index_caine random
    let caine_random = caini_disponibili[rand];
    console.log(caine_random);
    response.caine = caine_random;

    //Generare solutii
    response.answer = Array(nr_answers);

    let raspunsuri_valabile = nume_caini.slice();
    raspunsuri_valabile.splice(caine_random.index, 1); //stergere raspuns corect din multimea de raspunsuri random
    for(let i = 0; i < nr_answers-1; i++) //generare nr_raspunsuri - 1 solutii random
    { 
        rand = Math.floor(Math.random() * raspunsuri_valabile.length); //generare index_nume_caine random
        console.log("rand_sol: " + rand);
        console.log(raspunsuri_valabile);
        response.answer[i] = raspunsuri_valabile[rand];
        raspunsuri_valabile.splice(rand, 1); //stergere optiune deja folosita
        console.log(raspunsuri_valabile);
    }
    response.answer[nr_answers-1] = caine_random.name; //un raspuns va fi sigur numele corect al cainelui
    correct_answer_index = nr_answers-1; //raspunsul corect

    return response;
}

function DisableGameMenuOption(event)
{
    event.preventDefault();
}

function StartGame()
{
    //Nu se mai poate da click pe ultima optiune din meniu
    document.getElementsByClassName("menu-option")[3].addEventListener("click", DisableGameMenuOption);

    document.getElementById("countdown").style.display = "none"; //ascunde numaratoarea inversa
    //document.getElementById("game").style.display = "block"; //afiseaza jocul
    document.getElementById("game").classList.remove("hidden"); //afiseaza jocul

    let control_buttons = document.getElementsByName("control_button");
    let submit_button = document.getElementsByName("submit-button")[0];
    submit_button.addEventListener("click", SubmitPressed);

    current_quizz = 0; //intrebarea curenta . NewQuizz va creste etapa cu 1
    correct_answers = 0; //raspunsuri corecte

    //Generare prima etapa
    NewQuizz();
    
    //content_div.removeEventListener("click", ChangeGameBackground);
    //content_div.addEventListener("click", ChangeGameBackground, true); //evenimentul se propaga de la parinte spre copii
}

function StartCountDown(event)
{
    PushLog("Start button pressed. Started countdown.");

    //event.stopPropagation(); //Previne schimbara background-ului
    document.getElementById("game-start-div").style.display = "none"; //ascunde mesajul de intampinare
    document.getElementById("countdown").style.display = "block"; //afiseaza numaratoarea inversa
    content_div.removeEventListener("click", ChangeGameBackground); //opreste optiunea de schimbare a backgroundului

    let countdownText = document.getElementById("countdown-text");
    curr_countdown_val = 3;
    countdown_interval = setInterval(CountDown, wait_time, countdownText);
    //let curr_countdown_val = 3;
    //PushLog("Numaratoarea a avut: " + curr_countdown_val + "secunde");
}

function CountDown(countdownText)
{
    console.log("VAL: ", curr_countdown_val);
    if(curr_countdown_val == 1){
        clearInterval(countdown_interval);
        StartGame();
    }
    else {
        curr_countdown_val -= 1;
        let str = curr_countdown_val;
        String.toString(str);
        countdownText.innerHTML = str;
        console.log(curr_countdown_val);
    }
}

function PushLog(text)
{
    let div = document.getElementById("log");
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(div.children.length + 1 + ". " + text));
    div.prepend(p);
}

function ChangeGameBackground(event){

    PushLog("Background clicked. Changed background");

    //event.stopPropagation();
    let c1 = Math.floor(Math.random() * 256);
    let c2 = Math.floor(Math.random() * 256);
    let c3 = Math.floor(Math.random() * 256);
    content_div.style.backgroundColor = "rgb(" + c1 + ", " + c2 + ", " + c3 + ")";
    
}

