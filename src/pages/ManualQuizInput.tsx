import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
    id: number;
    text: string;
    optionA: string;
    optionB: string;
    correct: 'A' | 'B';
}

const ManualQuizInput: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>(
        Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            text: '',
            optionA: '',
            optionB: '',
            correct: 'A'
        }))
    );

    const handleChange = (id: number, field: keyof Question, value: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleSubmit = () => {
        // In a real app, we would save these questions
        console.log('Saved Questions:', questions);
        navigate('/game-hub');
    };

    return (
        <div className="quiz-input-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
            <div className="clay-container" style={{ background: '#f8f9fa' }}>
                <button
                    className="clay-button secondary"
                    onClick={() => navigate('/upload-quiz')}
                    style={{ float: 'left' }}
                >
                    ← Back
                </button>
                <div style={{ clear: 'both' }}></div>

                <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#4A90E2', margin: '20px 0' }}>Creating Your Quest! ✍️</h1>
                <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>Fill in 5 fun questions for your game!</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {questions.map((q) => (
                        <div key={q.id} className="clay-card" style={{ background: 'white', padding: '20px', borderLeft: '8px solid #FFD6A5' }}>
                            <h3 style={{ marginBottom: '15px' }}>Question {q.id}</h3>
                            <input
                                type="text"
                                placeholder="e.g. What color is the sky?"
                                value={q.text}
                                onChange={(e) => handleChange(q.id, 'text', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '15px',
                                    borderRadius: '10px',
                                    border: '2px solid #eee',
                                    fontSize: '1rem'
                                }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Option A</label>
                                    <input
                                        type="text"
                                        placeholder="Option A"
                                        value={q.optionA}
                                        onChange={(e) => handleChange(q.id, 'optionA', e.target.value)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '2px solid #eee' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Option B</label>
                                    <input
                                        type="text"
                                        placeholder="Option B"
                                        value={q.optionB}
                                        onChange={(e) => handleChange(q.id, 'optionB', e.target.value)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '2px solid #eee' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="clay-button"
                    style={{
                        width: '100%',
                        marginTop: '40px',
                        padding: '15px',
                        fontSize: '1.2rem',
                        background: '#CAFFBF',
                        color: '#333'
                    }}
                    onClick={handleSubmit}
                >
                    Save & Play! 🚀
                </button>
            </div>
        </div>
    );
};

export default ManualQuizInput;
