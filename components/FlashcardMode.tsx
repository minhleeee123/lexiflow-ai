import React, { useState, useEffect, useCallback } from 'react';
import { WordData } from '../types';
import { Icons } from '../constants';

interface FlashcardModeProps {
  words: WordData[];
  onExit: () => void;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ words, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  // Animation states
  const [animPhase, setAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const currentWord = words[currentIndex];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-audio on switch - only when idle (animation finished)
  useEffect(() => {
    if (autoPlayEnabled && !isFlipped && animPhase === 'idle') {
      const timer = setTimeout(() => {
        speak(currentWord.word);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord, autoPlayEnabled, isFlipped, animPhase]);

  const triggerTransition = useCallback((dir: 'next' | 'prev') => {
    if (animPhase !== 'idle') return;

    setDirection(dir);
    setAnimPhase('exiting');

    // Wait for exit animation to finish
    setTimeout(() => {
      // Logic to update index
      if (dir === 'next') {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
      }
      
      // Reset card state for the new card
      setIsFlipped(false);
      setAnimPhase('entering');

      // Small delay to allow DOM to render the "entering" state (off-screen)
      // before transitioning to "idle" (on-screen)
      setTimeout(() => {
        setAnimPhase('idle');
      }, 50);

    }, 300); // Matches CSS duration
  }, [animPhase, words.length]);

  const handleNext = useCallback(() => triggerTransition('next'), [triggerTransition]);
  const handlePrev = useCallback(() => triggerTransition('prev'), [triggerTransition]);

  const toggleFlip = useCallback(() => {
    if (animPhase === 'idle') {
      setIsFlipped(prev => !prev);
    }
  }, [animPhase]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (animPhase !== 'idle') return;

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        toggleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, handleNext, handlePrev, animPhase]);

  // Calculate generic transform classes based on state
  const getTransitionClass = () => {
    const base = "transition-all duration-300 ease-in-out transform w-full max-w-md";
    
    if (animPhase === 'idle') {
      return `${base} opacity-100 translate-x-0 scale-100 rotate-0`;
    }

    // Next: Slide out left, slide in from right
    if (direction === 'next') {
      if (animPhase === 'exiting') return `${base} opacity-0 -translate-x-16 -rotate-6 scale-95`;
      if (animPhase === 'entering') return `${base} opacity-0 translate-x-16 rotate-6 scale-95`;
    } 
    // Prev: Slide out right, slide in from left
    else {
      if (animPhase === 'exiting') return `${base} opacity-0 translate-x-16 rotate-6 scale-95`;
      if (animPhase === 'entering') return `${base} opacity-0 -translate-x-16 -rotate-6 scale-95`;
    }
    return base;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto overflow-hidden px-4">
      {/* Header Controls */}
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <div className="text-slate-400 text-sm font-mono">
          {currentIndex + 1} / {words.length}
        </div>
        <button
          onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
          className={`p-2 rounded-full transition-colors ${autoPlayEnabled ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
          title="Toggle Auto-Audio"
        >
          <Icons.Speaker />
        </button>
      </div>

      {/* Card Container Wrapper for Transition */}
      <div className={getTransitionClass()}>
        <div className="perspective-1000 w-full h-96 cursor-pointer group" onClick={toggleFlip}>
          <div
            className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wide mb-6">
                {currentWord.pos}
              </span>
              <h2 className="text-4xl font-bold text-slate-800 mb-2">{currentWord.word}</h2>
              <p className="text-slate-500 font-mono text-lg">{currentWord.ipa}</p>
              <div className="absolute bottom-6 text-xs text-slate-400 font-medium uppercase tracking-widest">
                Tap (or Space) to Flip
              </div>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 text-white rounded-2xl flex flex-col items-center justify-center p-8">
              <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-indigo-100 mb-2 uppercase tracking-wide text-xs text-left w-full">Meaning (Tiếng Việt)</h3>
                  <p className="text-xl font-medium leading-relaxed mb-6 text-left">
                    {currentWord.definition}
                  </p>
                  
                  <h3 className="text-lg font-semibold text-indigo-100 mb-2 uppercase tracking-wide text-xs text-left w-full">Example</h3>
                  <p className="text-indigo-100 italic text-left border-l-2 border-indigo-400 pl-4">
                    "{currentWord.example}"
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-md transition-all font-medium text-slate-700"
        >
          Previous
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 hover:shadow-lg transition-all font-medium"
        >
          Next Card
        </button>
      </div>
      
      <p className="mt-6 text-slate-400 text-xs text-center font-mono">
        Hotkeys: <span className="font-bold border border-slate-300 rounded px-1">Space</span> Flip &nbsp; 
        <span className="font-bold border border-slate-300 rounded px-1">←</span> Prev &nbsp;
        <span className="font-bold border border-slate-300 rounded px-1">→</span> Next
      </p>
    </div>
  );
};

export default FlashcardMode;