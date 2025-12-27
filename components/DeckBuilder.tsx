import React, { useState } from 'react';
import { Icons } from '../constants';
import { processVocabularyList } from '../services/gemini';
import { Deck, WordData } from '../types';

interface DeckBuilderProps {
  onDeckCreated: (deck: Deck) => void;
  onCancel: () => void;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ onDeckCreated, onCancel }) => {
  const [deckName, setDeckName] = useState('');
  const [rawWords, setRawWords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!deckName.trim() || !rawWords.trim()) {
      setError("Please provide both a deck name and a list of words.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const processedWords = await processVocabularyList(rawWords);
      
      const newDeck: Deck = {
        id: `deck_${Date.now()}`,
        name: deckName,
        isSystem: false,
        words: processedWords,
      };

      onDeckCreated(newDeck);
    } catch (err: any) {
      setError(err.message || "An error occurred while communicating with the AI Agent.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Icons.Sparkles />
        <span>New Vocabulary Deck</span>
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deck Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g., Technology Words, Chapter 1..."
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Vocabulary List</label>
          <p className="text-xs text-slate-500 mb-2">Enter words separated by commas or new lines.</p>
          <textarea
            className="w-full px-4 py-2 h-40 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            placeholder="apple, ephemeral, serendipity..."
            value={rawWords}
            onChange={(e) => setRawWords(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing with AI...</span>
              </>
            ) : (
              <span>Create Deck</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
