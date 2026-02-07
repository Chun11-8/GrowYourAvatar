import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
    id: string;
    question: string;
    options: string[];
    answer: string;
}

const ManualQuizInput: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>(
        Array.from({ length: 10 }, () => ({
            id: Math.random().toString(36).substr(2, 9),
            question: '',
            options: ['', '', '', ''],
            answer: ''
        }))
    );

    const handleQuestionTextChange = (id: string, value: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: value } : q));
    };

    const handleOptionChange = (qId: string, optIndex: number, value: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[optIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const handleAnswerSelect = (qId: string, optionValue: string) => {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, answer: optionValue } : q));
    };

    const handleSubmit = () => {
        // Validation: No unfilled fields
        const isValid = questions.every(q =>
            q.question.trim() !== '' &&
            q.options.every(opt => opt.trim() !== '') &&
            q.answer.trim() !== ''
        );

        if (!isValid) {
            alert('Please fill in all 10 questions, options, and select a correct answer for each!');
            return;
        }

        // Navigate to QuizReview with the questions
        navigate('/quiz-review', { state: { importedQuestions: questions } });
    };

    return (
        <div className="manual-quiz-container" style={{
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
            {/* Header Section (35%) */}
            <div style={{
                height: '35%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                color: 'white',
                paddingBottom: '20px',
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%), radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%)',
                backgroundColor: '#039BE5',
                backgroundPosition: '0 0, 25px 25px',
                backgroundSize: '50px 50px',
            }}>
                <button
                    onClick={() => navigate('/upload-quiz')}
                    style={{
                        position: 'absolute',
                        top: 'calc(env(safe-area-inset-top) + 20px)',
                        left: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '45px',
                        height: '45px',
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

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(2rem, 8vw, 3rem)',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                    }}>
                        Craft Quest ✍️
                    </h1>
                    <p style={{
                        margin: '5px',
                        fontSize: '1rem',
                        opacity: 0.9,
                        fontWeight: 500
                    }}>
                        Create 10 fun questions! Teacher should be the one to create the questions.
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
                {/* Scrollable Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '10px 5px 80px 5px', // Bottom padding for FAB
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    {questions.map((q, index) => (
                        <div key={q.id} style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            borderLeft: '5px solid #039BE5'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#546E7A', fontSize: '1rem', fontWeight: 700 }}>Question {index + 1}</h3>
                            <input
                                type="text"
                                placeholder="What is the question?"
                                value={q.question}
                                onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginBottom: '10px',
                                    borderRadius: '12px',
                                    border: '2px solid #E1F5FE',
                                    background: '#F9FAFB',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '8px'
                            }}>
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder={`Option ${optIdx + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(q.id, optIdx, e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                borderRadius: '10px',
                                                border: '2px solid',
                                                borderColor: q.answer === opt && opt !== '' ? '#039BE5' : '#E1F5FE',
                                                background: q.answer === opt && opt !== '' ? '#E1F5FE' : 'white',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <div
                                            onClick={() => opt.trim() !== '' && handleAnswerSelect(q.id, opt)}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                background: q.answer === opt && opt !== '' ? '#039BE5' : '#ECEFF1',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {q.answer === opt && opt !== '' ? '✓' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Submit Button */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    zIndex: 10
                }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            background: '#039BE5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            boxShadow: '0 10px 20px rgba(3, 155, 229, 0.3)',
                            cursor: 'pointer'
                        }}
                    >
                        Save & Play! 🚀
                    </button>
                </div>
            </div>
            <style>{`
                @media (min-width: 600px) {
                   .manual-quiz-container { max-width: 100%; margin: 0 auto; }
                }
            `}</style>
        </div>
    );
};

export default ManualQuizInput;
