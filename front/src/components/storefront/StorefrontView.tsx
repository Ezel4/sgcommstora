// -----------------------------------------------------------------------------
// Rendu de la boutique à partir du document structuré.
//
// Composant partagé entre la page publique (/boutique/[slug]) et le canvas de
// l'éditeur (iframe). Le document est la source de vérité : chaque section est
// rendue depuis ses blocs, jamais depuis du HTML stocké.
//
// En mode édition (`editing`), chaque bloc et chaque champ reçoivent des
// attributs data-sigmood-* stables (identifiants du document, jamais le texte
// visible) qui permettent la sélection visuelle depuis l'éditeur. Les contenus
// dynamiques (produits, nom de boutique) sont marqués `data-sigmood-dynamic`.
// -----------------------------------------------------------------------------

import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { StoreBlock, StorePage, StoreSection } from "@/lib/editor/document-schema";
import { getFieldValue } from "@/lib/editor/document-schema";
import { getSectionDefinition } from "@/lib/editor/section-definitions";
import type { EditorSelection } from "@/lib/editor/messaging";
import type { StorefrontProduct, StorefrontStore } from "./storefront-data";

const CARD_GRADIENTS = [
  "from-[#b8ccc6] to-[#e9eeee]",
  "from-[#a7d7d3] to-[#e9eeee]",
  "from-[#a9cfdf] to-[#edf1f2]",
  "from-[#c4d0cd] to-[#f2f2f2]",
];

const STOCK_BADGE: Record<StorefrontProduct["status"], { label: string; className: string }> = {
  active: { label: "En stock", className: "bg-ink text-white" },
  "low-stock": { label: "Stock limité", className: "bg-accent-soft text-ink" },
  draft: { label: "Bientôt disponible", className: "bg-black/10 text-ink" },
};

interface RenderContext {
  editing: boolean;
  pageId: string;
  selection: EditorSelection;
  store: StorefrontStore;
  products: StorefrontProduct[];
}

export interface StorefrontViewProps {
  page: StorePage;
  store: StorefrontStore;
  products: StorefrontProduct[];
  /** Active les attributs de sélection et le rendu des sections masquées. */
  editing?: boolean;
  selection?: EditorSelection;
}

// --- Attributs de sélection --------------------------------------------------

function blockAttrs(ctx: RenderContext, section: StoreSection, blockItem: StoreBlock) {
  if (!ctx.editing) return {};
  const definition = getSectionDefinition(section.type);
  const label = definition?.blocks[blockItem.type]?.label ?? blockItem.type;
  const selected =
    ctx.selection?.kind === "block" &&
    ctx.selection.ref.blockId === blockItem.id &&
    ctx.selection.ref.sectionId === section.id;
  return {
    "data-sigmood-page-id": ctx.pageId,
    "data-sigmood-section-id": section.id,
    "data-sigmood-block-id": blockItem.id,
    "data-sigmood-block-type": blockItem.type,
    "data-sigmood-label": label,
    ...(selected ? { "data-sigmood-selected": "true" } : {}),
  };
}

function fieldAttrs(ctx: RenderContext, fieldId: string) {
  return ctx.editing ? { "data-sigmood-field": fieldId } : {};
}

function dynamicAttrs(ctx: RenderContext, section: StoreSection | null, label: string) {
  if (!ctx.editing) return {};
  return {
    "data-sigmood-dynamic": label,
    ...(section ? { "data-sigmood-section-id": section.id } : {}),
    "data-sigmood-page-id": ctx.pageId,
  };
}

/**
 * Texte d'un champ. En mode édition, un champ vide reste visible (et donc
 * sélectionnable) via un placeholder ; en public il n'est pas rendu.
 */
function FieldText({
  ctx,
  blockItem,
  fieldId,
  as: Tag,
  className,
}: {
  ctx: RenderContext;
  blockItem: StoreBlock;
  fieldId: string;
  as: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
}) {
  const value = getFieldValue(blockItem, fieldId);
  if (!value && !ctx.editing) return null;
  return (
    <Tag className={className} {...fieldAttrs(ctx, fieldId)}>
      {value || <span className="italic opacity-50">Texte vide</span>}
    </Tag>
  );
}

// --- Sections ----------------------------------------------------------------

function AnnouncementSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  if (!blockItem) return null;
  return (
    <div className="bg-ink px-4 py-2.5 text-center" {...blockAttrs(ctx, section, blockItem)}>
      <FieldText ctx={ctx} blockItem={blockItem} fieldId="text" as="p" className="text-xs font-medium tracking-wide text-white" />
    </div>
  );
}

function HeaderSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
      <div className="flex items-center gap-2.5" {...dynamicAttrs(ctx, section, "Nom de la boutique")}>
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-ink text-xs font-medium text-white">
          {ctx.store.name.slice(0, 1)}
        </span>
        <span className="text-[1.05rem] font-medium tracking-tight">{ctx.store.name}</span>
      </div>
      {blockItem && (
        <a
          href="#collection"
          className="rounded-full border border-line-strong bg-white/25 px-4 py-2 text-sm transition hover:bg-white/55"
          {...blockAttrs(ctx, section, blockItem)}
        >
          <span {...fieldAttrs(ctx, "ctaLabel")}>{getFieldValue(blockItem, "ctaLabel") || "Voir la collection"}</span>
        </a>
      )}
    </header>
  );
}

function HeroSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  if (!blockItem) return null;
  const primaryLabel = getFieldValue(blockItem, "primaryButtonLabel");
  const secondaryLabel = getFieldValue(blockItem, "secondaryButtonLabel");
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center sm:px-8 sm:pt-16">
      <div {...blockAttrs(ctx, section, blockItem)}>
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="eyebrow" as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-ink-3" />
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="heading" as="h1" className="mt-4 text-4xl font-normal tracking-tight sm:text-5xl" />
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="description" as="p" className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-2 sm:text-[1rem]" />
        {(primaryLabel || secondaryLabel || ctx.editing) && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {(primaryLabel || ctx.editing) && (
              <a href="#collection" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-[#292929]">
                <span {...fieldAttrs(ctx, "primaryButtonLabel")}>{primaryLabel || "Bouton principal"}</span>
              </a>
            )}
            {(secondaryLabel || ctx.editing) && (
              <a href="#collection" className="rounded-full border border-line-strong bg-white/25 px-6 py-3 text-sm transition hover:bg-white/55">
                <span {...fieldAttrs(ctx, "secondaryButtonLabel")}>{secondaryLabel || "Bouton secondaire"}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function BenefitsSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const intro = section.blocks.find((blockItem) => blockItem.type === "benefits-intro");
  const items = section.blocks.filter((blockItem) => blockItem.type === "benefit-item");
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 sm:px-8">
      {intro && (
        <div {...blockAttrs(ctx, section, intro)}>
          <FieldText ctx={ctx} blockItem={intro} fieldId="heading" as="h2" className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-ink-3" />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((blockItem) => (
          <article key={blockItem.id} className="rounded-[23px] border border-line bg-surface p-5 shadow-[var(--elevation-1)]" {...blockAttrs(ctx, section, blockItem)}>
            <FieldText ctx={ctx} blockItem={blockItem} fieldId="title" as="h3" className="text-base font-medium" />
            <FieldText ctx={ctx} blockItem={blockItem} fieldId="description" as="p" className="mt-2 text-sm leading-relaxed text-ink-2" />
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedProductsSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const intro = section.blocks.find((blockItem) => blockItem.type === "featured-intro");
  return (
    <section id="collection" className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
      {intro && (
        <div className="mb-6" {...blockAttrs(ctx, section, intro)}>
          <FieldText ctx={ctx} blockItem={intro} fieldId="heading" as="h2" className="text-sm font-medium uppercase tracking-[0.16em] text-ink-3" />
          <FieldText ctx={ctx} blockItem={intro} fieldId="description" as="p" className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2" />
        </div>
      )}
      {ctx.products.length === 0 ? (
        <div className="rounded-3xl border border-line bg-surface px-6 py-12 text-center shadow-[var(--elevation-1)]" {...dynamicAttrs(ctx, section, "Produits du catalogue")}>
          <h3 className="text-xl font-normal text-ink">La collection arrive bientôt</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-3">
            Les premiers produits sont en préparation. Revenez prochainement pour les découvrir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" {...dynamicAttrs(ctx, section, "Produits du catalogue")}>
          {ctx.products.map((product, index) => {
            const badge = STOCK_BADGE[product.status];
            const showPrice = product.status !== "draft" && product.price > 0;
            return (
              <article key={product.id} className="flex flex-col overflow-hidden rounded-[23px] border border-line bg-surface shadow-[var(--elevation-1)]">
                <div aria-hidden className={`aspect-square bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`} />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span>
                  <h3 className="text-base font-medium">{product.name}</h3>
                  <p className="text-xs text-ink-3">{product.category}</p>
                  <p className="mt-auto text-sm font-medium tabular-nums">{showPrice ? formatCurrency(product.price) : "Bientôt disponible"}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TestimonialsSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const intro = section.blocks.find((blockItem) => blockItem.type === "testimonials-intro");
  const items = section.blocks.filter((blockItem) => blockItem.type === "testimonial-item");
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 sm:px-8">
      {intro && (
        <div {...blockAttrs(ctx, section, intro)}>
          <FieldText ctx={ctx} blockItem={intro} fieldId="heading" as="h2" className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-ink-3" />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((blockItem) => (
          <figure key={blockItem.id} className="rounded-[23px] border border-line bg-surface p-6 shadow-[var(--elevation-1)]" {...blockAttrs(ctx, section, blockItem)}>
            <blockquote>
              <FieldText ctx={ctx} blockItem={blockItem} fieldId="quote" as="p" className="text-sm leading-relaxed text-ink-2" />
            </blockquote>
            <figcaption className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-ink-3">
              <FieldText ctx={ctx} blockItem={blockItem} fieldId="author" as="span" />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const intro = section.blocks.find((blockItem) => blockItem.type === "faq-intro");
  const items = section.blocks.filter((blockItem) => blockItem.type === "faq-item");
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 pb-16 sm:px-8">
      {intro && (
        <div {...blockAttrs(ctx, section, intro)}>
          <FieldText ctx={ctx} blockItem={intro} fieldId="heading" as="h2" className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-ink-3" />
        </div>
      )}
      <div className="space-y-3">
        {items.map((blockItem) => (
          <div key={blockItem.id} className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--elevation-1)]" {...blockAttrs(ctx, section, blockItem)}>
            <FieldText ctx={ctx} blockItem={blockItem} fieldId="question" as="h3" className="text-sm font-medium text-ink" />
            <FieldText ctx={ctx} blockItem={blockItem} fieldId="answer" as="p" className="mt-2 text-sm leading-relaxed text-ink-2" />
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  if (!blockItem) return null;
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20 sm:px-8">
      <div className="rounded-3xl border border-line bg-surface-2 px-6 py-10 text-center" {...blockAttrs(ctx, section, blockItem)}>
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="heading" as="h2" className="text-2xl font-normal tracking-tight" />
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="description" as="p" className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-2" />
        <div className="mx-auto mt-6 flex max-w-sm items-center gap-2">
          <span aria-hidden className="min-h-11 flex-1 rounded-full border border-line-strong bg-white/60 px-4 py-2.5 text-left text-sm text-ink-4">
            votre@email.fr
          </span>
          <span className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
            <span {...fieldAttrs(ctx, "buttonLabel")}>{getFieldValue(blockItem, "buttonLabel") || "S’inscrire"}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function FooterSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  return (
    <footer id="footer" className="border-t border-line px-6 py-8 text-center sm:px-8">
      {blockItem && (
        <div {...blockAttrs(ctx, section, blockItem)}>
          <FieldText ctx={ctx} blockItem={blockItem} fieldId="about" as="p" className="mx-auto max-w-md text-sm leading-relaxed text-ink-2" />
        </div>
      )}
      <p className="mt-3 text-xs text-ink-3">
        Boutique générée avec{" "}
        <Link href="/" className="underline underline-offset-2 hover:text-ink">
          Sigmood IA
        </Link>
      </p>
    </footer>
  );
}

function CollectionHeaderSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  if (!blockItem) return null;
  return (
    <section className="mx-auto max-w-5xl px-6 pb-10 pt-12 sm:px-8">
      <div {...blockAttrs(ctx, section, blockItem)}>
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="eyebrow" as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-ink-3" />
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="heading" as="h1" className="mt-3 text-3xl font-normal tracking-tight sm:text-4xl" />
        <FieldText ctx={ctx} blockItem={blockItem} fieldId="description" as="p" className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-[1rem]" />
      </div>
    </section>
  );
}

function ProductOverviewSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  if (!blockItem) return null;
  // Produit représentatif : le gabarit s'applique à toute fiche produit.
  const product = ctx.products[0] ?? null;
  const ctaLabel = getFieldValue(blockItem, "ctaLabel");
  const showPrice = product != null && product.status !== "draft" && product.price > 0;
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div
          aria-hidden
          className="aspect-square rounded-[28px] bg-gradient-to-br from-[#b8ccc6] to-[#e9eeee]"
          {...dynamicAttrs(ctx, section, "Visuel du produit")}
        />
        <div {...blockAttrs(ctx, section, blockItem)}>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-3" {...dynamicAttrs(ctx, section, "Catégorie du produit")}>
            {product?.category || "Catégorie"}
          </p>
          <h1 className="mt-3 text-3xl font-normal tracking-tight sm:text-4xl" {...dynamicAttrs(ctx, section, "Nom du produit")}>
            {product?.name || "Nom du produit"}
          </h1>
          <p className="mt-3 text-xl font-medium tabular-nums" {...dynamicAttrs(ctx, section, "Prix du produit")}>
            {showPrice ? formatCurrency(product.price) : "Prix à définir"}
          </p>
          <div className="mt-6">
            <span className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-medium text-white">
              <span {...fieldAttrs(ctx, "ctaLabel")}>{ctaLabel || "Ajouter au panier"}</span>
            </span>
          </div>
          <FieldText ctx={ctx} blockItem={blockItem} fieldId="reassurance" as="p" className="mt-4 text-xs text-ink-3" />
          <div className="mt-8 border-t border-line pt-6">
            <FieldText ctx={ctx} blockItem={blockItem} fieldId="detailsHeading" as="h2" className="text-sm font-medium uppercase tracking-[0.16em] text-ink-3" />
            <p className="mt-3 text-sm leading-relaxed text-ink-2" {...dynamicAttrs(ctx, section, "Description du produit")}>
              La description du produit provient du module Produits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageBannerSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const blockItem = section.blocks[0];
  if (!blockItem) return null;
  const url = getFieldValue(blockItem, "imageUrl");
  const caption = getFieldValue(blockItem, "caption");
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      <figure {...blockAttrs(ctx, section, blockItem)}>
        {url ? (
          // Image fournie par le marchand (URL libre) → balise <img> simple.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={caption || "Image de la boutique"}
            className="max-h-[520px] w-full rounded-[24px] object-cover"
            {...fieldAttrs(ctx, "imageUrl")}
          />
        ) : ctx.editing ? (
          <div
            className="flex aspect-[16/7] w-full items-center justify-center rounded-[24px] bg-gradient-to-br from-[#b8ccc6] to-[#e9eeee] text-sm text-ink-3"
            {...fieldAttrs(ctx, "imageUrl")}
          >
            Ajoutez l’adresse d’une image depuis le panneau
          </div>
        ) : null}
        {(caption || ctx.editing) && (
          <figcaption className="mt-3 text-center text-xs text-ink-3">
            <FieldText ctx={ctx} blockItem={blockItem} fieldId="caption" as="span" />
          </figcaption>
        )}
      </figure>
    </section>
  );
}

function ContentSection({ ctx, section }: { ctx: RenderContext; section: StoreSection }) {
  const items = section.blocks.filter((blockItem) => blockItem.type === "content-body");
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-3xl space-y-8 px-6 py-12 sm:px-8">
      {items.map((blockItem) => (
        <div key={blockItem.id} {...blockAttrs(ctx, section, blockItem)}>
          <FieldText ctx={ctx} blockItem={blockItem} fieldId="heading" as="h2" className="text-2xl font-normal tracking-tight" />
          <FieldText
            ctx={ctx}
            blockItem={blockItem}
            fieldId="body"
            as="p"
            className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-2 sm:text-[1rem]"
          />
        </div>
      ))}
    </section>
  );
}

const SECTION_RENDERERS: Record<string, (props: { ctx: RenderContext; section: StoreSection }) => React.ReactNode> = {
  "announcement-bar": AnnouncementSection,
  header: HeaderSection,
  hero: HeroSection,
  benefits: BenefitsSection,
  "featured-products": FeaturedProductsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  newsletter: NewsletterSection,
  "collection-header": CollectionHeaderSection,
  "product-overview": ProductOverviewSection,
  "image-banner": ImageBannerSection,
  "content-section": ContentSection,
  footer: FooterSection,
};

// --- Vue principale ----------------------------------------------------------

export function StorefrontView({ page, store, products, editing = false, selection = null }: StorefrontViewProps) {
  const ctx: RenderContext = { editing, pageId: page.id, selection, store, products };
  const sections = [...page.sections].sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-base text-ink">
      {sections.map((section) => {
        if (!section.visible && !editing) return null;
        const Renderer = SECTION_RENDERERS[section.type];
        if (!Renderer) return null;
        const sectionSelected =
          selection != null && selection.kind === "section" && selection.sectionId === section.id;
        const content = <Renderer ctx={ctx} section={section} />;
        if (!editing) return <div key={section.id}>{content}</div>;
        return (
          <div
            key={section.id}
            data-sigmood-section-wrapper={section.id}
            {...(sectionSelected ? { "data-sigmood-section-selected": "true" } : {})}
            {...(!section.visible ? { "data-sigmood-hidden-section": "true" } : {})}
          >
            {!section.visible && (
              <p className="mx-auto mt-4 w-fit rounded-full bg-black/8 px-3 py-1 text-center text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-3">
                Section masquée — non publiée
              </p>
            )}
            {content}
          </div>
        );
      })}
    </div>
  );
}
