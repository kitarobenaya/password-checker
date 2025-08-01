const input = document.querySelector("input[type='text']");
const output = document.querySelector("main");

// focusing input
input.focus();
document.addEventListener("click", (e) => {
  const tag = e.target.tagName.toLowerCase();
  if (!["input", "textarea", "button"].includes(tag)) {
    input.focus();
  }

  document.addEventListener("keydown", () => {
    if (document.activeElement !== input) {
      input.focus();
    }
  });
});

output.addEventListener("load", (e) => {
  if (e.target.classList.contains("command-input")) {
    e.target.focus();

    document.addEventListener("click", (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (!["input", "textarea", "button"].includes(tag)) {
        input.focus();
      }
    });

    document.addEventListener("keydown", () => {
      if (document.activeElement !== input) {
        input.focus();
      }
    });
  }
});

output.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("command-input")) {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value;
      handleCommand(value);
    }
  }
});

async function handleCommand(input) {
  const split = input.split(" ");
  const command = split[0];
  const value = split[1];
  let poin = 0;
  let info = "";

  if (command == "check-password") {
    value.length > 8 ? (poin += 1) : (poin += 0);
    /[a-z]/.test(value) ? (poin += 1) : (poin += 0);
    /[A-Z]/.test(value) ? (poin += 1) : (poin += 0);
    /[0-9]/.test(value) ? (poin += 1) : (poin += 0);
    /[\W]/.test(value) ? (poin += 1) : (poin += 0);

    const start = performance.now();
    const getWords = await fetch("password.txt")
      .then((words) => words.text())
      .then((word) => word.split("\n"));

    for (i = 0; i < getWords.length; i++) {
      if (getWords[i] == value) {
        info = "password found in the wordlists";
        break;
      }
    }

    if (info !== "password found in the wordlists") {
      info = "password not found in the wordlists";
    }

    const end = performance.now();
    const HTMLstring = `
        <section class="output">
        <ul>
          <li class='lipass'>[✔] Password: ${value}</li>
          <li class='lipoin'>[!] Strength: ${poin}/5</li>
          <li class='liinfo'>[i] Info: ${info}</li>
          <li class='litime'>[i] Crack time: ${
            (end - start) / 1000
          } seconds</li>
        </ul>
        </section>
        `;
    output.insertAdjacentHTML("beforeend", HTMLstring);
    newCommandLine();
    localStore(
      generateUID(),
      input,
      `
    <ul>
      <li class='lipass'>[✔] Password: ${value}</li>
      <li class='lipoin'>[!] Strength: ${poin}/5</li>
      <li class='liinfo'>[i] Info: ${info}</li>
      <li class='litime'>[i] Crack time: ${(end - start) / 1000} seconds</li>
    </ul>
    `
    );
  } else if (command == "clear") {
    output.innerHTML = "";
    localStorage.clear();
    newCommandLine();
  }
}

function generateUID() {
  return Math.random().toString(36).substring(2, 9);
}

function localStore(uid, command, output) {
  const data = [];
  const storedData = localStorage.getItem("terminal-history");
  if (storedData) {
    const existingData = JSON.parse(storedData);
    data.push(...existingData);
  }
  data.push({
    uid: uid,
    command: command,
    output: output,
  });
  localStorage.setItem("terminal-history", JSON.stringify(data));
}

function loadLocalStore() {
  const storedData = localStorage.getItem("terminal-history");
  
  if (storedData) {
    output.innerHTML = "";
    const data = JSON.parse(storedData);
    data.forEach((item) => {
      const sectionIn = document.createElement("section");
      sectionIn.classList.add("input");
      sectionIn.setAttribute("data-uid", item.uid);
      sectionIn.innerHTML = `&gt; <input type="text" class="command-input" spellcheck="false" value="${item.command}" disabled />`;
      output.appendChild(sectionIn);

      const sectionOut = document.createElement("section");
      sectionOut.classList.add("output");
      sectionOut.setAttribute("data-uid", item.uid);
      sectionOut.innerHTML = item.output;
      output.appendChild(sectionOut);
    });
    newCommandLine();
  }
}

loadLocalStore();

function newCommandLine() {
  const sectionIn = document.createElement("section");
  sectionIn.classList.add("input");
  sectionIn.innerHTML = `&gt; <input type="text" class="command-input" spellcheck="false" />`;
  output.appendChild(sectionIn);
  const commandInput = sectionIn.querySelector(".command-input");
  commandInput.focus();
  output.scrollIntoView({ behavior: "smooth", block: "end" });
}
