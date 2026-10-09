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
              className={i === hi ? 'px-2 py-0.5 text-left text-stone-100 bg-stone-800' : 'px-2 py-0.5 text-left text-stone-300 hover:bg-stone-900'}
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
