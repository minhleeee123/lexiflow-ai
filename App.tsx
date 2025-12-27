import React, { useState } from 'react';
import { Deck, AppMode } from './types';
import { SYSTEM_DECK, Icons } from './constants';
import DeckBuilder from './components/DeckBuilder';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import ReadingMode from './components/ReadingMode';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [decks, setDecks] = useState<Deck[]>([SYSTEM_DECK]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  const activeDeck = decks.find((d) => d.id === selectedDeckId);

  const handleCreateDeck = (newDeck: Deck) => {
    setDecks([...decks, newDeck]);
    setMode(AppMode.DASHBOARD);
  };

  const startSession = (deckId: string, targetMode: AppMode) => {
    setSelectedDeckId(deckId);
    setMode(targetMode);
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">LexiFlow AI</h1>
        <p className="text-slate-500">Master English vocabulary with generative context.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Deck Card */}
        <button
          onClick={() => setMode(AppMode.DECK_BUILDER)}
          className="group flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 min-h-[250px]"
        >
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icons.Plus />
          </div>
          <h3 className="font-semibold text-slate-900">Create New Deck</h3>
          <p className="text-sm text-slate-500 mt-2 text-center">Import words & use AI to generate definitions</p>
        </button>

        {/* Render Existing Decks */}
        {decks.map((deck) => (
          <div key={deck.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow min-h-[250px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${deck.isSystem ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {deck.isSystem ? 'System Deck' : 'Custom Deck'}
                </span>
                <span className="text-slate-400 text-xs font-mono">{deck.words.length} words</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{deck.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                Contains: {deck.words.slice(0, 3).map(w => w.word).join(', ')}...
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => startSession(deck.id, AppMode.FLASHCARDS)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Icons.Cards />
                Study Flashcards
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => startSession(deck.id, AppMode.QUIZ)}
                  className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Puzzle /> Quiz
                </button>
                <button
                  onClick={() => startSession(deck.id, AppMode.READING)}
                  className="py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.BookOpen /> Reading
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar placeholder if needed, usually cleaner without for simple tools */}
      
      <main className="py-8">
        {mode === AppMode.DASHBOARD && renderDashboard()}
        
        {mode === AppMode.DECK_BUILDER && (
          <DeckBuilder 
            onDeckCreated={handleCreateDeck} 
            onCancel={() => setMode(AppMode.DASHBOARD)} 
          />
        )}

        {mode === AppMode.FLASHCARDS && activeDeck && (
          <FlashcardMode 
            words={activeDeck.words} 
            onExit={() => setMode(AppMode.DASHBOARD)} 
          />
        )}

        {mode === AppMode.QUIZ && activeDeck && (
          <QuizMode 
            words={activeDeck.words} 
            onExit={() => setMode(AppMode.DASHBOARD)} 
          />
        )}

        {mode === AppMode.READING && activeDeck && (
          <ReadingMode 
            words={activeDeck.words} 
            onExit={() => setMode(AppMode.DASHBOARD)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
