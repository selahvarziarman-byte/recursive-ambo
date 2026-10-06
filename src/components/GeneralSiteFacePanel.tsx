// ═══ THE SITE SECTION — a midpoint's structural locator in COPY-1 §5.4's words (STAMP LAYOUT-1, the cut's stage 4b): `born between
// A and B` · `across the cell: C, D` · `named neighbours` · `A (parent)` · `C (across the cell)`. The line `A site born where the edge
// between A and B is rectified.` is gone — the next line says it (rule 11). Read-only; the naming write stays in the editor.
import type { GeneralSitePacket } from '../lib/generalSitePacketPresenterV0';

export function GeneralSiteFacePanel({ packet }: { packet: GeneralSitePacket }) {
  const { face } = packet;
  const parents = face.namedNeighbours.filter((neighbour) => neighbour.role === 'parent');
  const across = face.namedNeighbours.filter((neighbour) => neighbour.role === 'across-cell');

  return (
    <div className="grid gap-3 text-sm text-stone-300">
      <p className="text-stone-400">
        born between <span className="text-stone-100">{face.bornBetween[0]}</span> and{' '}
        <span className="text-stone-100">{face.bornBetween[1]}</span>
      </p>
      <p className="text-stone-400">{face.readAcross}</p>
      <div className="grid gap-1">
        <span className="text-xs text-stone-500">named neighbours</span>
        <ul className="grid gap-1">
          {parents.map((neighbour, index) => (
            <li key={`parent-${index}-${neighbour.label}`} className="text-stone-200">
              {neighbour.label} <span className="text-stone-500">(parent)</span>
            </li>
          ))}
          {across.map((neighbour, index) => (
            <li key={`across-${index}-${neighbour.label}`} className="text-stone-200">
              {neighbour.label} <span className="text-stone-500">(across the cell)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
