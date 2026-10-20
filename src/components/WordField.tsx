// WordField — TAGS FROM HIS OWN WORDS (Arman in the terminal, 2026-10-09 14:36–14:39: "when the user is entering an already used term, the device
// recognizes that and records it as the same, kinda like how tags work" — he chose "Tags from my own words"; the designer's 14:40 form; the
// mothership's 14:42: within Δ80, no stop). Wherever he types a word of his lexicon — the box's word, `+ a mode`, a decision's word, a rule's word —
// a small list opens under the field as he types: HIS OWN words that begin with what he has typed, exactly as spelled, in alphabetical order —
// never ranked by use or likelihood, never the casts' relation words (they are not his words until he uses one), never IS or ≡. NOTHING IS CHOSEN
// FOR HIM: no item is highlighted until he moves to it (arrows) or clicks it; Enter with nothing highlighted keeps what he typed; Escape or leaving
// the field closes the list; picking an item puts that word in the field exactly. No list on an empty field, none when nothing matches. NOTHING
// MERGES (D22): two spellings stay two words until he says otherwise — this offers, it never merges. Showing his own words back is his record, not
// the device's proposal (Δ80 holds for CONTENT: no relating, pair, sign or ranking is ever proposed).
import { useState, type InputHTMLAttributes, type KeyboardEvent } from 'react';
import { isReservedWord } from '../lib/relatings';

/** the words offered for what he has typed: his own words that BEGIN with it, exactly as spelled (case kept), alphabetical, each once — never IS or ≡,
 * never the typed word itself (it needs no offer); none on an empty field */
export function wordsOffered(words: readonly string[], typed: string): string[] {
  if (typed.length === 0) return [];
  return [...new Set(words)].filter((w) => w !== typed && !isReservedWord(w) && w.startsWith(typed)).sort((a, b) => a.localeCompare(b));
}

/** THE NORM'S LINE (ADR 0031 §9.50–§9.53, reworded under §9.64 (1) — a way is a transformation by its channel; Arman's word Δ216; the designer's 10-20 13:02, her
 * 14:11 form kept — SLICE 3 · A): one sentence wherever a word NEW to him is being chosen as a WAY — the same whatever was typed; never a refusal, holding back no act,
 * counting nothing; the device reads nothing by it (§9.52). Its old second half (Δ183 "it keeps them apart") is dropped, not replaced: under §9.64 (1) every word
 * keeps its two ends two and only ≡ says the same, so it marked off nothing */
export const NORM_LINE = 'a word here names a way the first is turned into the second, by its channel';
/** a word new to him: not empty, not IS or ≡, not among the words the field offers (his own) — the one predicate for `· a new word` and for the norm's line */
export const isNewWord = (typed: string, words: readonly string[]): boolean => { const t = typed.trim(); return t.length > 0 && !isReservedWord(t) && !words.includes(t); };
/** the line itself — a row of its own under the field's line (a full row in a wrapping line, a row of a grid), in the drawers' muted ink; no glyph, no link,
 * nothing pressable; shown while `when` (the caller's new-word predicate) holds, gone once the word is his or the act is done (14:11: once per new word). The
 * field sits mid-sentence (`T [a word] F · holds`), so the line cannot stand inside it: every field mounts it under its line, and the norm witness counts the
 * fields against the mounts, file by file, so no field can forget it */
export function NewWordNorm({ when, at }: { when: boolean; at: string }) {
  return when ? <span data-new-word-norm={at} className="basis-full text-stone-400">{NORM_LINE}</span> : null;
}

type FieldAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & Record<`data-${string}`, string | undefined>;

/** the field: an input carrying the caller's own attributes (its data-* hooks, its class, its placeholder), with the offer list under it */
export function WordField({ value, onChange, words, field }: { value: string; onChange: (v: string) => void; words: readonly string[]; field: FieldAttrs }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const offered = open ? wordsOffered(words, value) : [];
  const close = (): void => { setOpen(false); setHi(-1); };
  const pick = (w: string): void => { onChange(w); close(); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (offered.length > 0 && e.key === 'ArrowDown') { e.preventDefault(); setHi(Math.min(hi + 1, offered.length - 1)); return; }
    if (offered.length > 0 && e.key === 'ArrowUp') { e.preventDefault(); setHi(Math.max(hi - 1, -1)); return; }
    if (e.key === 'Enter' && hi >= 0 && hi < offered.length) { e.preventDefault(); e.stopPropagation(); pick(offered[hi]); return; }
    if (e.key === 'Escape' && open) { e.stopPropagation(); close(); return; }
    field.onKeyDown?.(e); // Enter with nothing highlighted keeps what he typed: the field's own act, unchanged
  };
  return (
    <span className="relative inline-flex">
      <input
        {...field}
        autoComplete="off"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHi(-1); }}
        onKeyDown={onKeyDown}
        onBlur={(e) => { close(); field.onBlur?.(e); }}
      />
      {offered.length > 0 ? (
        <span data-word-offers={String(offered.length)} className="absolute left-0 top-full z-20 mt-0.5 grid min-w-full rounded border border-stone-700 bg-stone-950 py-0.5 text-xs shadow-lg">
          {offered.map((w, i) => (
            <button
              key={w}
              type="button"
              tabIndex={-1}
              data-word-offer={w}
              data-word-offer-highlighted={i === hi ? 'true' : undefined}
              className={i === hi ? 'px-2 py-0.5 text-left text-stone-100 bg-stone-800 underline' : 'px-2 py-0.5 text-left text-stone-300 hover:bg-stone-900'} // the designer's 16:33 (2): the highlighted word UNDERLINED, as a chosen mode or sign is (the ground alone was 1.3 : 1)
              onMouseDown={(e) => { e.preventDefault(); pick(w); }}
            >
              {w}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}
