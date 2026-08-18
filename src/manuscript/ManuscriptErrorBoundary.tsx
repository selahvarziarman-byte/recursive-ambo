// D13 §3 (engineer 2021, URGENT — ⛔ PLACEMENT IS PART OF THE CURE): THE
// ERROR BOUNDARY. A throw during render must never again be a black screen —
// the engine's whole doctrine is that a refusal is SPOKEN BY NAME, and a
// silent void is the most complete violation of it available. Placement:
// TIGHT boundaries around risky subtrees (the aperture panel) leave the
// page's work standing when they fire — the page's entire state lives in
// `useState` inside ManuscriptView, so only a tight catch preserves it; the
// AppShell's LAST-RESORT boundary catches what no tight one can (including a
// throw in ManuscriptView's own render body) at the honest cost of that
// state. The fallback REPORTS WHICH BOUNDARY FIRED (the `scope`) and
// promises nothing it cannot keep — no string claims the person's work is
// safe (⛔ engineer 2021: no comfort the app cannot keep).
//
// Styling is deliberately self-contained inline (paper-neutral constants):
// the boundary must render when everything else is broken, so it depends on
// no theme prop, no store, no other module.
//
// Non-foreclosure rider (Sovereign via mothership 2330): the boundary holds
// COMPONENT-LOCAL error state only — nothing of the page is entrenched here.
import { Component, type ReactNode } from 'react';

export class ManuscriptErrorBoundary extends Component<
  { scope: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // "the details are in the record": the console carries the full error +
    // stack, tagged with the boundary that fired (tight vs last-resort is
    // legible from the scope — the designer words the tight case later)
    console.error(`[manuscript boundary · ${this.props.scope}]`, error);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '13px 15px',
            maxWidth: 430,
            borderRadius: 3,
            background: '#f5efdf',
            border: '1px solid #c8bfa8',
            color: '#3a3326',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          {/* ⛔ COPY PENDING THE DESIGNER — her RATIFIED sentence (b),
              engineer 2021; wired verbatim as the placeholder, not final */}
          <div>this could not be drawn, and the page has stopped rather than go blank. the details are in the record.</div>
          <div style={{ marginTop: 6, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.75 }}>
            {this.props.scope} · {this.state.error.message}
          </div>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 9,
              padding: '5px 12px',
              borderRadius: 3,
              border: '1px solid #c8bfa8',
              background: 'transparent',
              color: '#3a3326',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {/* ⛔ COPY PENDING THE DESIGNER: the recover act's wording is
                hers; this button only re-renders the guarded subtree — it
                does NOT claim anything was kept */}
            try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
