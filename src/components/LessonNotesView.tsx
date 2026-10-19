'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Clock, Lightbulb, AlertTriangle, Brain } from 'lucide-react';
import { SECTIONS } from '@/types';
import type { SectionCode, LessonNote } from '@/types';
import { cn } from '@/lib/utils';
import lessonNotesData from '@/data/lessonNotes.json';

export function LessonNotesView() {
  const [selectedSection, setSelectedSection] = useState<SectionCode | 'all'>('all');
  const [selectedNote, setSelectedNote] = useState<LessonNote | null>(null);

  const notes = lessonNotesData.notes as LessonNote[];

  const filteredNotes = useMemo(() => {
    if (selectedSection === 'all') return notes;
    return notes.filter((n) => n.section === selectedSection);
  }, [notes, selectedSection]);

  if (selectedNote) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedNote(null)}
          className="text-sm text-muted hover:text-fg transition-colors"
        >
          ← Back to all notes
        </button>

        <div className="card p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge badge-${selectedNote.section}`}>
                  {selectedNote.section}
                </span>
                {selectedNote.ifrsStandard && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[color:rgb(var(--accent-soft))] text-[color:rgb(var(--accent))]">
                    {selectedNote.ifrsStandard}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold">{selectedNote.title}</h1>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted">
              <Clock className="w-4 h-4" />
              <span>{selectedNote.readTimeMinutes} min</span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-[color:rgb(var(--accent))]" />
                <h2 className="text-lg font-semibold">Quick Summary</h2>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-fg leading-relaxed">{selectedNote.quickSummary.coreConcept}</p>
              </div>
              {selectedNote.quickSummary.keyFormulas.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Key Formulas & Mechanics</h3>
                  <ul className="space-y-2">
                    {selectedNote.quickSummary.keyFormulas.map((formula, i) => (
                      <li
                        key={i}
                        className="text-sm font-mono bg-surface-alt p-3 rounded-lg border border-line"
                      >
                        {formula}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-[color:rgb(var(--accent))]" />
                <h2 className="text-lg font-semibold">Tricks & Memory Aids</h2>
              </div>

              {selectedNote.tricksAndMemoryAids.commonExamTraps.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-medium">Common Exam Traps</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedNote.tricksAndMemoryAids.commonExamTraps.map((trap, i) => (
                      <li key={i} className="text-sm pl-4 relative">
                        <span className="absolute left-0 text-amber-500">•</span>
                        {trap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNote.tricksAndMemoryAids.mnemonics.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <h3 className="text-sm font-medium">Mnemonics & Shortcuts</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedNote.tricksAndMemoryAids.mnemonics.map((m, i) => (
                      <div key={i} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                        <div className="font-semibold text-purple-400 text-sm mb-1">{m.name}</div>
                        <div className="text-sm text-fg">{m.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNote.tricksAndMemoryAids.mustMemorizeRules.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Must-Memorize Rules</h3>
                  <ul className="space-y-1.5">
                    {selectedNote.tricksAndMemoryAids.mustMemorizeRules.map((rule, i) => (
                      <li key={i} className="text-sm pl-4 relative">
                        <span className="absolute left-0 text-green-500">✓</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Lesson Notes</h1>
        <p className="text-muted text-sm">
          Quick-read summaries (5-10 min) with memory aids for ACCA F7 topics
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSection('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
            selectedSection === 'all'
              ? 'border-[color:rgb(var(--accent))] bg-[color:rgb(var(--accent-soft))] text-[color:rgb(var(--accent))]'
              : 'border-line hover:border-[color:rgb(var(--accent))]'
          )}
        >
          All Sections
        </button>
        {Object.entries(SECTIONS).map(([code, meta]) => (
          <button
            key={code}
            onClick={() => setSelectedSection(code as SectionCode)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
              selectedSection === code
                ? 'border-[color:rgb(var(--accent))] bg-[color:rgb(var(--accent-soft))] text-[color:rgb(var(--accent))]'
                : 'border-line hover:border-[color:rgb(var(--accent))]'
            )}
          >
            <span className={`badge badge-${code} mr-1.5`}>{code}</span>
            {meta.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => setSelectedNote(note)}
            className="card p-5 text-left hover:border-[color:rgb(var(--accent))] transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`badge badge-${note.section}`}>{note.section}</span>
                {note.ifrsStandard && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[color:rgb(var(--accent-soft))] text-[color:rgb(var(--accent))]">
                    {note.ifrsStandard}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                <span>{note.readTimeMinutes} min</span>
              </div>
            </div>
            <h3 className="font-semibold mb-2">{note.title}</h3>
            <p className="text-sm text-muted line-clamp-2">
              {note.quickSummary.coreConcept}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <span>{note.tricksAndMemoryAids.mnemonics.length} mnemonics</span>
              <span>•</span>
              <span>{note.tricksAndMemoryAids.commonExamTraps.length} exam traps</span>
            </div>
          </button>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 text-muted">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No lesson notes available for this section yet.</p>
        </div>
      )}
    </div>
  );
}
