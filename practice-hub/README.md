# ⚛️ React & Next.js Practice Hub

High-performance local development workspace for solving Udemy React practice assignments and quizzes using **Bun + Vite + Happy-DOM**.

---

## 📋 Step-by-Step Daily Workflow

### 1. Save New Exercises
Place your downloaded `.html` files from Udemy into the repository's `exercises/` folder (`~/repos/next/exercises/`).

### 2. Extract into Workspace
Navigate to `practice-hub` in your terminal and run the extractor:
```fish
cd ~/repos/next/practice-hub
bun run extract
```
* **What it does:** Scans `../exercises/`, detects new assignment files, creates dedicated folders under `src/exercises/` with unsolved starter templates (`App.jsx`), automated test suites, formatted instructions, and official reference solutions.
* **Safety:** Protected against accidental overwrites — it will never overwrite any code you have already started writing in existing `App.jsx` files.

### 3. Develop with Live Hot Reloading
Start the interactive development server:
```fish
bun dev
```
1. Open your browser at: [http://localhost:5173](http://localhost:5173).
2. Select the exercise you want to solve from the top navigation dropdown.
3. Read the task requirements in the collapsible left sidebar.
4. Open and write your code in VS Code (e.g., `src/exercises/021-component-composition/App.jsx`).
5. Every time you save (`Ctrl + S`), the live preview updates instantly with no page reloads.

### 4. Validate Your Code with Automated Tests
Run the test runner to check if your implementation satisfies all course criteria:

* **Run all tests across all exercises:**
  ```fish
  bun test
  ```
* **Run tests for a single exercise:**
  ```fish
  bun test src/exercises/021-component-composition/
  ```

---

## 📁 Repository Structure

```text
next/
├── .gitignore               # Root git ignore
├── exercises/               # 📥 Raw .html files downloaded from Udemy
├── js-refresher/            # Course lesson project
├── react-essentials-.../    # Course lesson project
└── practice-hub/            # ⚛️ Practice workspace app
    ├── README.md            # Workspace documentation
    ├── package.json
    ├── scripts/extract.js   # Scans ../exercises/ for new .html files
    └── src/
        ├── App.jsx          # Interactive UI viewer with exercise switcher
        └── exercises/       # Extracted practice components & tests
```

---

## 📝 Theoretical Quizzes (Multiple Choice)
Multiple-choice quizzes downloaded from Udemy:
1. Click the **"📝 Quizzes"** button on the top right of the web app (`http://localhost:5173`).
2. Click **"New Tab ↗"** or **"Embed 🖥️"** on any quiz to open and answer it interactively in your browser.
