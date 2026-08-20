import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';
import { URL } from 'url';

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

              // Parse pass/fail summary
              const passMatch = rawOutput.match(/(\d+)\s+pass/i);
              const failMatch = rawOutput.match(/(\d+)\s+fail/i);
              const passedCount = passMatch ? parseInt(passMatch[1], 10) : 0;
              const failedCount = failMatch ? parseInt(failMatch[1], 10) : 0;

              const isSuccess = !error && failedCount === 0;

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: isSuccess,
                  passedCount,
                  failedCount,
                  duration,
                  output: rawOutput.trim(),
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
