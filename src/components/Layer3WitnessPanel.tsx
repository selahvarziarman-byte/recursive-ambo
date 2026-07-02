import { useMemo } from 'react';
import {
  buildFlatConnection,
  cycleGraph,
  holonomyFromPerCycleW1,
  type Sign,
} from '../lib/connectionWaveInstrumentV0';
import { kerCountOf, spectralFlow } from '../lib/spectralFlowV0';
import {
  buildKnownSeamRenderState,
  type RenderState,
  type RenderStateSite,
} from '../selectors/witnessBridge';

interface Layer3WitnessPacket {
  summaryRows: SummaryRow[];
  siteRows: SiteRow[];
}

interface SummaryRow {
  label: string;
  value: string;
  detail?: string;
}

interface SiteRow {
  site: RenderStateSite;
  seamLabel: string;
  connectionSign: Sign | null;
}

interface SpectralFlowReadout {
  frustratedClose: number;
  pathTotal: number;
}

export function Layer3WitnessPanel() {
  const packet = useMemo(() => buildLayer3WitnessPacket(), []);

  return (
    <div className="grid gap-4 text-sm text-stone-300">
      <p className="text-stone-200">
        Committed witness form — ambo-dissected tetrahedron, pure-X_K flip self-glue seam
      </p>

      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2">
        {packet.summaryRows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-stone-500">{row.label}</dt>
            <dd className="text-stone-200">
              <span className="font-mono text-stone-100">{row.value}</span>
              {row.detail ? <span className="text-stone-500"> — {row.detail}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Six X_K sites in loop order
        </span>
        <ul className="grid gap-2">
          {packet.siteRows.map(({ site, seamLabel, connectionSign }) => (
            <li key={site.siteId} className="border-t border-stone-800 pt-2">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-stone-100">{site.siteKey}</span>
                <span className="text-stone-500">{seamLabel}</span>
              </div>
              <dl className="mt-2 grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-1">
                <dt className="text-stone-500">director axis</dt>
                <dd className="font-mono text-stone-200">{site.axisLabel}</dd>
                <dt className="text-stone-500">orientation sign</dt>
                <dd className="font-mono text-stone-200">
                  {formatSign(site.orientationSign)}
                </dd>
                <dt className="text-stone-500">on seam?</dt>
                <dd className="text-stone-200">{seamLabel}</dd>
                <dt className="text-stone-500">local connection sign</dt>
                <dd className="font-mono text-stone-200">{formatSign(connectionSign)}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function buildLayer3WitnessPacket(): Layer3WitnessPacket {
  const state = buildKnownSeamRenderState();
  const siteKeyById = new Map(state.sites.map((site) => [site.siteId, site.siteKey]));
  const seamEdges = state.seamEdges.map((edge) => formatSitePair(edge.a, edge.b, siteKeyById));
  const spectralFlowReadout = buildSpectralFlowReadout(state);
  const siteRows = state.sites.map((site, index) => {
    const incidentSeams = state.seamEdges
      .filter((edge) => edge.a === site.siteId || edge.b === site.siteId)
      .map((edge) => formatSitePair(edge.a, edge.b, siteKeyById));

    return {
      site,
      seamLabel: incidentSeams.length ? `on seam (${incidentSeams.join(', ')})` : '—',
      connectionSign: getIncidentConnectionSign(state, index),
    };
  });

  return {
    summaryRows: [
      {
        label: 'w₁',
        value: formatNumberArray(state.w1),
        detail: 'perCycleW1',
      },
      {
        label: 'holonomy ∏U',
        value: formatSign(state.windingSign),
        detail: describeHolonomy(state.windingSign),
      },
      {
        label: '[Σ]',
        value: formatNullableArray(state.sigmaClass),
        detail: 'disclination class',
      },
      {
        label: 'seam edges',
        value: seamEdges.join(', ') || '∅',
      },
      {
        label: 'SF',
        value: String(spectralFlowReadout.frustratedClose),
        detail: `frustrated close; path total ${spectralFlowReadout.pathTotal}`,
      },
    ],
    siteRows,
  };
}

function buildSpectralFlowReadout(state: RenderState): SpectralFlowReadout {
  const treeGraph = cycleGraph(4);
  const xkGraph = cycleGraph(state.sites.length);
  const aligned = holonomyFromPerCycleW1([0]);
  const alignedGenerator = (k: number): Sign => aligned.generators[k] ?? 1;
  const treeSigns = buildFlatConnection(treeGraph, alignedGenerator).edgeSigns;
  const amboSigns = buildFlatConnection(xkGraph, alignedGenerator).edgeSigns;
  const treeKer = kerCountOf(treeGraph, treeSigns);
  const amboKer = kerCountOf(xkGraph, amboSigns);
  const flipKer = kerCountOf(xkGraph, state.edgeSigns);
  const amboFlow = spectralFlow(treeKer, amboKer);
  const frustratedClose = spectralFlow(amboKer, flipKer);

  return {
    frustratedClose,
    pathTotal: amboFlow + frustratedClose,
  };
}

function getIncidentConnectionSign(state: RenderState, siteIndex: number): Sign | null {
  const site = state.sites[siteIndex];
  const seamEdge = state.seamEdges.find((edge) => edge.a === site.siteId || edge.b === site.siteId);

  if (seamEdge) {
    const seamSignIndex = findCycleEdgeIndex(state, seamEdge.a, seamEdge.b);

    if (seamSignIndex !== null) {
      return state.edgeSigns[seamSignIndex] ?? null;
    }
  }

  return state.edgeSigns[siteIndex] ?? null;
}

function findCycleEdgeIndex(state: RenderState, a: string, b: string): number | null {
  for (let index = 0; index < state.sites.length; index += 1) {
    const current = state.sites[index].siteId;
    const next = state.sites[(index + 1) % state.sites.length].siteId;

    if ((current === a && next === b) || (current === b && next === a)) {
      return index;
    }
  }

  return null;
}

function formatSitePair(a: string, b: string, siteKeyById: Map<string, string>): string {
  return `${siteKeyById.get(a) ?? shortenId(a)}–${siteKeyById.get(b) ?? shortenId(b)}`;
}

function formatNumberArray(values: number[]): string {
  return `[${values.join(', ')}]`;
}

function formatNullableArray(values: number[] | null): string {
  return values ? formatNumberArray(values) : 'vacuous';
}

function formatSign(sign: Sign | null): string {
  if (sign === -1) {
    return '−1';
  }

  if (sign === 1) {
    return '+1';
  }

  return 'vacuous';
}

function describeHolonomy(sign: Sign | null): string {
  if (sign === -1) {
    return 'a loop here returns reversed';
  }

  if (sign === 1) {
    return 'aligned';
  }

  return 'no loop';
}

function shortenId(id: string): string {
  return id.length > 18 ? `${id.slice(0, 8)}...${id.slice(-6)}` : id;
}
