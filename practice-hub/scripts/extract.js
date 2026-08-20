import fs from 'fs';
import path from 'path';

// Primary source is the parent repo exercises/ folder, fallback to ~/Downloads
const defaultExercisesDir = path.resolve('../exercises');
const fallbackDownloadsDir = path.join(process.env.HOME, 'Downloads');

const sourceDir = process.env.EXERCISES_DIR || (fs.existsSync(defaultExercisesDir) ? defaultExercisesDir : fallbackDownloadsDir);
const baseExercisesDir = path.resolve('src/exercises');
const publicQuizzesDir = path.resolve('public/quizzes');

if (!fs.existsSync(baseExercisesDir)) {
  fs.mkdirSync(baseExercisesDir, { recursive: true });
}
if (!fs.existsSync(publicQuizzesDir)) {
  fs.mkdirSync(publicQuizzesDir, { recursive: true });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function htmlToMarkdown(html) {
  if (!html) return '';
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, p1) => '```jsx\n' + p1.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') + '\n```\n\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<ul>([\s\S]*?)<\/ul>/gi, '$1\n')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<img[^>]+src="([^">]+)"[^>]*>/gi, '![]($1)\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Generates a clean, bug-free standalone HTML quiz page with proper escaping
 */
function buildQuizHtml(quizData, displayTitle) {
  const finalTitle = displayTitle || quizData.quiz_title || 'React Quiz';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${finalTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #131b2e;
      --card-border: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #6366f1;
      --accent-hover: #4f46e5;
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.15);
      --danger: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.15);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding-top: 60px;
      padding-bottom: 40px;
      line-height: 1.6;
    }
    .score-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 52px;
      background: #0f172a;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 100;
      backdrop-filter: blur(8px);
    }
    .score-badge {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.8rem;
    }
    .badge-score { background: #3b82f6; color: white; }
    .badge-correct { background: var(--success); color: white; }
    .badge-incorrect { background: var(--danger); color: white; }
    
    .container {
      max-width: 820px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .quiz-header {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }
    .quiz-header h1 {
      font-size: 1.4rem;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .quiz-header p {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .question-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .question-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      color: #38bdf8;
      font-size: 0.95rem;
    }
    .question-body {
      font-size: 1rem;
      color: var(--text);
    }
    .question-body pre, .option-label pre {
      background: #060911;
      border: 1px solid #1e293b;
      padding: 0.75rem;
      border-radius: 6px;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      color: #38bdf8;
      margin: 0.5rem 0;
      overflow-x: auto;
    }
    .question-body code, .option-label code {
      font-family: 'Fira Code', monospace;
      background: rgba(0,0,0,0.3);
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      color: #fbbf24;
      font-size: 0.9em;
    }
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .option-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #0c1322;
      border: 1px solid var(--card-border);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .option-item:hover {
      border-color: var(--accent);
      background: #111a2e;
    }
    .option-item input[type="radio"] {
      margin-top: 0.25rem;
      cursor: pointer;
      accent-color: var(--accent);
      width: 1.1rem;
      height: 1.1rem;
    }
    .option-label {
      flex: 1;
      cursor: pointer;
      font-size: 0.95rem;
    }
    .option-item.correct {
      border-color: var(--success) !important;
      background: var(--success-bg) !important;
    }
    .option-item.incorrect {
      border-color: var(--danger) !important;
      background: var(--danger-bg) !important;
    }
    .btn-submit {
      align-self: flex-start;
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-submit:hover {
      background: var(--accent-hover);
    }
    .feedback-box {
      margin-top: 0.5rem;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      line-height: 1.5;
      display: none;
    }
    .feedback-box.show {
      display: block;
    }
    .feedback-box.pass {
      background: var(--success-bg);
      border: 1px solid var(--success);
      color: #6ee7b7;
    }
    .feedback-box.fail {
      background: var(--danger-bg);
      border: 1px solid var(--danger);
      color: #fca5a5;
    }
  </style>
</head>
<body>
  <div class="score-bar">
    <div>📊 <span id="quiz-title-nav"></span></div>
    <div class="score-badge">
      <span class="badge badge-score" id="score-text">Score: 0%</span>
      <span class="badge badge-correct" id="correct-text">Correct: 0</span>
      <span class="badge badge-incorrect" id="incorrect-text">Incorrect: 0</span>
    </div>
  </div>

  <div class="container">
    <div class="quiz-header">
      <h1 id="quiz-title-main"></h1>
      <p id="quiz-desc"></p>
    </div>

    <div id="questions-container" style="display: flex; flex-direction: column; gap: 1.5rem;"></div>
  </div>

  <script>
    const rawQuizData = ${JSON.stringify(quizData)};
    const questions = rawQuizData.questions || [];
    const userAnswers = new Map(); // questionIndex -> { selectedIndex, isCorrect }

    document.getElementById('quiz-title-nav').textContent = "${finalTitle}";
    document.getElementById('quiz-title-main').textContent = "${finalTitle}";
    document.getElementById('quiz-desc').textContent = rawQuizData.quiz_description || 'Select the correct answer for each question below and click Submit.';

    function updateScore() {
      let correct = 0;
      let incorrect = 0;
      userAnswers.forEach((ans) => {
        if (ans.isCorrect) correct++;
        else incorrect++;
      });
      const answered = correct + incorrect;
      const pct = answered > 0 ? ((correct / questions.length) * 100).toFixed(1) : 0;

      document.getElementById('score-text').textContent = 'Score: ' + pct + '% (' + correct + '/' + questions.length + ')';
      document.getElementById('correct-text').textContent = 'Correct: ' + correct;
      document.getElementById('incorrect-text').textContent = 'Incorrect: ' + incorrect;
    }

    const container = document.getElementById('questions-container');

    questions.forEach((q, qIndex) => {
      const qPrompt = q.prompt || {};
      const answers = qPrompt.answers || [];
      const feedbacks = qPrompt.feedbacks || [];
      const correctChar = (q.correct_response && q.correct_response[0]) ? q.correct_response[0].toLowerCase() : 'a';
      const correctIndex = correctChar.charCodeAt(0) - 97;

      const card = document.createElement('div');
      card.className = 'question-card';
      card.id = 'question-' + qIndex;

      let optionsHtml = '';
      answers.forEach((ans, aIndex) => {
        const optionId = 'q_' + qIndex + '_opt_' + aIndex;
        optionsHtml += \`
          <label class="option-item" id="item_\${qIndex}_\${aIndex}" for="\${optionId}">
            <input type="radio" name="q_\${qIndex}" id="\${optionId}" value="\${aIndex}" />
            <div class="option-label">\${ans}</div>
          </label>
        \`;
      });

      card.innerHTML = \`
        <div class="question-top">
          <span>Question \${qIndex + 1} of \${questions.length}</span>
        </div>
        <div class="question-body">\${qPrompt.question || ''}</div>
        <div class="options-list">\${optionsHtml}</div>
        <button class="btn-submit" onclick="submitQuestion(\${qIndex}, \${correctIndex})">Submit Answer</button>
        <div class="feedback-box" id="feedback-\${qIndex}"></div>
      \`;

      container.appendChild(card);
    });

    window.submitQuestion = function(qIndex, correctIndex) {
      const selected = document.querySelector('input[name="q_' + qIndex + '"]:checked');
      if (!selected) {
        alert('Please select an option first!');
        return;
      }

      const selectedIndex = parseInt(selected.value, 10);
      const isCorrect = selectedIndex === correctIndex;
      userAnswers.set(qIndex, { selectedIndex, isCorrect });

      const q = questions[qIndex];
      const feedbacks = (q.prompt && q.prompt.feedbacks) ? q.prompt.feedbacks : [];
      const feedbackText = feedbacks[selectedIndex] || (isCorrect ? "Correct answer!" : "Incorrect answer.");

      // Visual classes
      const card = document.getElementById('question-' + qIndex);
      const options = card.querySelectorAll('.option-item');
      options.forEach((opt, idx) => {
        opt.classList.remove('correct', 'incorrect');
        if (idx === correctIndex) opt.classList.add('correct');
        else if (idx === selectedIndex && !isCorrect) opt.classList.add('incorrect');
      });

      const feedbackBox = document.getElementById('feedback-' + qIndex);
      feedbackBox.className = 'feedback-box show ' + (isCorrect ? 'pass' : 'fail');
      feedbackBox.innerHTML = '<strong>' + (isCorrect ? '✅ Correct! ' : '❌ Incorrect. ') + '</strong>' + feedbackText;

      updateScore();
    };

    updateScore();
  </script>
</body>
</html>
`;
}

/**
 * Creates an unsolved starter template for practice from the solution structure
 */
function createStarterCode(fileName, solutionContent, title) {
  if (fileName.endsWith('.css')) {
    return solutionContent;
  }

  const lines = solutionContent.split('\n');
  let result = `import React from 'react';\n\n// 🎯 Exercise: ${title}\n// 👉 Follow the instructions in README.md to solve this task\n\n`;
  let hasImports = false;

  // 1. Collect all imports
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('import ') && !line.includes("'react'")) {
      result += line + '\n';
      hasImports = true;
    }
  }

  if (hasImports) result += '\n';

  // 2. Extract constant objects (e.g. export const userData = {...})
  let insideConst = false;
  let constBraces = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(export\s+)?const\s+(userData|user|DUMMY_\w+)/.test(line.trim()) || insideConst) {
      insideConst = true;
      result += line + '\n';
      const openCount = (line.match(/\{|\[/g) || []).length;
      const closeCount = (line.match(/\}|\]/g) || []).length;
      constBraces += (openCount - closeCount);
      if (constBraces <= 0 && line.includes(';')) {
        insideConst = false;
        result += '\n';
      }
    }
  }

  // 3. Extract all functions / components and stub their bodies
  const functionRegex = /^(export\s+default\s+function|export\s+function|function)\s+([A-Za-z0-9_]+)\s*\((.*?)\)/;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(functionRegex);
    if (match) {
      const fullSig = match[0];
      const fnName = match[2];

      result += `${fullSig} {\n  // TODO: Write your code for ${fnName} here\n  return (\n    <div>\n      {/* TODO */}\n    </div>\n  );\n}\n\n`;
    }
  }

  // Ensure default export if present in solution
  if (solutionContent.includes('export default App') && !result.includes('export default App') && !result.includes('export default function App')) {
    result += 'export default App;\n';
  }

  return result;
}

console.log(`🔍 Scanning for course HTML files in: ${sourceDir}`);
const files = fs.existsSync(sourceDir) ? fs.readdirSync(sourceDir).filter(f => f.endsWith('.html')) : [];

let registry = { exercises: [], quizzes: [] };
const registryFile = path.resolve('src/exercises.json');
if (fs.existsSync(registryFile)) {
  try {
    registry = JSON.parse(fs.readFileSync(registryFile, 'utf-8'));
  } catch (e) {}
}

const exerciseMap = new Map(registry.exercises.map(e => [e.id, e]));
const quizMap = new Map();

let newCount = 0;

for (const file of files.sort()) {
  const filePath = path.join(sourceDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileTitle = file.replace(/\.html$/, '');

  // Match quizData JSON
  const match = content.match(/const quizData\s*=\s*(\{[\s\S]*?\});(?:\s*<|\s*\n\s*function|\s*\n\s*let)/);
  if (match) {
    try {
      const data = Function('return ' + match[1])();
      
      // 1. Coding Exercises
      if (data.title && (data.hasInstructions || data.hasSolutions)) {
        const slug = slugify(data.title);
        const exerciseDir = path.join(baseExercisesDir, slug);
        const solutionDir = path.join(exerciseDir, 'solution');

        fs.mkdirSync(exerciseDir, { recursive: true });
        fs.mkdirSync(solutionDir, { recursive: true });

        // README.md (Instructions)
        const readmeContent = `# ${data.title}\n\n${htmlToMarkdown(data.instructions)}\n`;
        fs.writeFileSync(path.join(exerciseDir, 'README.md'), readmeContent);

        // Solutions ONLY in solution/ folder
        if (data.solutions && Array.isArray(data.solutions)) {
          for (const sol of data.solutions) {
            const outName = sol.file_name.replace(/\.js$/, '.jsx');
            fs.writeFileSync(path.join(solutionDir, outName), sol.content);

            const starterFile = path.join(exerciseDir, outName);
            // Create UNSOLVED starter file for practice if not existing
            if (!fs.existsSync(starterFile)) {
              if (outName.endsWith('.css')) {
                fs.writeFileSync(starterFile, sol.content);
              } else {
                const starterCode = createStarterCode(outName, sol.content, data.title);
                fs.writeFileSync(starterFile, starterCode);
              }
            }
          }
        }

        // Tests
        if (data.tests && Array.isArray(data.tests)) {
          for (const test of data.tests) {
            let testContent = test.content;
            testContent = testContent.replace(/from\s+['"]\.\.\/src\/([^'"]+?)(?:\.js)?['"]/g, "from './$1'");
            testContent = testContent.replace(/from\s+['"]\.\/([^'"]+?)(?:\.js)?['"]/g, "from './$1'");
            testContent = testContent.replace(/from\s+['"]@testing-library\/react['"]/g, "from '../../test-utils.js'");
            
            if (!testContent.includes('bun:test') && !testContent.includes('vitest')) {
              testContent = "import { describe, test, expect, afterEach } from 'bun:test';\n" + testContent;
            } else if (testContent.includes('vitest')) {
              testContent = testContent.replace(/from\s+['"]vitest['"]/g, "from 'bun:test'");
            }

            const testOutName = test.file_name.replace(/\.spec\.js$/, '.test.jsx').replace(/\.js$/, '.test.jsx');
            fs.writeFileSync(path.join(exerciseDir, testOutName), testContent);
          }
        }

        if (!exerciseMap.has(slug)) {
          newCount++;
          console.log(`  ✨ New exercise detected: ${data.title}`);
        }

        exerciseMap.set(slug, {
          id: slug,
          title: data.title,
          slug: slug,
          hasTests: Boolean(data.hasTests),
          rawInstructions: data.instructions,
          sourceFile: file
        });

        continue;
      }

      // 2. Multiple-choice Theoretical Quizzes
      if (data.quiz_title && data.questions && Array.isArray(data.questions)) {
        const quizSlug = slugify(fileTitle);
        const quizPublicPath = path.join(publicQuizzesDir, `${quizSlug}.html`);

        // Generate clean, bug-free quiz page
        fs.writeFileSync(quizPublicPath, buildQuizHtml(data, fileTitle));

        if (!quizMap.has(fileTitle)) {
          newCount++;
          console.log(`  📝 Theoretical quiz: ${fileTitle}`);
        }
        quizMap.set(fileTitle, {
          title: fileTitle,
          slug: quizSlug,
          file: file,
          url: `/quizzes/${quizSlug}.html`
        });

        continue;
      }
    } catch (err) {
      console.warn(`  ⚠️ Could not parse JS object in ${file}:`, err.message);
    }
  }
}

registry.exercises = Array.from(exerciseMap.values()).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
registry.quizzes = Array.from(quizMap.values()).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));

fs.writeFileSync(path.resolve('src/exercises.json'), JSON.stringify(registry, null, 2));

let registryJs = `// Auto-generated by extract.js with raw CSS bundling\nimport React from 'react';\nimport { exercises as rawExercises, quizzes as rawQuizzes } from './exercises.json';\n\n`;
registryJs += `export const exercisesList = rawExercises;\n`;
registryJs += `export const quizzesList = rawQuizzes;\n\n`;

registryJs += `export const exerciseComponents = {\n`;
for (const ex of registry.exercises) {
  registryJs += `  '${ex.id}': React.lazy(() => import('./exercises/${ex.slug}/App.jsx')),\n`;
}
registryJs += `};\n\n`;

registryJs += `// Raw CSS strings loaded directly via Vite\nexport const exerciseRawStyles = import.meta.glob('./exercises/*/index.css', {\n  query: '?raw',\n  import: 'default',\n  eager: true,\n});\n`;

fs.writeFileSync(path.resolve('src/registry.jsx'), registryJs);

console.log(`\n🎉 Total registered: ${registry.exercises.length} coding exercises and ${registry.quizzes.length} theoretical quizzes (${newCount} processed).`);
