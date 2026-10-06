// ═══ THE LAYER 3 WITNESS — the committed witness form, read in COPY-1 §5.4's words (STAMP LAYOUT-1, the cut's stage 4b). The
// mathematics is the instrument's and stays; the code words for the cycle class and the midpoint sites leave the page: `the witness form: the
// Ambo-dissected tetrahedron, glued to itself with a flip at its midpoints` · `w₁ [1], per cycle` · `holonomy ∏U −1: a loop here
// returns reversed` · `[Σ] [0, 1], the disclination class` · `seam edges: cd–bc` (`none`) · `SF 1: frustrated close; path total 2` ·
// `the six midpoints, in loop order` · per site `ab · director axis +x · orientation +1 · on the seam (cd–bc)` (`not on the seam`) ·
// `local connection sign −1`; `vacuous` reads `none`. Its content is FIXED: the committed witness form, not the person's selection.
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
        the witness form: the Ambo-dissected tetrahedron, glued to itself with a flip at its midpoints
      </p>

      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2">
        {packet.summaryRows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-stone-500">{row.label}</dt>
            <dd className="text-stone-200">
              <span className="font-mono text-stone-100">{row.value}</span>
              {row.detail ? <span className="text-stone-500">{row.detail}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-2">
        <span className="text-xs text-stone-500">the six midpoints, in loop order</span>
        <ul className="grid gap-2">
          {packet.siteRows.map(({ site, seamLabel, connectionSign }) => (
            <li key={site.siteId} className="border-t border-stone-800 pt-2 text-stone-200">
              {/* C-6e (the designer's §5, ruled): the seam fact is printed ONCE, in the site's line — never a second time */}
              <span className="font-mono text-stone-100">{site.siteKey}</span>
              <span className="text-stone-500"> · director axis </span>
              <span className="font-mono">{site.axisLabel}</span>
              <span className="text-stone-500"> · orientation </span>
              <span className="font-mono">{formatSign(site.orientationSign)}</span>
              <span className="text-stone-500"> · </span>
              <span>{seamLabel}</span>
              <span className="mt-1 block">
                <span className="text-stone-500">local connection sign </span>
                <span className="font-mono">{formatSign(connectionSign)}</span>
              </span>
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
      // C-6e: the value in WORDS — a dash is a separator in this block, never a value
      seamLabel: incidentSeams.length ? `on the seam (${incidentSeams.join(', ')})` : 'not on the seam',
      connectionSign: getIncidentConnectionSign(state, index),
    };
  });

  return {
    summaryRows: [
      {
        label: 'w₁',
        value: formatNumberArray(state.w1),
        detail: ', per cycle',
      },
      {
        label: 'holonomy ∏U',
        value: formatSign(state.windingSign),
        detail: `: ${describeHolonomy(state.windingSign)}`,
      },
      {
        label: '[Σ]',
        value: formatNullableArray(state.sigmaClass),
        detail: ', the disclination class',
      },
      {
        label: 'seam edges',
        value: seamEdges.join(', ') || 'none',
      },
      {
        label: 'SF',
        value: String(spectralFlowReadout.frustratedClose),
        detail: `: frustrated close; path total ${spectralFlowReadout.pathTotal}`,
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

// a site pair by the sites' keys; a site the state does not key is `unnamed` (rule 5), never its id
function formatSitePair(a: string, b: string, siteKeyById: Map<string, string>): string {
  return `${siteKeyById.get(a) ?? 'unnamed'}–${siteKeyById.get(b) ?? 'unnamed'}`;
}

function formatNumberArray(values: number[]): string {
  return `[${values.join(', ')}]`;
}

function formatNullableArray(values: number[] | null): string {
  return values ? formatNumberArray(values) : 'none';
}

function formatSign(sign: Sign | null): string {
  if (sign === -1) {
    return '−1';
  }

  if (sign === 1) {
    return '+1';
  }

  return 'none';
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
