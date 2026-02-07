import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizFromImage } from '../services/gemini';

const QuizUploadSelection: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError('');

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                // Determine if image (simple check)

                //Actual Implementation line below
                //const isImage = file.type.startsWith('image/');

                // For now, simpler implementation: treat everything that FileReader reads as potential input for Vision
                // Gemini 1.5 Flash supports PDF via base64 as well in the prompt, or images
                // The service `generateQuizFromImage` handles base64.

                const questions = await generateQuizFromImage(base64String);
                console.log("Generated Questions from File:", questions);

                navigate('/quiz-review', { state: { importedQuestions: questions } });

            } catch (err: any) {
                console.error(err);
                setError('Failed to process file. Ensure it is a clear image or supported document.');
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError('Failed to read file.');
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="page-fullscreen" style={{
            minHeight: '100dvh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF 100%)',
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
                background: 'rgba(255,255,255,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button
                        className="clay-button secondary"
                        onClick={() => navigate(-1)}
                        style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '12px' }}
                    >
                        ← Back
                    </button>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    marginBottom: '2rem',
                    flex: '0 0 auto'
                }}>
                    <div style={{
                        fontSize: 'clamp(4rem, 15vw, 6rem)',
                        marginBottom: '10px',
                        filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))'
                    }}>📸</div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 8vw, 3rem)',
                        color: '#FFADAD',
                        margin: '0 0 10px 0',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.05)'
                    }}>Upload Source</h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                        color: '#7f8c8d',
                        maxWidth: '400px',
                        margin: '0 auto',
                        lineHeight: 1.4
                    }}>
                        Snap a photo or upload a file to magically create a quest!
                    </p>
                </div>

                {isLoading ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '20px',
                        padding: '2rem'
                    }}>
                        <div className="animate-bounce" style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#555', margin: 0 }}>Analyzing Magic...</h3>
                        <p style={{ color: '#888' }}>Extracting challenges for you...</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(15px, 3vh, 25px)',
                        width: '100%',
                        maxWidth: '500px',
                        margin: '0 auto',
                        flex: 1,
                        justifyContent: 'center'
                    }}>
                        {error && (
                            <div style={{
                                color: '#ff6b6b',
                                background: '#fff0f0',
                                padding: '15px',
                                borderRadius: '15px',
                                textAlign: 'center',
                                border: '2px solid #ffcccc'
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <label className="clay-button" style={{
                            background: '#FFADAD',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'clamp(20px, 5vh, 40px)',
                            borderRadius: '25px',
                            transition: 'transform 0.2s',
                            boxShadow: '0 10px 20px rgba(255, 173, 173, 0.3)'
                        }}>
                            <span style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '10px' }}>🖼️</span>
                            <span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', fontWeight: 800 }}>Photo Library</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '5px' }}>From your gallery</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>

                        <label className="clay-button" style={{
                            background: '#A0C4FF',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'clamp(20px, 5vh, 40px)',
                            borderRadius: '25px',
                            transition: 'transform 0.2s',
                            boxShadow: '0 10px 20px rgba(160, 196, 255, 0.3)'
                        }}>
                            <span style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '10px' }}>📄</span>
                            <span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', fontWeight: 800 }}>Document</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '5px' }}>PDF, Word, Text</span>
                            <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizUploadSelection;
