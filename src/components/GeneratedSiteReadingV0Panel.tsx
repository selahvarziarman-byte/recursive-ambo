import { FieldSourcePolicyV0Panel } from './FieldSourcePolicyV0Panel';
import type { Shape } from '../types/geometry';

interface GeneratedSiteReadingV0PanelProps {
  shape: Shape;
}

export function GeneratedSiteReadingV0Panel({
  shape,
}: GeneratedSiteReadingV0PanelProps) {
  return <FieldSourcePolicyV0Panel shape={shape} />;
}
