import type { GeneralSitePacket } from '../lib/generalSitePacketPresenterV0';

// The clean per-site FACE: a read-only structural locator rendered from the general
// presenter's packet — labels only, no coded ids, no machinery vocabulary. It poses
// as no semantic help; the naming WRITE stays in VertexPacketEditor.
export function GeneralSiteFacePanel({ packet }: { packet: GeneralSitePacket }) {
  const { face } = packet;
  const parents = face.namedNeighbours.filter((neighbour) => neighbour.role === 'parent');
  const across = face.namedNeighbours.filter((neighbour) => neighbour.role === 'across-cell');

  return (
    <div className="grid gap-3 text-sm text-stone-300">
      <p className="text-stone-200">{face.siteDescription}</p>
      <p className="text-stone-400">
        Born between <span className="text-stone-100">{face.bornBetween[0]}</span> and{' '}
        <span className="text-stone-100">{face.bornBetween[1]}</span>.
      </p>
      <p className="text-stone-400">{face.readAcross}</p>
      <div className="grid gap-1">
        <span className="text-xs uppercase tracking-wide text-stone-500">Named neighbours</span>
        <ul className="grid gap-1">
          {parents.map((neighbour, index) => (
            <li key={`parent-${index}-${neighbour.label}`} className="text-stone-200">
              {neighbour.label} <span className="text-stone-500">(parent)</span>
            </li>
          ))}
          {across.map((neighbour, index) => (
            <li key={`across-${index}-${neighbour.label}`} className="text-stone-200">
              {neighbour.label} <span className="text-stone-500">(across cell)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
