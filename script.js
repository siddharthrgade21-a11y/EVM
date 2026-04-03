
// 🧠 DATA STORAGE
let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
let votes = JSON.parse(localStorage.getItem("votes")) || {};
let voters = JSON.parse(localStorage.getItem("voters")) || [];
let isVotingLocked = false;

const ADMIN_PASS = "1234";

// 🔐 AUTO LOGIN
window.onload = function () {
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("app").classList.remove("hidden");
    }
    render();
};

// 🔐 LOGIN
function login() {
    let pass = document.getElementById("adminPass").value;

    if (pass === ADMIN_PASS) {
        localStorage.setItem("isLoggedIn", "true");

        document.getElementById("loginBox").remove(); // 🔥 full remove
        document.getElementById("app").classList.remove("hidden");

        showToast("Login Successful 🚀");
    } else {
        showToast("Wrong Password ❌");
    }
}

// 🔓 LOGOUT
function logout() {
    localStorage.removeItem("isLoggedIn");
    location.reload();
}

// 🔄 SWITCH TABS
function switchTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(tab).classList.add("active");
}

// ➕ ADD CANDIDATE
function addCandidate() {
    let name = document.getElementById("candidateName").value.trim();

    if (!name) return showToast("Enter candidate name");

    if (candidates.includes(name)) {
        return showToast("Candidate already exists ⚠️");
    }

    candidates.push(name);
    votes[name] = 0;

    save();
    render();
    showToast("Candidate Added ✅");
}

// 🗳️ VOTE
function vote(candidate) {
    if (isVotingLocked) return showToast("Voting Locked ⛔");

    let id = document.getElementById("voterId").value.trim();

    if (!id) return showToast("Enter Voter ID");

    if (voters.includes(id)) {
        return showToast("You already voted ❌");
    }

    // ⏳ Confirm vote
    if (!confirm(`Vote for ${candidate}?`)) return;

    votes[candidate]++;
    voters.push(id);

    playSound();
    save();
    render();

    showToast("Vote Cast Successfully 🗳️");
}

// 🔍 SEARCH
function searchCandidate() {
    let val = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll(".candidate").forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(val)
            ? "flex"
            : "none";
    });
}

// 🎨 RENDER UI
function render() {
    renderCandidates();
    renderResults();
}

// 👤 RENDER CANDIDATES
function renderCandidates() {
    let list = document.getElementById("candidateList");
    list.innerHTML = "";

    candidates.forEach(c => {
        let div = document.createElement("div");
        div.className = "candidate glass";

        div.innerHTML = `
            <span>${c}</span>
            <button onclick="vote('${c}')">Vote</button>
        `;

        list.appendChild(div);
    });
}

// 📊 RENDER RESULTS
function renderResults() {
    let res = document.getElementById("results");
    res.innerHTML = "";

    let totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    Object.keys(votes).forEach(c => {
        let percent = totalVotes ? ((votes[c] / totalVotes) * 100).toFixed(1) : 0;

        res.innerHTML += `
        <div class="glass">
            ${c}: ${votes[c]} votes (${percent}%)
        </div>`;
    });

    drawChart();
}

// 📊 DRAW CHART (PIE)
function drawChart() {
    let canvas = document.getElementById("chart");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let total = Object.values(votes).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    let start = 0;

    Object.keys(votes).forEach(c => {
        let slice = (votes[c] / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 100, start, start + slice);
        ctx.fillStyle = randomColor();
        ctx.fill();

        start += slice;
    });
}

// 🎨 RANDOM COLOR
function randomColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

// 🌙 THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// 🔊 SOUND
function playSound() {
    let audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
    audio.play();
}

// 🔄 RESET SYSTEM
function reset() {
    if (!confirm("Reset entire election?")) return;

    candidates = [];
    votes = {};
    voters = [];

    save();
    location.reload();
}

// 🔒 LOCK VOTING
function lockVoting() {
    isVotingLocked = true;
    showToast("Voting Locked 🔒");
}

// 🔓 UNLOCK VOTING
function unlockVoting() {
    isVotingLocked = false;
    showToast("Voting Unlocked 🔓");
}

// 💾 SAVE DATA
function save() {
    localStorage.setItem("candidates", JSON.stringify(candidates));
    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("voters", JSON.stringify(voters));
}

// 🔔 TOAST NOTIFICATION
function showToast(msg) {
    let toast = document.createElement("div");
    toast.innerText = msg;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "rgba(0,0,0,0.7)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "10px";
    toast.style.color = "white";
    toast.style.zIndex = "999";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 🚀 INITIAL RENDER
render();