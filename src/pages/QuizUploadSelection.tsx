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
        <div className="quiz-upload-container" style={{
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
                    onClick={() => navigate(-1)}
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
                    <div style={{ fontSize: '3rem', marginBottom: '5px' }}>📸</div>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                    }}>
                        Upload Source
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '1rem',
                        opacity: 0.9,
                        fontWeight: 500
                    }}>
                        Snap a pic or upload a file!
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
                cursor: 'pointer',
                flexDirection: 'column',
                padding: '30px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)'
            }}>
                {isLoading ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        borderRadius: '25px',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <div className="animate-bounce" style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#546E7A', margin: '0 0 10px 0' }}>Analyzing Magic...</h3>
                        <p style={{ color: '#78909C' }}>Extracting challenges for you...</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        flex: 1
                    }}>
                        {error && (
                            <div style={{
                                color: '#e74c3c',
                                background: '#ffdad9',
                                padding: '15px',
                                borderRadius: '15px',
                                textAlign: 'center',
                                fontWeight: 600,
                                border: '2px solid #ffcccc'
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <label style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
                            borderRadius: '25px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(255, 154, 158, 0.3)',
                            transition: 'transform 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🖼️</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Photo Library</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>From your gallery</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>

                        <label style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
                            borderRadius: '25px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(161, 140, 209, 0.3)',
                            transition: 'transform 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <span style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Document</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>PDF, Word, Text</span>
                            <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizUploadSelection;
