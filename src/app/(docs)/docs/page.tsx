const docsSections = [
  {
    title: "What Recycly is",
    body: "A pickup-first recycling rewards product for Nigeria urban operations, built around verified collection and a points-first reward system.",
  },
  {
    title: "What Phase 1 establishes",
    body: "The fresh Next.js foundation, route groups, Clerk auth wiring, Tailwind design system direction, and Drizzle configuration for the rebuild.",
  },
  {
    title: "What comes next",
    body: "Phase 2 defines the business schema, RBAC rules, and UploadThing-backed operational file flows.",
  },
];

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="font-semibold text-primary text-sm uppercase tracking-[0.25em]">
          Docs
        </p>
        <h1 className="mt-4 font-semibold text-4xl tracking-tight">
          Recycly foundations
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-8">
          This docs surface lives inside the same Next.js application as the
          landing pages and authenticated app, matching the PRD direction for a
          single-codebase product.
        </p>
      </div>

      <div className="mt-12 grid gap-5">
        {docsSections.map((section) => (
          <section
            className="rounded-[1.75rem] border border-border bg-card p-6"
            key={section.title}
          >
            <h2 className="font-semibold text-xl">{section.title}</h2>
            <p className="mt-3 text-muted-foreground text-sm leading-7">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
