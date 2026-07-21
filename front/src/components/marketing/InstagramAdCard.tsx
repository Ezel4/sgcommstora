import type { ReactNode } from "react";
import { LogoMark } from "./Logo";

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8.2 2.3 5 5.6 5c1.9 0 3.3 1 4 2.3.7-1.3 2.1-2.3 4-2.3 3.3 0 4.8 3.2 3.1 6.5C19 15.65 12 20 12 20Z" />
    </svg>
  );
}

function IconComment() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.7-.85L3 20l1.1-4.15A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m21 3-9 18-3-8-8-3Z" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 4h12v17l-6-4-6 4Z" />
    </svg>
  );
}

// Carte façon post sponsorisé Instagram : sert de banc d'essai pour vérifier que
// chaque CTA de pub propage bien sa source jusqu'au CRM (badge "Provenance").
export function InstagramAdCard({
  caption,
  likes,
  cta,
  label,
  videoSrc,
}: {
  caption: ReactNode;
  likes: string;
  cta: ReactNode;
  label: string;
  videoSrc?: string;
}) {
  return (
    <article className="card-dark mx-auto w-full max-w-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#82a99e] via-[#1fc5be] to-[#2498c8]">
          <LogoMark className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-ink">stora.ai</p>
          <p className="text-[0.7rem] text-ink-3">Sponsorisé</p>
        </div>
        <span className="ml-auto rounded-full border border-line-strong bg-white/[0.06] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-accent">
          {label}
        </span>
      </div>

      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-[#2a1f22] via-[#1a1518] to-[#0f0d10]">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(31,197,190,0.32), transparent 70%)" }}
            />
            <LogoMark className="relative size-16 opacity-90" />
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-xs text-ink-3">stora.ai</p>
        {cta}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-4 text-ink">
          <IconHeart />
          <IconComment />
          <IconSend />
          <span className="ml-auto">
            <IconBookmark />
          </span>
        </div>
        <p className="mt-2.5 text-sm font-medium text-ink">{likes} j'aime</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{caption}</p>
      </div>
    </article>
  );
}
