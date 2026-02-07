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
        <div className="quiz-review-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#039BE5',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '"Fredoka", sans-serif',
            zIndex: 9999
        }}>
            {/* Header Section (20%) */}
            <div style={{
                height: '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                color: 'white',
                paddingBottom: '0px', // Removed padding to save space
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%), radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%)',
                backgroundColor: '#039BE5',
                backgroundPosition: '0 0, 25px 25px',
                backgroundSize: '50px 50px',
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
                        top: 'calc(env(safe-area-inset-top) + 10px)', // Slightly higher
                        left: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px', // Slightly smaller
                        height: '40px',
                        color: 'white',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ⬅️
                </button>

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', // Scaled down for 20% height
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                    }}>
                        Review Quest 🛡️
                    </h1>
                    {/* Hide subtitle on very small screens if needed, but keeping it small */}
                    <p style={{
                        margin: '2px 0 0 0',
                        fontSize: '0.9rem',
                        opacity: 0.9,
                        fontWeight: 500
                    }}>
                        Check your questions!
                    </p>
                </div>
            </div>

            {/* Bottom Sheet (65%) */}
            <div style={{
                flex: 1,
                background: '#E1F5FE',
                borderTopLeftRadius: '35px',
                borderTopRightRadius: '35px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
                overflow: 'hidden'
            }}>
                {/* Global Settings (Top of sheet) */}
                <div style={{
                    marginBottom: '15px',
                    padding: '15px',
                    background: 'white',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}>
                    <label style={{ fontWeight: 700, color: '#546E7A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⏳</span> Max Timer (s):
                    </label>
                    <input
                        type="number"
                        value={globalTimer}
                        onChange={(e) => handleGlobalTimerChange(parseInt(e.target.value) || 0)}
                        style={{
                            width: '70px',
                            padding: '10px',
                            borderRadius: '12px',
                            border: '2px solid #E1F5FE',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            outline: 'none',
                            color: '#37474F'
                        }}
                        max={60}
                        min={5}
                    />
                </div>

                {/* Scrollable Question List */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    overflowY: 'auto',
                    flex: 1,
                    padding: '5px',
                    paddingBottom: '90px' // Space for floating button
                }}>
                    {questions.map((q, qIndex) => (
                        <div key={q.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            position: 'relative',
                            borderLeft: '5px solid #039BE5'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, color: '#039BE5', fontSize: '1.1rem' }}>Q{qIndex + 1}</span>
                                <div style={{ fontSize: '0.9rem', color: '#78909C', display: 'flex', alignItems: 'center', gap: '5px', background: '#F5F5F5', padding: '5px 10px', borderRadius: '10px' }}>
                                    ⏱️ <input
                                        type="number"
                                        value={q.timer}
                                        onChange={(e) => handleQuestionChange(qIndex, 'timer', parseInt(e.target.value))}
                                        style={{ width: '40px', padding: '2px', borderRadius: '4px', border: 'none', background: 'transparent', fontWeight: 'bold', color: '#546E7A', textAlign: 'center' }}
                                        max={60}
                                    />s
                                </div>
                            </div>

                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                placeholder="Enter question..."
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    marginBottom: '15px',
                                    borderRadius: '15px',
                                    border: '2px solid #E1F5FE',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                    fontWeight: 600,
                                    outline: 'none',
                                    color: '#37474F'
                                }}
                            />

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: '10px'
                            }}>
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, optIdx, e.target.value)}
                                            placeholder={`Option ${optIdx + 1}`}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: q.answer === opt && opt !== '' ? '3px solid #039BE5' : '2px solid #E1F5FE',
                                                background: q.answer === opt && opt !== '' ? '#E1F5FE' : 'white',
                                                fontSize: '0.9rem',
                                                boxSizing: 'border-box',
                                                outline: 'none',
                                                fontWeight: 500
                                            }}
                                        />
                                        <div
                                            onClick={() => handleQuestionChange(qIndex, 'answer', opt)}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                marginTop: '8px',
                                                color: q.answer === opt ? '#039BE5' : '#B0BEC5',
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

                {/* Floating Start Button */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    zIndex: 10
                }}>
                    <button
                        onClick={handleStartQuiz}
                        style={{
                            width: '100%',
                            padding: '18px',
                            fontSize: '1.3rem',
                            fontWeight: 900,
                            background: '#039BE5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            boxShadow: '0 10px 20px rgba(3, 155, 229, 0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        Start Adventure! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizReview;
