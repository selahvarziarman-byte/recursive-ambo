// Stories — the main panels in isolation (dev-only fixtures over the REAL store).
//
// Each story SEEDS the real zustand playground store (reset → invoke → ops) so
// the committed panel mounts with representative live state — read-only reuse,
// no component edit. WitnessRenderV0 mounts bare (its committed standalone mode).

import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { nGon } from '../../playground/primitiveCatalogue';
import { PlaygroundInvokePanel } from '../../components/PlaygroundInvokePanel';
import { PlaygroundOperationsPanel } from '../../components/PlaygroundOperationsPanel';
import { PlaygroundInvariantsPanel } from '../../components/PlaygroundInvariantsPanel';
import { PlaygroundGenealogyView } from '../../components/PlaygroundGenealogyView';
import { PlaygroundSnapshotPanel } from '../../components/PlaygroundSnapshotPanel';
import { WitnessRenderV0 } from '../../components/WitnessRenderV0';

// seed the REAL store with a representative scene: three universes, a born
// torus (word op), an assembly — genealogy/invariants/ops all have material.
function useSeededStore(scenario: 'basic' | 'rich') {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const st = usePlaygroundStore.getState();
    st.resetPlayground();
    const A = st.invokeForm(nGon(4), 'u1');
    if (scenario === 'rich') {
      const B = st.invokeForm(nGon(4), 'u2');
      st.selectForm(A.id);
      st.selectFace(A.faces[0].id);
      st.applyOperationToSelection('glue-torus');
      st.selectForm(A.id);
      st.applyAssembleToSelection(B.id);
    }
    st.selectForm(A.id);
    st.selectFace(A.faces[0].id);
    setReady(true);
  }, [scenario]);
  return ready;
}

function PanelFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100">
      <div className="w-[300px] border-r border-stone-800 bg-stone-950">{children}</div>
    </div>
  );
}

function Seeded({ scenario, children }: { scenario: 'basic' | 'rich'; children: React.ReactNode }) {
  const ready = useSeededStore(scenario);
  return ready ? <PanelFrame>{children}</PanelFrame> : null;
}

const meta: Meta = { title: 'panels' };
export default meta;

export const InvokePanel: StoryObj = {
  render: () => (
    <Seeded scenario="basic">
      <PlaygroundInvokePanel />
    </Seeded>
  ),
};

export const OperationsPanel: StoryObj = {
  render: () => (
    <Seeded scenario="rich">
      <PlaygroundOperationsPanel />
    </Seeded>
  ),
};

export const InvariantsPanel: StoryObj = {
  render: () => (
    <Seeded scenario="rich">
      <PlaygroundInvariantsPanel />
    </Seeded>
  ),
};

export const GenealogyView: StoryObj = {
  render: () => (
    <Seeded scenario="rich">
      <PlaygroundGenealogyView />
    </Seeded>
  ),
};

export const SnapshotPanel: StoryObj = {
  render: () => (
    <Seeded scenario="basic">
      <PlaygroundSnapshotPanel />
    </Seeded>
  ),
};

// the committed witness glyph (standalone mount — its ?witness&debug mode)
export const WitnessGlyph: StoryObj = {
  render: () => (
    <div style={{ height: '100vh', background: '#0c0a09' }}>
      <WitnessRenderV0 />
    </div>
  ),
};
