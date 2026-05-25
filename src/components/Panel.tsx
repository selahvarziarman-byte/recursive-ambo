import type { PropsWithChildren } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="border-b border-stone-800 px-4 py-4 last:border-b-0">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
