# 🔐 Terminal Password Checker

A web-based terminal simulation that checks password strength and verifies it against a wordlist (bruteforce simulation). Built using HTML, CSS, and vanilla JavaScript.

## 🚀 Features

- Terminal-style command input/output
- `check-password` command to:
  - Evaluate password strength based on 5 criteria
  - Check if the password exists in a wordlist (`password.txt`)
  - Display how long it takes to "crack" the password
- `clear` command to reset the terminal and clear localStorage
- `help` command to display available commands
- `history` command to show previously entered commands
- Commands are persisted via `localStorage`
- Responsive for desktop and mobile use
- Keyboard support: press `Ctrl + C` or `s` to stop a wordlist check in progress

## 💡 How to Use

1. Open the web app in your browser
2. Type `check-password <yourpassword>` and press Enter
3. Wait for the results to display
4. Type `help` to view other available commands
        
## 🛠️ Built With

- HTML5
- CSS3
- JavaScript (Vanilla)

## 📝 Technical Notes

- `autocapitalize="off"` is used to avoid automatic uppercase on mobile devices
- No external libraries or frameworks are used
- The `password.txt` file can be replaced with any other wordlist (beware of large file sizes)
- Loop delay (`awaitLoop()`) and loop-stopping functionality added for large wordlist performance

## 🧠 Learning Objectives

This project was built to practice and demonstrate:

- DOM manipulation
- Advanced event handling
- Async/await and Promises
- Performance timing
- Data persistence with localStorage
- Responsive and interactive UI design

## 👤 Author

**Kitaro Benaya**  
[GitHub](https://github.com/kitarobenaya)

---

> 💬 Feel free to fork, use, or adapt this project for learning or personal development!
