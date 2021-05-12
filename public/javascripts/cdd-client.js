
window.onload = async function() {
    // TODO - make init for unauth user
    //console.log("onload test");
}

let regUser;
let logUser;
let currentWord;


async function registerUser(name, email, password) {
    const user = {};

    user.user_name = name;
    user.user_email = email;
    user.user_pass = password;

    let response;

    console.log("registerUser");
    response = await clientRequest("/user/register", "POST", user);
    console.log(response);
    if (response.message) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = response.message;
        document.getElementById('auth-reg').style.display = "none";
    } else {
        document.getElementById('auth-reg').style.display = "block";
        document.getElementById('auth-reg').innerText = "New user registered";
        document.getElementById('warning').style.display = "none";
        if (response.regUser) {
            regUser = response.regUser;
        }
        window.location.replace("/");

    }

    document.getElementById('username_field').value = "";
    document.getElementById('password_field').value = "";
    document.getElementById('email_field').value = "";
}

async function loginUser(name, password) {
    const user = {};

    user.user_name = name;
    user.user_pass = password;

    let response;

    console.log("loginUser");
    response = await clientRequest("/user/login", "POST", user);
    console.log(response);
    if (response.message) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = response.message;
        document.getElementById('auth-reg').style.display = "none";
    } else {
        document.getElementById('auth-reg').style.display = "block";
        document.getElementById('auth-reg').innerText = "User logged in";
        document.getElementById('warning').style.display = "none";
        if (response.logUser) {
            logUser = response.logUser;
            localStorage.setItem('user_id', logUser.user_id);
        }

        window.location.replace("index.html");
    }

    document.getElementById('username_field').value = "";
    document.getElementById('password_field').value = "";
}

 async function logoutUser() {

    localStorage.removeItem('user_id');
    document.location.reload();
 }

async function addWord(name, desc, date) {
    const word = {};

    word.word = name;
    word.desc = desc;
    word.user_id = localStorage.getItem('user_id');
    word.date = date;

    let response;

    console.log("addWord");
    response = await clientRequest("/word/add", "POST", word);
    console.log(response);
    if (response.message) {
        document.getElementById('warning').style.display = "block";
        document.getElementById('warning').innerText = response.message;
        document.getElementById('auth-reg').style.display = "none";
    } else {
        document.getElementById('auth-reg').style.display = "block";
        document.getElementById('auth-reg').innerText = "New word successfully created";
        document.getElementById('warning').style.display = "none";
        if (response.newWord) {
            currentWord = response.newWord;
        }
        window.location.replace("index.html");
    }
}

// TODO update/delete word
async function updateWord(word_id, newDesc) {
    const word = {};

    word.word_id = word_id;
    word.desc = newDesc;

    let response;

    console.log("updateWord");
    response = await clientRequest("/word/update", "POST", word);
    console.log(response);
    if (response.message) {
        document.getElementById('msg').innerText = response.message;
    } else {
        document.getElementById('msg').innerText = 'Word updated';
        if (response.word) {
            currentWord = response.word;
        }
    }
}


async function voteWord(word_id, isUp) {
    let user_id = localStorage.getItem('user_id');
    if (user_id) {
        const vote = {};

        vote.word_id = word_id;
        vote.user_id = user_id;
        vote.isUp = isUp;

        let response;

        console.log("voteWord");
        response = await clientRequest("/word/vote", "POST", vote);
        console.log(response);
        if (response.message) {
            alert(response.message);
            //document.getElementById('msg').innerText = response.message;
        } else {

            if (isUp) {
                document.getElementById(`vote-up-count-${word_id}`).innerText =
                    String(Number(document.getElementById(`vote-up-count-${word_id}`).innerText) + 1);
                document.getElementById(`vote-up-${word_id}`).classList.add('active-vote-up');

                if (document.getElementById(`vote-down-${word_id}`).classList.contains('active-vote-down')) {
                    document.getElementById(`vote-down-${word_id}`).classList.remove('active-vote-down');
                    document.getElementById(`vote-down-count-${word_id}`).innerText =
                        String(Number(document.getElementById(`vote-down-count-${word_id}`).innerText) - 1);
                }
            } else {
                document.getElementById(`vote-down-count-${word_id}`).innerText =
                    String(Number(document.getElementById(`vote-down-count-${word_id}`).innerText) + 1);
                document.getElementById(`vote-down-${word_id}`).classList.add('active-vote-down');

                if (document.getElementById(`vote-up-${word_id}`).classList.contains('active-vote-up')) {
                    document.getElementById(`vote-up-${word_id}`).classList.remove('active-vote-up');
                    document.getElementById(`vote-up-count-${word_id}`).innerText =
                        String(Number(document.getElementById(`vote-up-count-${word_id}`).innerText) - 1);
                }
            }
        }
    } else {
        alert("To vote you must be logged in");
    }
}

async function getVotesByUser() {

    const vote = {};
    vote.user_id = localStorage.getItem('user_id');

    let votes = await clientRequest("/vote/getVotesByUser", "POST", vote);
    votes = votes.votes;


    for (let vote of votes)
        switch (vote.vote_value) {
            case 1:
                document.getElementById(`vote-up-${vote.word_id}`).classList.add('active-vote-up');
                break;
            case -1:
                document.getElementById(`vote-down-${vote.word_id}`).classList.add('active-vote-down');
                break;
        }
}

//TODO comment
async function commentWord(word_id, text, user_id) {
    const comment = {};

    comment.word_id = word_id;
    comment.user_id = user_id;
    comment.text = text;

    let response;

    console.log("commentWord");
    response = await clientRequest("/word/comment", "POST", comment);
    console.log(response);
    if (response.message) {
        document.getElementById('msg').innerText = response.message;
    } else {
        document.getElementById('msg').innerText = 'Word commented successfully';
    }
}

function filterUserByUserId(users, userId) {
    let user = users.filter(user => user.user_id === userId);
    return user[0].user_name;
}


async function wordsList(containerSelector, isOK = true) {

    let resultsContainer = document.querySelector(containerSelector);
    resultsContainer.innerHTML = '';

    if (isOK) {
        let users = await clientRequest("/user/users", "POST");
        users = users.users;

        const word = {};

        response = await clientRequest("/word/list", "POST", word)
            .then(res => res.words)
            .then(res => res.sort((a, b) => new Date(b.create_date) - new Date(a.create_date)))
            .then(res => res.map(item => wordTemplate(item.word_id, item.word, item.word_desc, filterUserByUserId(users, item.user_id),
                item.create_date, item.vote_up, item.vote_down)).join(''))
            .then(res => resultsContainer.innerHTML = res);

        await getVotesByUser();
    }
}


async function wordsListSortByRating(containerSelector) {

    let resultsContainer = document.querySelector(containerSelector);
    resultsContainer.innerHTML = '';

    let users = await clientRequest("/user/users", "POST");
    users = users.users;

    const word = {};

    response = await clientRequest("/word/list", "POST", word)
        .then(res => res.words)
        .then(res => res.sort((a, b) => (b.vote_up - b.vote_down) - (a.vote_up - a.vote_down)))
        .then(res => res.map(item => wordTemplate(item.word_id, item.word, item.word_desc, filterUserByUserId(users, item.user_id),
            item.create_date, item.vote_up, item.vote_down)).join(''))
        .then(res => resultsContainer.innerHTML = res);

    await getVotesByUser();
}


async function myWordsList(containerSelector) {

    let resultsContainer = document.querySelector(containerSelector);
    resultsContainer.innerHTML = '';

    let users = await clientRequest("/user/users", "POST");
    users = users.users;

    const word = {};
    word.user_id = localStorage.getItem('user_id');

    response = await clientRequest("/word/listByUser", "POST", word)
        .then(res => res.words)
        .then(res => res.map(item => wordTemplate(item.word_id, item.word, item.word_desc, filterUserByUserId(users, item.user_id),
            item.create_date, item.vote_up, item.vote_down)).join(''))
        .then(res => resultsContainer.innerHTML = res);

    await getVotesByUser();
}


function getDayWord(words){
    words = words.words;
    words.sort((a, b) => (b.vote_up - b.vote_down) - (a.vote_up - a.vote_down));
    const dayWord = words[0];
    return dayWord;
}

async function dayWord(containerSelector) {

    let dayWordContainer = document.querySelector(containerSelector);
    dayWordContainer.innerHTML = '';

    let users = await clientRequest("/user/users", "POST");
    users = users.users;


    let words = await clientRequest("/word/list", "POST");
    let word = getDayWord(words);
    dayWordContainer.innerHTML = dayWordTemplate(word.word_id, word.word, word.word_desc, filterUserByUserId(users, word.user_id),
                word.create_date, word.vote_up, word.vote_down);
    document.getElementsByClassName('words-container').style.display = "none";

    await getVotesByUser();
}

async function clientRequest(url, method, data = null) {
    try {
        let headers = {};
        headers['Authorization'] = get_cookie("token");

        let body;
        if (data) {
            headers['Content-type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        });

        return await response.json();
    } catch (ex) {
        console.warn(ex.message);
    }
}

function get_cookie (cookie_name) {
    let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

    if (results)
        return unescape(results[2]);
    else
        return null;
}

const wordTemplate = (word_id, word, definition, user, date, vote_up, vote_down) => `
<div class="word-template not-day-word">
<div class="word-header">
    <div class="word">${word}</div>
    <div class="clearfix">
        <div class="day-word">
            <a>word of the day</a>
            <i class="fas fa-crown"></i>
        </div>
    </div>
</div>
<div class="definition">${definition}</div>
<div class="user-date">by <span class="user">${user}</span>, ${date}</div>
<div class="word-footer">
    <div class="vote">
        <a class="vote-up" id="vote-up-${word_id}" onClick="voteWord(${word_id}, true)">
            <i class="fas fa-thumbs-up"></i>
            <span id="vote-up-count-${word_id}">${vote_up}</span>
        </a>
        <a class="vote-down" id="vote-down-${word_id}" onClick="voteWord(${word_id}, false)">
            <i class="fas fa-thumbs-down"></i>
            <span id="vote-down-count-${word_id}">${vote_down}</span>
        </a>
    </div>
</div>
</div>
`;

const dayWordTemplate = (word_id, word, definition, user, date, vote_up, vote_down) => `
<div class="word-template">
<div class="word-header">
    <div class="word">${word}</div>
    <div class="clearfix">
        <div class="day-word" style="display: block">
            <a>word of the day</a>
            <i class="fas fa-crown"></i>
        </div>
    </div>
</div>
<div class="definition">${definition}</div>
<div class="user-date">by <span class="user">${user}</span>, ${date}</div>
<div class="word-footer">
    <div class="vote">
        <a class="vote-up" id="vote-up-${word_id}" onClick="voteWord(${word_id}, true)">
            <i class="fas fa-thumbs-up"></i>
            <span id="vote-up-count-${word_id}">${vote_up}</span>
        </a>
        <a class="vote-down" id="vote-down-${word_id}" onClick="voteWord(${word_id}, false)">
            <i class="fas fa-thumbs-down"></i>
            <span id="vote-down-count-${word_id}">${vote_down}</span>
        </a>
    </div>
</div>
</div>
`;