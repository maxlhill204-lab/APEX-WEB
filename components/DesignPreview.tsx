import type { CSSProperties } from 'react';
import type { Design } from '@/lib/template-types';
export function DesignPreview({ design, large = false }: { design: Design; large?: boolean }) {
  const style = { '--preview-bg': design.palette[0], '--preview-ink': design.palette[1], '--preview-accent': design.palette[2] || design.palette[1] } as CSSProperties;
  return <div className={`design-preview preview-${design.id.replace('.', '-')} ${large ? 'preview-large' : ''}`} style={style} aria-label={`${design.title} illustrative design direction`}>
    <div className="preview-nav" aria-hidden="true"><span>YOUR BUSINESS</span><span>EST. YOUR STORY</span></div>
    <div className="preview-art" aria-hidden="true"><i /><i /><i /></div>
    <div className="preview-title" aria-hidden="true">{design.title.split(' — ')[0]}<span>A considered<br />new perspective.</span></div>
    <div className="preview-rule" aria-hidden="true" />
    <span className="preview-label">Illustrative art direction · {design.id}</span>
  </div>;
}
