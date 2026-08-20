import React, { useState, useEffect, Suspense } from 'react';
import { exercisesList, quizzesList, exerciseComponents } from './registry.jsx';

export default function App() {
  const [activeId, setActiveId] = useState(exercisesList[0]?.id || '');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [selectedQuizUrl, setSelectedQuizUrl] = useState(null);

  const activeExercise = exercisesList.find((e) => e.id === activeId);
  const ActiveComponent = exerciseComponents[activeId];

  // Dynamic CSS injection for active exercise
  useEffect(() => {
    if (!activeExercise) return;
    
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
              </div>
              <div
                className="panel-body"
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
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              💡 Save changes in VS Code to see instant hot reloads
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
          </div>
        </main>
      </div>

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
