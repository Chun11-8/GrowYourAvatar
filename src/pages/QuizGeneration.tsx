import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizFromText } from '../services/gemini';

const QuizGeneration: React.FC = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');

        try {
            const questions = await generateQuizFromText(prompt);
            console.log("Generated Questions:", questions);
            // Navigate to ManualQuizInput but with pre-filled state
            // We assume ManualQuizInput can accept state `initialQuestions`
            // If not, we might need to modify it or store it in context/storage
            // For now, let's pass it via state
            navigate('/quiz-review', { state: { importedQuestions: questions } });
        } catch (err: any) {
            console.error(err);
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-fullscreen" style={{
            minHeight: '100dvh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e0f7fa 100%)',
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
                position: 'relative',
                background: 'rgba(255,255,255,0.8)'
            }}>
                {/* Header with Back Button */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <button
                        className="clay-button secondary"
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.9rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <span>←</span> Back
                    </button>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    flex: '0 0 auto'
                }}>
                    <div style={{ fontSize: 'clamp(3rem, 10vw, 4rem)', marginBottom: '0.5rem' }}>✨</div>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
                        color: '#6ab04c',
                        margin: '0 0 0.5rem 0',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                        lineHeight: 1.2
                    }}>AI Quiz Creator</h1>
                    <p style={{
                        fontSize: 'clamp(0.95rem, 4vw, 1.2rem)',
                        color: '#7f8c8d',
                        maxWidth: '500px',
                        margin: '0 auto',
                        lineHeight: 1.4
                    }}>
                        Type a topic or paste text, and AI will create the questions for you!
                    </p>
                </div>

                <div className="clay-card" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'clamp(1rem, 4vw, 2rem)',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                }}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a topic (e.g., 'Solar System', 'Basic Math') or paste some text here..."
                        style={{
                            width: '100%',
                            flex: 1,
                            minHeight: '150px',
                            padding: '1.2rem',
                            border: '3px solid #eee',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            resize: 'none',
                            outline: 'none',
                            marginBottom: '1.5rem',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                            background: '#fcfcfc',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#CAFFBF'}
                        onBlur={(e) => e.target.style.borderColor = '#eee'}
                    />

                    {error && (
                        <div style={{
                            color: '#ff6b6b',
                            background: '#ffeaa7',
                            padding: '12px',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            fontWeight: 500
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        className="clay-button"
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        style={{
                            width: '100%',
                            background: isLoading || !prompt.trim() ? '#eee' : '#CAFFBF',
                            color: isLoading || !prompt.trim() ? '#aaa' : '#2d3436',
                            fontSize: 'clamp(1.1rem, 5vw, 1.4rem)',
                            padding: '16px',
                            borderRadius: '16px',
                            fontWeight: 800,
                            boxShadow: isLoading || !prompt.trim() ? 'none' : '0 10px 20px rgba(0,255,100,0.2)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                ⚙️ Generating...
                            </span>
                        ) : 'Generate Quiz 🪄'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizGeneration;
