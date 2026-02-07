import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Question {
    id: string | number;
    question: string;
    options: string[];
    answer: string;
    timer?: number; // Optional per-question timer
}

const QuizReview: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default empty state or load from navigation
    const [questions, setQuestions] = useState<Question[]>([]);
    const [globalTimer, setGlobalTimer] = useState(20); // Default 20s

    useEffect(() => {
        if (location.state?.importedQuestions) {
            // Map imported questions to include default timer
            const mapped = (location.state.importedQuestions as any[]).map(q => ({
                ...q,
                id: q.id || Math.random().toString(36).substr(2, 9),
                options: q.options || ['', '', '', ''],
                timer: q.timer || 20
            }));
            setQuestions(mapped);
        } else {
            // Fallback for manual testing or direct navigation
            setQuestions([
                { id: '1', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4', timer: 20 }
            ]);
        }
    }, [location.state]);

    const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[optIndex] = value;
        newQuestions[qIndex].options = newOptions;

        // If the edited option was the answer, update the answer too (optional but good UX)
        // ideally we store answer index, but here we store answer text string from Gemini
        // simplified: user must manually ensure answer text matches one option if they change option logic entirely
        setQuestions(newQuestions);
    };

    const handleGlobalTimerChange = (val: number) => {
        // Clamp between 5 and 60
        const clamped = Math.min(60, Math.max(5, val));
        setGlobalTimer(clamped);
        // Update all existing
        setQuestions(prev => prev.map(q => ({ ...q, timer: clamped })));
    };

    const handleStartQuiz = () => {
        // Validate
        const isValid = questions.every(q =>
            q.question.trim() &&
            q.options.every(o => o.trim()) &&
            q.answer.trim()
        );

        if (!isValid) {
            alert("Please ensure all fields are filled!");
            return;
        }

        navigate('/quizzes', { state: { questions } });
    };

    return (
        <div className="page-fullscreen" style={{
            minHeight: '100dvh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#f8f9fa',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                margin: '0 auto',
                width: '100%',
                maxWidth: '800px',
                padding: 'clamp(1rem, 5vw, 2rem)',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.8)',
                overflow: 'hidden' // Contain scrolling within
            }}>
                {/* Fixed Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexShrink: 0
                }}>
                    <button
                        className="clay-button secondary"
                        onClick={() => navigate(-1)}
                        style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                        ← Back
                    </button>
                    <h2 style={{
                        color: '#2c3e50',
                        margin: 0,
                        fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Review Quest 🛡️</h2>
                </div>

                {/* Global Settings (shrinkable) */}
                <div className="clay-card" style={{
                    marginBottom: '1rem',
                    padding: '12px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <label style={{ fontWeight: 700, color: '#555', fontSize: '0.9rem' }}>⏳ Max Timer (s):</label>
                    <input
                        type="number"
                        value={globalTimer}
                        onChange={(e) => handleGlobalTimerChange(parseInt(e.target.value) || 0)}
                        style={{
                            width: '60px',
                            padding: '8px',
                            borderRadius: '8px',
                            border: '2px solid #eee',
                            textAlign: 'center',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                        max={60}
                        min={5}
                    />
                </div>

                {/* Scrollable Question List */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    overflowY: 'auto',
                    flex: 1,
                    padding: '5px', // Space for shadows
                    paddingBottom: '80px' // Space for floating button
                }}>
                    {questions.map((q, qIndex) => (
                        <div key={q.id} className="clay-card" style={{
                            background: 'white',
                            borderLeft: '6px solid #A0C4FF',
                            padding: '15px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, color: '#A0C4FF' }}>Q{qIndex + 1}</span>
                                <div style={{ fontSize: '0.85rem', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    ⏱️ <input
                                        type="number"
                                        value={q.timer}
                                        onChange={(e) => handleQuestionChange(qIndex, 'timer', parseInt(e.target.value))}
                                        style={{ width: '40px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        max={60}
                                    />
                                </div>
                            </div>

                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                placeholder="Enter question..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginBottom: '15px',
                                    borderRadius: '12px',
                                    border: '2px solid #f0f0f0',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    fontWeight: 500
                                }}
                            />

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: '10px'
                            }}>
                                {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                            placeholder={`Option ${optIndex + 1}`}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                border: q.answer === opt && opt !== '' ? '3px solid #48dbfb' : '2px solid #eee',
                                                background: q.answer === opt && opt !== '' ? '#e3f2fd' : 'white',
                                                fontSize: '0.9rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <div
                                            onClick={() => handleQuestionChange(qIndex, 'answer', opt)}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                marginTop: '6px',
                                                color: q.answer === opt ? '#48dbfb' : '#ccc',
                                                textAlign: 'right',
                                                fontWeight: 700,
                                                paddingRight: '5px'
                                            }}
                                        >
                                            {q.answer === opt ? '✅ Correct' : '⭕ Set Correct'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Action Button */}
                <div style={{
                    position: 'absolute',
                    bottom: 'clamp(20px, 5vw, 30px)',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none', // Let clicks pass through around button
                    padding: '0 20px'
                }}>
                    <button
                        className="clay-button"
                        style={{
                            pointerEvents: 'auto',
                            width: '100%',
                            maxWidth: '400px',
                            padding: '16px',
                            fontSize: '1.3rem',
                            fontWeight: 900,
                            background: '#CAFFBF',
                            color: '#2d3436',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                            borderRadius: '16px'
                        }}
                        onClick={handleStartQuiz}
                    >
                        Start Adventure! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizReview;
