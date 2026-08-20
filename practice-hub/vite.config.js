import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';
import { URL } from 'url';

function parseTestOutput(raw) {
  const clean = (raw || '').replace(/\u001b\[[0-9;]*m/g, '');
  const lines = clean.split('\n');

  const testCases = [];
  let currentErrorSnippet = [];
  let capturingError = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for pass line
    const passMatch = line.match(/(?:✓|\(pass\))\s+(.+?)(?:\s+\[([\d.]+m?s)\])?$/);
    if (passMatch) {
      testCases.push({
        name: passMatch[1].trim(),
        status: 'pass',
        duration: passMatch[2] || '',
        error: null,
      });
      continue;
    }

    // Check for fail line
    const failMatch = line.match(/(?:✗|\(fail\))\s+(.+?)(?:\s+\[([\d.]+m?s)\])?$/);
    if (failMatch) {
      const errorText = currentErrorSnippet.join('\n').trim();
      currentErrorSnippet = [];
      capturingError = false;
      testCases.push({
        name: failMatch[1].trim(),
        status: 'fail',
        duration: failMatch[2] || '',
        error: errorText || 'Test assertion failed',
      });
      continue;
    }

    // Capture meaningful error lines and skip internal node_modules noise
    if (
      line.includes('TestingLibraryElementError') ||
      line.includes('error:') ||
      line.includes('Error:') ||
      line.includes('Expected:') ||
      line.includes('Received:') ||
      line.includes('|') ||
      capturingError
    ) {
      if (line.includes('at <anonymous>') || line.includes('node_modules') || line.includes('checkHtmlElement')) {
        continue;
      }
      capturingError = true;
      if (line.trim()) {
        currentErrorSnippet.push(line);
      }
    }
  }

  const passMatch = clean.match(/(\d+)\s+pass/i);
  const failMatch = clean.match(/(\d+)\s+fail/i);
  const passed = passMatch ? parseInt(passMatch[1], 10) : testCases.filter((t) => t.status === 'pass').length;
  const failed = failMatch ? parseInt(failMatch[1], 10) : testCases.filter((t) => t.status === 'fail').length;

  return {
    testCases,
    passed,
    failed,
    total: passed + failed,
    raw: clean.trim(),
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'test-runner-api',
      configureServer(server) {
        server.middlewares.use('/api/run-tests', async (req, res) => {
          try {
            const reqUrl = new URL(req.url, 'http://localhost');
            const exerciseSlug = reqUrl.searchParams.get('exercise');

            if (!exerciseSlug) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Exercise slug is required' }));
              return;
            }

            const testPath = `src/exercises/${exerciseSlug}/App.test.jsx`;
            const startTime = Date.now();

            exec(`bun test ${testPath}`, { cwd: process.cwd() }, (error, stdout, stderr) => {
              const duration = Date.now() - startTime;
              const rawOutput = (stdout || '') + '\n' + (stderr || '');
              const parsed = parseTestOutput(rawOutput);

              const isSuccess = !error && parsed.failed === 0 && parsed.passed > 0;

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: isSuccess,
                  passedCount: parsed.passed,
                  failedCount: parsed.failed,
                  totalCount: parsed.total,
                  testCases: parsed.testCases,
                  duration,
                  output: parsed.raw,
                  exercise: exerciseSlug,
                })
              );
            });
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      },
    },
  ],
});
