import React, { useState, useEffect, Suspense } from 'react';
import { exercisesList, quizzesList, exerciseComponents } from './registry.jsx';

export default function App() {
  const [activeId, setActiveId] = useState(exercisesList[0]?.id || '');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [selectedQuizUrl, setSelectedQuizUrl] = useState(null);
  const [zoomImageSrc, setZoomImageSrc] = useState(null);

  // In-browser test runner state
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const activeExercise = exercisesList.find((e) => e.id === activeId);
  const ActiveComponent = exerciseComponents[activeId];

  // Dynamic CSS injection for active exercise
  useEffect(() => {
    if (!activeExercise) return;
    
    // Clear test result on exercise change
    setTestResult(null);

    const styleId = 'active-exercise-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('link');
      styleTag.id = styleId;
      styleTag.rel = 'stylesheet';
      document.head.appendChild(styleTag);
    }
    styleTag.href = `/src/exercises/${activeExercise.slug}/index.css`;
  }, [activeExercise]);

  // Handle Escape key to close modals/lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomImageSrc(null);
        setSelectedQuizUrl(null);
        setShowQuizzes(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle clicks inside instruction panel (intercept image clicks for Lightbox)
  const handleInstructionsClick = (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      setZoomImageSrc(e.target.src);
    }
  };

  // Run tests for current active exercise
  const handleRunTests = async () => {
    if (!activeExercise || isRunningTests) return;

    setIsRunningTests(true);
    setTestResult(null);

    try {
      const response = await fetch(`/api/run-tests?exercise=${encodeURIComponent(activeExercise.slug)}`);
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        error: true,
        output: `Failed to connect to test server: ${err.message}`,
        passedCount: 0,
        failedCount: 1,
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span>⚛️</span>
          <span>React Course Hub</span>
          <span className="brand-badge">Bun + Vite</span>
        </div>

        <div className="controls">
          <div className="select-wrapper">
            <select
              className="exercise-select"
              value={activeId}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {exercisesList.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`btn ${showInstructions ? 'btn-active' : ''}`}
            onClick={() => setShowInstructions(!showInstructions)}
            title="Toggle Instructions"
          >
            📖 Instructions
          </button>

          <button
            className="btn"
            onClick={() => setShowQuizzes(true)}
            title="View theoretical quizzes"
          >
            📝 Quizzes ({quizzesList.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sidebar Instructions */}
        <aside className={`instructions-panel ${!showInstructions ? 'collapsed' : ''}`}>
          {showInstructions && activeExercise && (
            <>
              <div className="panel-header">
                <h2>{activeExercise.title}</h2>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>🔍 Click images to zoom</span>
              </div>
              <div
                className="panel-body"
                onClick={handleInstructionsClick}
                dangerouslySetInnerHTML={{ __html: activeExercise.rawInstructions }}
              />
            </>
          )}
        </aside>

        {/* Live Exercise Rendering Stage */}
        <main className="preview-panel">
          <div className="preview-header">
            <div className="preview-title">
              <span>🚀 Editing:</span>
              <code style={{ color: '#38bdf8' }}>
                src/exercises/{activeExercise?.slug}/App.jsx
              </code>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className={`btn btn-test ${isRunningTests ? 'loading' : ''} ${
                  testResult ? (testResult.success ? 'btn-test-pass' : 'btn-test-fail') : ''
                }`}
                onClick={handleRunTests}
                disabled={isRunningTests}
                title="Run automated tests for this exercise"
              >
                {isRunningTests ? (
                  <>⏳ Running tests...</>
                ) : testResult ? (
                  testResult.success ? (
                    <>✅ Passed ({testResult.passedCount})</>
                  ) : (
                    <>❌ Failed ({testResult.failedCount}) - Re-run</>
                  )
                ) : (
                  <>🧪 Run Tests</>
                )}
              </button>
            </div>
          </div>

          <div className="preview-stage">
            <div className="render-box">
              {ActiveComponent ? (
                <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading exercise...</div>}>
                  <ActiveComponent key={activeId} />
                </Suspense>
              ) : (
                <p>Exercise component not found.</p>
              )}
            </div>

            {/* Test Results Drawer / Card */}
            {testResult && (
              <div className={`test-results-card ${testResult.success ? 'test-pass' : 'test-fail'}`}>
                <div className="test-results-header">
                  <div className="test-status-badge">
                    {testResult.success ? '🎉 All Tests Passed!' : '⚠️ Tests Need Attention'}
                  </div>
                  <div className="test-meta">
                    <span>
                      {testResult.passedCount} passed, {testResult.failedCount} failed
                    </span>
                    {testResult.duration && <span style={{ opacity: 0.7 }}>• {testResult.duration}ms</span>}
                    <button className="test-close-btn" onClick={() => setTestResult(null)}>✕</button>
                  </div>
                </div>
                <div className="test-output-box">
                  <pre>{testResult.output}</pre>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Lightbox Modal for Instruction Images */}
      {zoomImageSrc && (
        <div className="lightbox-backdrop" onClick={() => setZoomImageSrc(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setZoomImageSrc(null)}
              title="Close (Esc)"
            >
              ✕
            </button>
            <img
              src={zoomImageSrc}
              alt="Zoomed reference design"
              className="lightbox-image"
            />
            <div className="lightbox-caption">
              🔍 Reference screenshot from course instructions (Click anywhere or press Esc to close)
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List Modal */}
      {showQuizzes && (
        <div className="modal-backdrop" onClick={() => setShowQuizzes(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Theoretical Quizzes (Multiple Choice)</h3>
              <button className="btn" onClick={() => setShowQuizzes(false)}>✕</button>
            </div>
            <div className="quiz-list">
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Click below to open quizzes in a new tab or view them directly:
              </p>
              {quizzesList.map((q) => (
                <div key={q.file} className="quiz-item">
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{q.title}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn"
                      onClick={() => {
                        setSelectedQuizUrl(q.url);
                        setShowQuizzes(false);
                      }}
                      style={{ fontSize: '0.8rem' }}
                    >
                      Embed 🖥️
                    </button>
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ textDecoration: 'none', fontSize: '0.8rem' }}
                    >
                      New Tab ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Quiz Modal */}
      {selectedQuizUrl && (
        <div className="modal-backdrop" onClick={() => setSelectedQuizUrl(null)}>
          <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Quiz Viewer</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={selectedQuizUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', fontSize: '0.8rem' }}
                >
                  Open Full Page ↗
                </a>
                <button className="btn" onClick={() => setSelectedQuizUrl(null)}>✕</button>
              </div>
            </div>
            <div style={{ height: '70vh', background: 'white' }}>
              <iframe
                src={selectedQuizUrl}
                title="Quiz"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
