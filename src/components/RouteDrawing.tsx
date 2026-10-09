// RouteDrawing — STAMP THE-MODES-TAB · slice 2, EACH ROUTE DRAWN (the designer's spec §1.6, design 2's box; Arman's 18:46: "the diagram of the second box
// from the second option"): one route, one drawing, above its sentence on the cell's card. Three places — the row's role low left, the corner's role high
// in the middle (or, across a relation, its two roles high, joined by a line carrying the relation's word), the column's role low right; a line from the
// corner's role to each end with its word just above it, exactly as typed; the corner's edges in ink, its light in the light's own colour (one glyph, one
// meaning, as in the light's drawing); a refused or cut relation's line dashed, as a denial is dashed in the light; one route high (64 px).
export interface RouteDrawingProps {
  left: string; // the row's role
  right: string; // the column's role
  top: [string] | [string, string]; // the corner's role, or across a relation its two roles (the one toward the row first)
  words: [string, string]; // the word on the line to the row's role, and on the line to the column's
  relation?: string; // across a relation: its word
  light: boolean; // in the corner's light (its colour), else by its edges (ink)
  dashed: boolean; // the relation refused or cut
  label: string; // the route's sentence, for a reader that cannot see it
}

const INK = '#d6d3d1';
const LIGHT = '#c4b5fd';
const ENDS = '#a8a29e';

export function RouteDrawing({ left, right, top, words, relation, light, dashed, label }: RouteDrawingProps) {
  const stroke = light ? LIGHT : INK;
  const two = top.length === 2;
  const tl = two ? 150 : 200;
  const tr = two ? 250 : 200;
  return (
    <svg data-medium-route-drawing={two ? 'relation' : 'one'} data-medium-route-drawing-light={light ? 'true' : undefined} width={400} height={64} viewBox="0 0 400 64" role="img" aria-label={label} className="block max-w-full">
      <text data-route-end="row" x={4} y={58} fill={ENDS} fontSize={11} textAnchor="start">{left}</text>
      <text data-route-end="column" x={396} y={58} fill={ENDS} fontSize={11} textAnchor="end">{right}</text>
      <text data-route-top="0" x={tl} y={12} fill={stroke} fontSize={11} textAnchor="middle">{top[0]}</text>
      {two ? <text data-route-top="1" x={tr} y={12} fill={stroke} fontSize={11} textAnchor="middle">{top[1]}</text> : null}
      <line data-route-line="row" x1={tl} y1={17} x2={40} y2={44} stroke={stroke} />
      <line data-route-line="column" x1={tr} y1={17} x2={360} y2={44} stroke={stroke} />
      {two ? <line data-route-line="relation" x1={tl + 32} y1={8} x2={tr - 32} y2={8} stroke={stroke} strokeDasharray={dashed ? '3 3' : undefined} /> : null}
      <text data-route-word="row" x={(tl + 40) / 2 - 4} y={28} fill={stroke} fontSize={10} textAnchor="end">{words[0]}</text>
      <text data-route-word="column" x={(tr + 360) / 2 + 4} y={28} fill={stroke} fontSize={10} textAnchor="start">{words[1]}</text>
      {two && relation ? <text data-route-word="relation" x={200} y={24} fill={stroke} fontSize={10} textAnchor="middle">{relation}</text> : null}
    </svg>
  );
}
