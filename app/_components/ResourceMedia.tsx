// ResourceMedia — hero banners + thumbnails for /resources articles.
//
// Every article gets a banner. If it has a real CredTek photo assigned
// (article.image), we use it with a soft brand scrim. Otherwise we render
// a branded, category-themed GRADIENT banner (shield mark + a line-icon) —
// so the blog looks designed end-to-end and the handful of photos never
// feel repetitive. Namespaced .rmed-* so it can't collide with anything.

import Image from "next/image";
import type { ResourceCategory } from "../_lib/resources";

const SHIELD = (
  <svg viewBox="0 0 30 28" fill="none" aria-hidden="true">
    <path d="M15 2.2 4.5 6.1v7.4c0 6.5 4.4 10.4 10.5 12.3 6.1-1.9 10.5-5.8 10.5-12.3V6.1L15 2.2Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="m10.4 14.2 3.3 3.3 6.1-6.6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Per-category gradient + oversized line-icon. All in the CredTek blue
// family, with a hue shift per category so each section reads distinct.
const ART: Record<ResourceCategory, { grad: string; icon: React.ReactNode }> = {
  foundations: {
    grad: "linear-gradient(135deg,#0B3E86,#2E7BFF)",
    icon: <path d="M12 3 4 6.4v6.2c0 5.4 3.6 8.6 8 9.9 4.4-1.3 8-4.5 8-9.9V6.4L12 3Z M8.6 12.3l2.6 2.6 4.5-5" />,
  },
  roi: {
    grad: "linear-gradient(135deg,#0B4E9E,#12A594)",
    icon: <path d="M4 19V5m0 14h16M8 15l3.5-4 3 2.5L20 7" />,
  },
  compliance: {
    grad: "linear-gradient(135deg,#0B2A52,#3B6FD4)",
    icon: <path d="M7 3h7l5 5v13H7zM14 3v5h5M9.5 14l2 2 4-4" />,
  },
  multistate: {
    grad: "linear-gradient(135deg,#0B3E86,#4DA3FF)",
    icon: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" />,
  },
  government: {
    grad: "linear-gradient(135deg,#0A2540,#0B5CC0)",
    icon: <path d="M3 21h18M4 21V10l8-5 8 5v11M8 21v-7m4 7v-7m4 7v-7" />,
  },
  specialty: {
    grad: "linear-gradient(135deg,#14356E,#6B5CFF)",
    icon: <path d="M6 3v6a6 6 0 0 0 12 0V3M9 21a3 3 0 0 0 6 0v-3a4 4 0 0 0-4-4" />,
  },
  future: {
    grad: "linear-gradient(135deg,#0B3E86,#7C5CFF)",
    icon: <path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9Z" />,
  },
};

function GradientArt({ category }: { category: ResourceCategory }) {
  const a = ART[category];
  return (
    <div className="rmed-grad" style={{ background: a.grad }}>
      <span className="rmed-grid" aria-hidden="true" />
      <svg className="rmed-bigicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {a.icon}
      </svg>
      <span className="rmed-mark" aria-hidden="true">{SHIELD}</span>
    </div>
  );
}

/** Large hero banner for the article page + featured cards. */
export function ResourceBanner({
  image,
  category,
  className = "",
}: {
  image?: string;
  category: ResourceCategory;
  className?: string;
}) {
  return (
    <div className={`rmed-banner ${className}`.trim()}>
      {image ? (
        <>
          <Image src={image} alt="" fill sizes="(max-width: 760px) 100vw, 720px" className="rmed-photo" />
          <span className="rmed-photo-scrim" aria-hidden="true" />
          <span className="rmed-mark rmed-mark-onphoto" aria-hidden="true">{SHIELD}</span>
        </>
      ) : (
        <GradientArt category={category} />
      )}
    </div>
  );
}

/** Small square thumbnail for the category rows on the index. Gradient-only
 *  (no photo) so the dense index stays fast. */
export function ResourceThumb({ category }: { category: ResourceCategory }) {
  const a = ART[category];
  return (
    <div className="rmed-thumb" style={{ background: a.grad }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {a.icon}
      </svg>
    </div>
  );
}
