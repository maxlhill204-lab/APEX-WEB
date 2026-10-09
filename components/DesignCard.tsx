import Link from 'next/link';
import { DesignPreview } from './DesignPreview';
import type { Design } from '@/lib/template-types';
export function DesignCard({ design }: { design: Design }) {
  return <article className="design-card"><Link className="design-card-link" href={`/templates/${design.tier}/${design.slug}`} aria-label={`Explore ${design.title}`}>
    <DesignPreview design={design} />
    <div className="design-card-copy"><div className="design-card-meta"><span>DIRECTION {design.id}</span><span>{design.demoUrl ? 'LIVE DEMO' : 'DEMO COMING SOON'}</span></div><h2>{design.title}</h2><p>{design.summary}</p><span className="design-explore">Explore direction <span aria-hidden="true">↗</span></span></div>
  </Link></article>;
}
