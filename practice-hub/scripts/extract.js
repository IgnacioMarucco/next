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
const quizMap = new Map(registry.quizzes.map(q => [q.title, q]));

let newCount = 0;

for (const file of files.sort()) {
  const filePath = path.join(sourceDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Match quizData JSON
  const match = content.match(/const quizData\s*=\s*(\{[\s\S]*?\});(?:\s*<|\s*\n\s*function)/);
  if (match) {
    try {
      const data = Function('return ' + match[1])();
      if (data.title && (data.hasInstructions || data.hasSolutions)) {
        const slug = slugify(data.title);
        const exerciseDir = path.join(baseExercisesDir, slug);
        const solutionDir = path.join(exerciseDir, 'solution');

        fs.mkdirSync(exerciseDir, { recursive: true });
        fs.mkdirSync(solutionDir, { recursive: true });

        // 1. README.md (Instructions)
        const readmeContent = `# ${data.title}\n\n${htmlToMarkdown(data.instructions)}\n`;
        fs.writeFileSync(path.join(exerciseDir, 'README.md'), readmeContent);

        // 2. Solutions ONLY in solution/ folder
        if (data.solutions && Array.isArray(data.solutions)) {
          for (const sol of data.solutions) {
            const outName = sol.file_name.replace(/\.js$/, '.jsx');
            fs.writeFileSync(path.join(solutionDir, outName), sol.content);

            const starterFile = path.join(exerciseDir, outName);
            // 3. Create UNSOLVED starter file for practice if not existing
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

        // 4. Tests
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
    } catch (err) {
      console.warn(`  ⚠️ Could not parse JS object in ${file}:`, err.message);
    }
  }

  // Check if theoretical quiz
  if (content.includes('id="quiz-container"') || content.includes('Quiz') || content.includes('multiple-choice')) {
    const quizTitle = file.replace('.html', '');
    const quizSlug = slugify(quizTitle);
    const quizPublicPath = path.join(publicQuizzesDir, `${quizSlug}.html`);

    // Copy quiz HTML to public/quizzes so Vite serves it over HTTP directly
    fs.writeFileSync(quizPublicPath, content);

    if (!quizMap.has(quizTitle)) {
      newCount++;
      console.log(`  📝 New theoretical quiz: ${quizTitle}`);
    }
    quizMap.set(quizTitle, {
      title: quizTitle,
      slug: quizSlug,
      file: file,
      url: `/quizzes/${quizSlug}.html`
    });
  }
}

registry.exercises = Array.from(exerciseMap.values()).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
registry.quizzes = Array.from(quizMap.values()).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));

fs.writeFileSync(path.resolve('src/exercises.json'), JSON.stringify(registry, null, 2));

let registryJs = `// Auto-generated by extract.js\nimport React from 'react';\n\n`;
registryJs += `export const exercisesList = ${JSON.stringify(registry.exercises, null, 2)};\n\n`;
registryJs += `export const quizzesList = ${JSON.stringify(registry.quizzes, null, 2)};\n\n`;

registryJs += `export const exerciseComponents = {\n`;
for (const ex of registry.exercises) {
  registryJs += `  '${ex.id}': React.lazy(() => import('./exercises/${ex.slug}/App.jsx')),\n`;
}
registryJs += `};\n`;

fs.writeFileSync(path.resolve('src/registry.jsx'), registryJs);

console.log(`\n🎉 Total registered: ${registry.exercises.length} coding exercises and ${registry.quizzes.length} theoretical quizzes (${newCount} new).`);
