// PlaygroundGenealogyView — D2: the standing genealogy (ADR 0009) as a navigable view.
//
// The committed `buildGenealogyDag` over the store's forms, laid out by the PURE
// `layoutGenealogy` helper (depth-layered rows — generationDepth IS the row order)
// and rendered as plain SVG: nodes = forms (name + birth operation; click →
// `selectForm`, so the form becomes current and the viewport renders it), edges =
// births (parent → child) labelled by their operation kind — a multi-parent birth
// (assemble) draws BOTH parent edges. DAG integrity is surfaced, never hidden.
// No graph library, no new engine — pixels over the committed DAG only.

import { useMemo } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { layoutGenealogy, type GenealogyViewModel } from '../playground/genealogyLayout';

const NAME_MAX = 17;
const clip = (name: string): string =>
  name.length > NAME_MAX ? `${name.slice(0, NAME_MAX - 1)}…` : name;

export function PlaygroundGenealogyView() {
  const forms = usePlaygroundStore((state) => state.forms);
  const formOrder = usePlaygroundStore((state) => state.formOrder);
  const currentFormId = usePlaygroundStore((state) => state.currentFormId);
  const selectForm = usePlaygroundStore((state) => state.selectForm);

  const model: GenealogyViewModel = useMemo(
    () => layoutGenealogy(formOrder.flatMap((id) => (forms[id] ? [forms[id].shape] : []))),
    [forms, formOrder],
  );

  return (
    <div className="border-t border-stone-800">
      <div className="border-b border-stone-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Genealogy
        </h2>
        <p className="mt-1 text-[11px] text-stone-600">
          what begat what — click a form to select it
        </p>
      </div>
      {model.accepted ? null : (
        <p className="px-4 pt-2 font-mono text-[11px] text-red-400">
          DAG integrity REJECTED: {model.violations[0] ?? 'violation'}
        </p>
      )}
      {model.nodes.length === 0 ? (
        <p className="px-4 py-3 text-xs text-stone-600">
          No forms yet — invoke one to start the record.
        </p>
      ) : (
        <div className="overflow-x-auto p-3">
          <svg width={model.width} height={model.height} role="img" aria-label="genealogy DAG">
            {model.edges.map((edge) => (
              <g key={`${edge.parent}->${edge.child}`}>
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#57534e"
                  strokeWidth={1.2}
                />
                <text
                  x={(edge.x1 + edge.x2) / 2}
                  y={(edge.y1 + edge.y2) / 2 - 3}
                  textAnchor="middle"
                  fill="#a8a29e"
                  fontSize={9}
                  fontFamily="monospace"
                >
                  {edge.operation}
                </text>
              </g>
            ))}
            {model.nodes.map((node) => {
              const isCurrent = node.id === currentFormId;
              return (
                <g
                  key={node.id}
                  onClick={() => selectForm(node.id)}
                  role="button"
                  aria-label={`select ${node.name}`}
                  style={{ cursor: 'pointer' }}
                >
                  <title>{`${node.name} · ${node.birthOperation} · depth ${node.depth}\n${node.id}`}</title>
                  <rect
                    x={node.x - model.nodeWidth / 2}
                    y={node.y - model.nodeHeight / 2}
                    width={model.nodeWidth}
                    height={model.nodeHeight}
                    rx={6}
                    fill={isCurrent ? 'rgba(45,212,191,0.12)' : '#1c1917'}
                    stroke={isCurrent ? '#5eead4' : '#44403c'}
                    strokeWidth={isCurrent ? 1.5 : 1}
                  />
                  <text
                    x={node.x}
                    y={node.y - 3}
                    textAnchor="middle"
                    fill={isCurrent ? '#99f6e4' : '#d6d3d1'}
                    fontSize={11}
                    fontFamily="monospace"
                  >
                    {clip(node.name)}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    fill="#78716c"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {node.birthOperation} · d{node.depth}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
