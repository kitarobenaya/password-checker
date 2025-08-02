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

output.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("command-input")) {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value;
      handleCommand(value);
      e.target.setAttribute("disabled", "true");
    }
  }
});

// Function to handle commands
async function handleCommand(input) {
  const split = input.split(" ");
  const command = split[0];
  const value = split[1];
  let poin = 0;
  let info = "";
  let stopLoop = false;

  if (command == "check-password") {
    value.length > 8 ? (poin += 1) : (poin += 0);
    /[a-z]/.test(value) ? (poin += 1) : (poin += 0);
    /[A-Z]/.test(value) ? (poin += 1) : (poin += 0);
    /[0-9]/.test(value) ? (poin += 1) : (poin += 0);
    /[\W]/.test(value) ? (poin += 1) : (poin += 0);

    const sectionload = document.createElement("section");
    sectionload.classList.add("output");
    sectionload.innerHTML = `<ul><li>[⏳] Checking password...</li><ul>`;
    output.appendChild(sectionload);
    const control = document.createElement("section");
    control.classList.add("output");
    control.innerHTML = `<ul><i>Ctrl + c to stop Or s in mobile</i></ul>`;
    output.appendChild(control);
    output.scrollIntoView({ behavior: "smooth", block: "end" });

    const start = performance.now();

    // Fetch the wordlist from the assets folder
    const getWords = await fetch("wordlist/password.txt")
      .then((words) => words.text())
      .then((word) => word.split("\n"));

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "c" || e.key === "s") {
        info = "password check stopped by user";
        output.scrollIntoView({ behavior: "smooth", block: "end" });
        stopLoop = true;
      }
    });

    // Loop through the wordlist and check for the password
    for (i = 0; i < getWords.length; i++) {
      if (stopLoop) {
        break;
      }

      if (i % 200 === 0) {
        sectionload.innerHTML += `<ul><li class="liinfo">[⏳] Checking... Tried ${i} words</li><ul>`;
        output.scrollIntoView({ behavior: "smooth", block: "end" });
      }

      if (getWords[i] == value) {
        info = "password found in the wordlists";
        break;
      }

      await awaitLoop(1);
    }

    if (info === "") {
      info = "password not found in the wordlists";
    }

    const end = performance.now();
    const HTMLstring = `
        <section class="output">
        <ul>
          <li class='lipass'>[✔] Password: ${value}</li>
          <li class='lipoin'>[!] Strength: ${poin}/5</li>
          <li class='liinfo' style="color: red;">[i] Info: ${info}</li>
          <li class='litime'>[i] Crack time: ${
            (end - start) / 1000
          } seconds</li>
        </ul>
        </section>
        `;
    sectionload.remove();
    control.remove();
    output.insertAdjacentHTML("beforeend", HTMLstring);
    newCommandLine();
    localStore(
      generateUID(),
      input,
      `
    <ul>
      <li class='lipass'>[✔] Password: ${value}</li>
      <li class='lipoin'>[!] Strength: ${poin}/5</li>
      <li class='liinfo' style="color: red;">[i] Info: ${info}</li>
      <li class='litime'>[i] Crack time: ${(end - start) / 1000} seconds</li>
    </ul>
    `
    );

  } else if (command == "clear") {
    output.innerHTML = "";
    localStorage.removeItem("terminal-history");
    newCommandLine();

  } else if (command == "help") {
    const helpText = `
    <section class="output">
      <ul>
        <li class='lihelp'>[i] Available commands:</li>
        <li class='lihelp'>- <strong>check-password</strong> [password]: Check the strength of a password.</li>
        <li class='lihelp'>- <strong>clear</strong>: Clear the terminal output and history.</li>
        <li class='lihelp'>- <strong>help</strong>: Show this help message.</li>
        <li class='lihelp'>- <strong>history</strong>: Show command history.</li>
      </ul>
    </section>
    `;
    output.insertAdjacentHTML("beforeend", helpText);
    localStore(generateUID(), input, helpText);
    newCommandLine();

  } else if (command == "history") {
    const storedData = localStorage.getItem("terminal-history");
    if (storedData) {
      const data = JSON.parse(storedData);
      data.forEach((item) => {
        const sectionOut = document.createElement("section");
        sectionOut.classList.add("output");
        sectionOut.innerHTML = item.command;
        output.appendChild(sectionOut);
      });
      newCommandLine();
    }
  } else {
    const errorText = `
    <section class="output">
      <ul>
        <li class='lierror'>[✖] Error: Command not found.</li>
        <li class='lierror'>[i] Type 'help' for a list of available commands.</li>
      </ul>
    </section>
    `;
    output.insertAdjacentHTML("beforeend", errorText);
    localStore(generateUID(), input, errorText);
    newCommandLine();
  }
}

// Function to create a delay
function awaitLoop(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Function to generate a unique identifier
function generateUID() {
  return Math.random().toString(36).substring(2, 9);
}

// Function to store command history in local storage
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

// Function to load command history from local storage
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

// Load command history from local storage on page load
loadLocalStore();

// Function to create a new command line input
function newCommandLine() {
  const sectionIn = document.createElement("section");
  sectionIn.classList.add("input");
  sectionIn.innerHTML = `&gt; <input type="text" class="command-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />`;
  output.appendChild(sectionIn);
  const commandInput = sectionIn.querySelector(".command-input");
  commandInput.focus();
  output.scrollIntoView({ behavior: "smooth", block: "end" });
}
