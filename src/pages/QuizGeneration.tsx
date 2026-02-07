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
        <div className="quiz-gen-container" style={{
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
                    <div style={{ fontSize: '3rem', marginBottom: '5px' }}>✨</div>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                    }}>
                        AI Magic
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '1rem',
                        opacity: 0.9,
                        fontWeight: 500
                    }}>
                        Prompt the AI to create a quest!
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
                padding: '30px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)'
            }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. 'Solar System facts for kids', 'Dinosaurs', 'Math addition tables'..."
                        style={{
                            width: '100%',
                            flex: 1,
                            padding: '20px',
                            border: 'none',
                            borderRadius: '25px',
                            fontSize: '1.1rem',
                            resize: 'none',
                            outline: 'none',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                            background: 'white',
                            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
                            color: '#37474F'
                        }}
                    />

                    {error && (
                        <div style={{
                            color: '#e74c3c',
                            background: '#ffdad9',
                            padding: '12px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            fontWeight: 600
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        style={{
                            width: '100%',
                            padding: '18px',
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            background: isLoading || !prompt.trim() ? '#B0BEC5' : '#039BE5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            boxShadow: isLoading || !prompt.trim() ? 'none' : '0 10px 20px rgba(3, 155, 229, 0.3)',
                            cursor: isLoading || !prompt.trim() ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? '🔮 Generating...' : 'Generate Quest 🪄'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizGeneration;
