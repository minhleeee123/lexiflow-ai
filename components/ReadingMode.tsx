import React, { useState } from 'react';
import { WordData, ReadingSessionData } from '../types';
import { generateReadingSession } from '../services/gemini';
import { Icons } from '../constants';

interface ReadingModeProps {
  words: WordData[];
  onExit: () => void;
}

const ReadingMode: React.FC<ReadingModeProps> = ({ words, onExit }) => {
  const [level, setLevel] = useState('B1');
  const [sessionData, setSessionData] = useState<ReadingSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateReadingSession(words, level);
      setSessionData(data);
      setQuizAnswers(new Array(data.questions.length).fill(-1));
    } catch (err: any) {
      setError(err.message || "Failed to generate story.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSelect = (qIndex: number, optionIndex: number) => {
    if (showResults) return;
    const newAnswers = [...quizAnswers];
    newAnswers[qIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const calculateScore = () => {
    if (!sessionData) return 0;
    return quizAnswers.reduce((acc, ans, idx) => {
      return ans === sessionData.questions[idx].correctAnswerIndex ? acc + 1 : acc;
    }, 0);
  };

  // Helper to parse text and inject tooltips
  const renderInteractiveText = (content: string) => {
    // Split by {{ and }}
    const parts = content.split(/(\{\{.*?\}\})/g);
    
    return (
      <p className="text-lg leading-loose text-slate-800 font-serif">
        {parts.map((part, index) => {
          if (part.startsWith('{{') && part.endsWith('}}')) {
            const cleanWord = part.slice(2, -2);
            // Find metadata
            const wordData = words.find(w => w.word.toLowerCase() === cleanWord.toLowerCase());
            
            // If we can't find exact match (e.g. conjugation), we still render the word, maybe without specific data or generic styling
            // Ideally Agent 1 would handle lemmas, but for this demo, we do a best effort match
            // OR we just use the cleanWord as label.
            
            return (
              <span key={index} className="relative group cursor-help inline-block mx-1">
                <span className="border-b-2 border-indigo-300 bg-indigo-50 px-1 rounded text-indigo-900 font-semibold group-hover:bg-indigo-100 transition-colors">
                  {cleanWord}
                </span>
                
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                  {wordData ? (
                    <>
                      <div className="flex justify-between items-baseline mb-1">
                         <span className="font-bold text-base">{wordData.word}</span>
                         <span className="text-slate-400 font-mono text-xs">{wordData.ipa}</span>
                      </div>
                      <div className="text-indigo-300 text-xs uppercase font-bold mb-1">{wordData.pos}</div>
                      <div>{wordData.definition}</div>
                    </>
                  ) : (
                    <span>Definition not available for this variation.</span>
                  )}
                  {/* Arrow */}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></span>
                </span>
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  if (!sessionData) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
         <div className="mb-6 flex justify-center text-indigo-600"><Icons.BookOpen /></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">AI Reading Generator</h2>
        <p className="text-slate-600 mb-8">
          Generate a unique story using your {words.length} vocabulary words at your preferred difficulty level.
        </p>

        <div className="flex justify-center items-center gap-4 mb-8">
          <label className="font-medium text-slate-700">Difficulty Level:</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex gap-4 justify-center">
            <button onClick={onExit} className="px-4 py-2 text-slate-500 hover:text-slate-800">Cancel</button>
            <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
            {isLoading ? (
                <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Story...</span>
                </>
            ) : (
                'Generate Story'
            )}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
        <button onClick={onExit} className="mb-6 text-slate-500 hover:text-slate-800 text-sm font-medium">← Back to Dashboard</button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reading Passage */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6 font-serif">{sessionData.title}</h1>
                    {renderInteractiveText(sessionData.content)}
                </div>
            </div>

            {/* Comprehension Questions */}
            <div className="lg:col-span-1">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Icons.Puzzle />
                        <span>Comprehension</span>
                    </h3>
                    
                    <div className="space-y-6">
                        {sessionData.questions.map((q, idx) => (
                            <div key={idx} className="space-y-2">
                                <p className="text-sm font-medium text-slate-800">{idx + 1}. {q.question}</p>
                                <div className="space-y-1">
                                    {q.options.map((opt, optIdx) => {
                                        let bgClass = "bg-white border-slate-200 hover:bg-white hover:border-indigo-300";
                                        if (showResults) {
                                            if (optIdx === q.correctAnswerIndex) bgClass = "bg-green-100 border-green-500 text-green-800 font-medium";
                                            else if (quizAnswers[idx] === optIdx) bgClass = "bg-red-50 border-red-300 text-red-800";
                                            else bgClass = "bg-slate-100 border-slate-200 text-slate-400";
                                        } else if (quizAnswers[idx] === optIdx) {
                                            bgClass = "bg-indigo-50 border-indigo-500 text-indigo-900";
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleQuizSelect(idx, optIdx)}
                                                disabled={showResults}
                                                className={`w-full text-left text-xs p-2 rounded border ${bgClass} transition-colors`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!showResults ? (
                        <button
                            onClick={() => setShowResults(true)}
                            disabled={quizAnswers.includes(-1)}
                            className="w-full mt-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                        >
                            Check Answers
                        </button>
                    ) : (
                        <div className="mt-6 text-center">
                            <p className="text-lg font-bold text-slate-800 mb-2">Score: {calculateScore()}/{sessionData.questions.length}</p>
                            <button onClick={() => setSessionData(null)} className="text-indigo-600 text-sm font-medium hover:underline">Generate New Story</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ReadingMode;
