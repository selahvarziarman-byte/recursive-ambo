// @types/node is deliberately not installed; this file declares the ONE
// node signature vite.config.ts uses (the /__whereami transport spawn) so
// the config stays type-checked without pulling a whole typings package for
// three lines. Widen it only when the config's node surface actually grows.
declare module 'node:child_process' {
  export function spawnSync(
    command: string,
    args: readonly string[],
    options: { cwd: string; encoding: 'utf8' },
  ): { status: number | null; stdout: string; stderr: string };
}
