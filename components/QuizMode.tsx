import React, { useState, useMemo } from 'react';
import { WordData } from '../types';

interface QuizModeProps {
  words: WordData[];
  onExit: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ words, onExit }) => {
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Generate Questions only once on mount
  const questions = useMemo(() => {
    // Shuffle words for questions
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    
    return shuffled.map((target) => {
      // Get 3 incorrect options (distractors)
      const distractors = words
        .filter((w) => w.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => ({ id: w.id, text: w.definition, isCorrect: false }));

      const correctOption = { id: target.id, text: target.definition, isCorrect: true };
      
      const options = [...distractors, correctOption].sort(() => 0.5 - Math.random());

      return {
        target,
        options
      };
    });
  }, [words]);

  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    if (selectedOption) return; // Prevent double clicking

    setSelectedOption(optionId);
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Quiz Complete!</h2>
        <p className="text-slate-600 mb-8">You scored <span className="font-bold text-indigo-600 text-xl">{score}</span> out of {questions.length}</p>
        
        <div className="w-full max-w-xs bg-slate-200 rounded-full h-3 mb-8 overflow-hidden">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(score / questions.length) * 100}%` }}
          />
        </div>

        <button
          onClick={onExit}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 text-sm font-medium">Quit Quiz</button>
        <div className="text-slate-400 text-sm font-mono">Question {currentQuestionIndex + 1} of {questions.length}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Select the correct meaning for</span>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">{currentQ.target.word}</h2>
          <p className="text-slate-500 font-mono text-sm">{currentQ.target.ipa}</p>
          
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-indigo-900 italic text-sm inline-block">
             Context: "{currentQ.target.example.replace(new RegExp(currentQ.target.word, 'gi'), '______')}"
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.isCorrect;
            
            // Determine styling based on state
            let btnClass = "p-4 rounded-xl border-2 text-left transition-all duration-200 relative ";
            if (selectedOption) {
              if (isCorrect) {
                btnClass += "bg-green-50 border-green-500 text-green-800";
              } else if (isSelected) {
                btnClass += "bg-red-50 border-red-500 text-red-800";
              } else {
                btnClass += "bg-white border-slate-100 text-slate-400 opacity-50";
              }
            } else {
              btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-700 cursor-pointer";
            }

            return (
              <button
                key={`${currentQuestionIndex}-${idx}`}
                disabled={!!selectedOption}
                onClick={() => handleAnswer(option.id, option.isCorrect)}
                className={btnClass}
              >
                <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold opacity-70">
                        {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizMode;