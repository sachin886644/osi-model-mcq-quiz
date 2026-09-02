const QUESTIONS = [
  {
    tag: "Overview",
    q: "How many layers does the OSI reference model have?",
    options: ["4", "5", "7", "9"],
    answer: 2,
    explain: "OSI has seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application."
  },
  {
    tag: "Layer 1",
    q: "Which layer transmits raw bits over cables, fiber, or radio?",
    options: ["Data Link", "Physical", "Network", "Transport"],
    answer: 1,
    explain: "The Physical layer (Layer 1) turns frames into electrical, optical, or radio signals on the medium."
  },
  {
    tag: "Layer 2",
    q: "MAC addresses and Ethernet frames belong to which layer?",
    options: ["Network", "Transport", "Data Link", "Session"],
    answer: 2,
    explain: "The Data Link layer uses MAC addresses and packages packets into frames for the local link."
  },
  {
    tag: "Layer 3",
    q: "IP addressing and routing happen at which layer?",
    options: ["Network", "Data Link", "Transport", "Application"],
    answer: 0,
    explain: "The Network layer (Layer 3) adds logical IP addresses and chooses paths across networks. Routers work here."
  },
  {
    tag: "Layer 4",
    q: "TCP and UDP operate at which OSI layer?",
    options: ["Session", "Transport", "Presentation", "Network"],
    answer: 1,
    explain: "Transport (Layer 4) provides end-to-end delivery. TCP is reliable and connection-oriented; UDP is faster and connectionless."
  },
  {
    tag: "Layer 5",
    q: "Which layer establishes, manages, and ends communication sessions?",
    options: ["Presentation", "Application", "Session", "Transport"],
    answer: 2,
    explain: "The Session layer keeps a conversation organized: setup, maintenance, and teardown of sessions."
  },
  {
    tag: "Layer 6",
    q: "Encryption, compression, and data-format translation are mainly associated with which layer?",
    options: ["Application", "Presentation", "Session", "Data Link"],
    answer: 1,
    explain: "The Presentation layer makes data usable across systems: encoding, compression, and encryption such as TLS."
  },
  {
    tag: "Layer 7",
    q: "HTTP, SMTP, DNS, and FTP are protocols of which layer?",
    options: ["Transport", "Network", "Application", "Presentation"],
    answer: 2,
    explain: "The Application layer is closest to the user. Browsers, mail clients, and DNS queries live here."
  },
  {
    tag: "PDUs",
    q: "What is the protocol data unit (PDU) at the Data Link layer?",
    options: ["Segment", "Packet", "Frame", "Bit"],
    answer: 2,
    explain: "Common PDUs: bits (L1), frames (L2), packets (L3), segments/datagrams (L4), and data (L5–L7)."
  },
  {
    tag: "PDUs",
    q: "A TCP unit of data at the Transport layer is called a:",
    options: ["Frame", "Packet", "Segment", "Cell"],
    answer: 2,
    explain: "TCP data is a segment. UDP data is often called a datagram. IP data is a packet."
  },
  {
    tag: "Devices",
    q: "A router primarily operates at which layer?",
    options: ["Physical", "Data Link", "Network", "Transport"],
    answer: 2,
    explain: "Routers forward packets using IP addresses (Layer 3). Switches typically forward frames using MAC addresses (Layer 2)."
  },
  {
    tag: "Devices",
    q: "An Ethernet switch mainly makes forwarding decisions using:",
    options: ["IP addresses", "MAC addresses", "Port numbers", "URLs"],
    answer: 1,
    explain: "Layer 2 switches learn and forward based on MAC addresses inside Ethernet frames."
  },
  {
    tag: "Flow",
    q: "When you send data, processing starts at the top and moves downward. Which order is correct?",
    options: [
      "Physical → Application",
      "Application → Physical",
      "Transport → Application → Physical",
      "Network → Session → Physical"
    ],
    answer: 1,
    explain: "The sender encapsulates from Layer 7 down to Layer 1. The receiver decapsulates from Layer 1 up to Layer 7."
  },
  {
    tag: "Memory aid",
    q: "In the mnemonic \u201cPlease Do Not Throw Sausage Pizza Away\u201d, the first word \u201cPlease\u201d stands for:",
    options: ["Presentation", "Physical", "Packet", "Port"],
    answer: 1,
    explain: "Bottom to top: Physical, Data Link, Network, Transport, Session, Presentation, Application."
  },
  {
    tag: "Compare",
    q: "Which statement about TCP and UDP is correct?",
    options: [
      "Both run at the Network layer",
      "UDP guarantees ordered delivery",
      "TCP provides reliable, connection-oriented delivery",
      "TCP uses only MAC addresses"
    ],
    answer: 2,
    explain: "TCP (Transport layer) uses handshakes, acknowledgements, and retransmission. UDP does not guarantee delivery or order."
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const optionsEl = document.getElementById("options");
const explainEl = document.getElementById("explain");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const progressPill = document.getElementById("progress-pill");
const liveScore = document.getElementById("live-score");

let index = 0;
let score = 0;
let locked = false;
const history = [];

function show(el) {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  el.classList.remove("hidden");
}

function renderQuestion() {
  const item = QUESTIONS[index];
  locked = false;
  explainEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  document.getElementById("q-tag").textContent = item.tag;
  document.getElementById("question-text").textContent = item.q;
  progressPill.textContent = `Question ${index + 1} / ${QUESTIONS.length}`;
  progressFill.style.width = `${(index / QUESTIONS.length) * 100}%`;
  liveScore.textContent = String(score);

  optionsEl.innerHTML = "";
  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(i, btn));
    optionsEl.appendChild(btn);
  });
}

function choose(i, btn) {
  if (locked) return;
  locked = true;
  const item = QUESTIONS[index];
  const buttons = [...optionsEl.querySelectorAll(".option")];
  buttons.forEach((b) => { b.disabled = true; });
  const correct = i === item.answer;
  if (correct) {
    score += 1;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    buttons[item.answer].classList.add("correct");
  }
  liveScore.textContent = String(score);
  explainEl.textContent = item.explain;
  explainEl.classList.remove("hidden");
  history.push({ q: item.q, correct });
  nextBtn.textContent = index === QUESTIONS.length - 1 ? "See results" : "Next question";
  nextBtn.classList.remove("hidden");
}

function finish() {
  show(resultScreen);
  progressFill.style.width = "100%";
  document.getElementById("final-score").textContent = String(score);
  const pct = Math.round((score / QUESTIONS.length) * 100);
  let msg = "Keep revising the seven layers and their PDUs.";
  if (pct === 100) msg = "Perfect score. You can explain OSI in your sleep.";
  else if (pct >= 80) msg = "Strong grasp. Review the few misses below.";
  else if (pct >= 60) msg = "Good start. Revisit devices, PDUs, and Layer 5–6.";
  document.getElementById("result-msg").textContent = `${pct}% — ${msg}`;
  const review = document.getElementById("review");
  review.innerHTML = history.map((h, i) =>
    `<div class="review-item ${h.correct ? "ok" : "no"}"><strong>Q${i + 1}.</strong> ${h.q} — ${h.correct ? "Correct" : "Incorrect"}</div>`
  ).join("");
}

document.getElementById("start-btn").addEventListener("click", () => {
  index = 0; score = 0; history.length = 0;
  show(quizScreen);
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (index === QUESTIONS.length - 1) finish();
  else { index += 1; renderQuestion(); }
});

document.getElementById("retry-btn").addEventListener("click", () => {
  index = 0; score = 0; history.length = 0;
  show(quizScreen);
  renderQuestion();
});
