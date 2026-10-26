"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projects as original, type Category, type Photo, type Project } from "@/data/projects";
import { info as originalInfo, site as originalSite } from "@/data/site";
import imageLoader from "@/lib/imageLoader";
import { photoRows } from "@/lib/work";

// Studio: a private page for rearranging and editing the site without code.
// The site is static, so nothing here saves to the live site. Changes are kept
// in this browser, then "Copy changes" puts a summary on the clipboard to paste
// to Claude, who updates the data files and publishes.

type Draft = {
  order: string[];
  projects: Record<string, Project & { isNew?: boolean }>;
  homeCount: number;
  info: { bio: string[]; clients: string[]; publications: string[]; links: { label: string; href: string; text: string }[] };
};

const STORE = "jwp-studio-draft-v1";
const CATEGORIES: Category[] = ["Editorial", "Commercial", "Personal"];

const initial = (): Draft => ({
  order: original.map((p) => p.slug),
  projects: Object.fromEntries(original.map((p) => [p.slug, structuredClone(p)])),
  homeCount: originalSite.homeCount,
  info: structuredClone({ bio: originalInfo.bio, clients: originalInfo.clients, publications: originalInfo.publications, links: originalInfo.links }),
});

const thumb = (p: Project, ph: Photo) => imageLoader({ src: `/images/${p.folder ?? p.slug}/${ph.file}`, width: 480 });
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
};
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// Drag to reorder (mouse and touch) with SortableJS. Sortable moves the DOM
// node itself; that move is undone so React stays in charge and re-renders
// from the new order.
function useSortable(onMove: (from: number, to: number) => void, key: unknown) {
  const ref = useRef<HTMLElement | null>(null);
  const cb = useRef(onMove);
  cb.current = onMove;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let sortable: { destroy: () => void } | undefined;
    let dead = false;
    import("sortablejs").then(({ default: Sortable }) => {
      if (dead) return;
      sortable = Sortable.create(el, {
        animation: 150,
        handle: "[data-drag]",
        delayOnTouchOnly: true,
        delay: 120,
        ghostClass: "st-ghost",
        onEnd: (e) => {
          const { oldIndex, newIndex, item, from } = e;
          if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
          from.removeChild(item);
          from.insertBefore(item, from.children[oldIndex] ?? null);
          cb.current(oldIndex, newIndex);
        },
      });
    });
    return () => {
      dead = true;
      sortable?.destroy();
    };
  }, [key]);
  return ref;
}

function changes(d: Draft): string[] {
  const out: string[] = [];
  const base = initial();
  const name = (slug: string) => d.projects[slug]?.title || slug;
  const kept = base.order.filter((s) => d.order.includes(s));
  if (!same(kept, d.order.filter((s) => !d.projects[s]?.isNew)) || d.order.some((s) => d.projects[s]?.isNew)) {
    out.push(`Project order: ${d.order.map(name).join(", ")}`);
  }
  base.order.filter((s) => !d.order.includes(s)).forEach((s) => out.push(`Remove project "${name(s)}"`));
  for (const slug of d.order) {
    const p = d.projects[slug];
    const o = base.projects[slug];
    if (p.isNew) {
      out.push(`New project "${p.title}": ${[p.client, p.category, p.date, p.location].filter(Boolean).join(", ")}${p.summary ? `. Summary: ${p.summary}` : ""}`);
      continue;
    }
    for (const f of ["title", "client", "category", "date", "location", "summary"] as const) {
      if ((p[f] ?? "") !== (o[f] ?? "")) out.push(`"${o.title}": ${f} → "${p[f] ?? ""}"`);
    }
    if (p.cover !== o.cover) out.push(`"${p.title}": cover → ${p.cover}`);
    const files = p.photos.map((x) => x.file);
    const oFiles = o.photos.map((x) => x.file);
    oFiles.filter((f) => !files.includes(f)).forEach((f) => out.push(`"${p.title}": remove photo ${f}`));
    if (!same(files, oFiles.filter((f) => files.includes(f)))) out.push(`"${p.title}": photo order → ${files.join(", ")}`);
    p.photos.forEach((ph) => {
      const was = o.photos.find((x) => x.file === ph.file);
      if (was && !!was.half !== !!ph.half) out.push(`"${p.title}": ${ph.file} ${ph.half ? "side by side" : "full width"}`);
    });
  }
  if (d.homeCount !== base.homeCount) out.push(`Home shows ${d.homeCount} projects`);
  if (!same(d.info.bio, base.info.bio)) out.push(`Info bio → ${d.info.bio.join(" / ")}`);
  if (!same(d.info.clients, base.info.clients)) out.push(`Clients → ${d.info.clients.join(", ")}`);
  if (!same(d.info.publications, base.info.publications)) out.push(`Publications → ${d.info.publications.join(", ")}`);
  d.info.links.forEach((l, i) => {
    if (!same(l, base.info.links[i])) out.push(`${l.label} link → ${l.href || "(hidden)"}`);
  });
  return out;
}

export default function Studio() {
  const [d, setD] = useState<Draft>(initial);
  const [tab, setTab] = useState<"projects" | "new" | "info">("projects");
  const [sel, setSel] = useState(original[0]?.slug ?? "");
  const [copied, setCopied] = useState<"" | "ok" | "manual">("");
  const [loadedSaved, setLoadedSaved] = useState(false);
  const [stale, setStale] = useState(false);

  // Keep work between visits in this browser only. If the site itself has
  // changed since (Claude applied the last batch), start fresh from it.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (saved?.base === JSON.stringify(initial())) setD(saved.draft);
      else if (saved) setStale(true);
    } catch {}
    setLoadedSaved(true);
  }, []);
  useEffect(() => {
    if (!loadedSaved) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ base: JSON.stringify(initial()), draft: d }));
    } catch {}
  }, [d, loadedSaved]);

  const list = useMemo(() => changes(d), [d]);
  const p = d.projects[sel] ?? d.projects[d.order[0]];
  const update = (fn: (x: Draft) => void) =>
    setD((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  const setField = <K extends keyof Project>(k: K, v: Project[K]) => update((x) => void (x.projects[p.slug][k] = v));

  const orderRef = useSortable((a, b) => update((x) => void (x.order = move(x.order, a, b))), `${tab}-order`);
  const photoRef = useSortable((a, b) => update((x) => void (x.projects[p.slug].photos = move(x.projects[p.slug].photos, a, b))), `${tab}-${p?.slug}-${p?.photos.length ? 1 : 0}`);

  const text = [
    "Studio changes for jakeweinbergphoto.com",
    ...list.map((l) => `- ${l}`),
    "",
    "Data (for Claude):",
    JSON.stringify({
      order: d.order,
      projects: Object.fromEntries(
        d.order.filter((s) => d.projects[s].isNew || !same(d.projects[s], initial().projects[s])).map((s) => [s, d.projects[s]]),
      ),
      homeCount: d.homeCount,
      info: d.info,
    }),
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      setCopied("manual");
    }
  };

  // New project form
  const [form, setForm] = useState({ title: "", client: "", category: "" as Category | "", date: "", location: "", summary: "", files: "" });
  const addProject = () => {
    const slug = slugify(form.title);
    if (!slug || d.projects[slug]) return;
    update((x) => {
      x.order.unshift(slug);
      x.projects[slug] = {
        slug,
        isNew: true,
        title: form.title.trim(),
        client: form.client.trim() || undefined,
        category: form.category || undefined,
        date: form.date,
        location: form.location.trim() || undefined,
        summary: [form.summary.trim(), form.files.trim() && `Photos: ${form.files.trim()}`].filter(Boolean).join(" ") || undefined,
        cover: "",
        photos: [],
      };
    });
    setSel(slug);
    setForm({ title: "", client: "", category: "", date: "", location: "", summary: "", files: "" });
    setTab("projects");
  };
  const newSlug = slugify(form.title);
  const formError = !form.title.trim() ? "" : d.projects[newSlug] ? "A project with this name already exists." : !form.date ? "Pick a month." : "";

  return (
    <div className="st wrap page-top">
      <div className="st-top">
        <div>
          <h1 className="title">Studio</h1>
          <p className="st-lede">
            Drag projects and photos into order, edit details, add projects. Nothing here goes live on its own: when
            you&apos;re done, copy the changes and paste them to Claude.
          </p>
        </div>
        <div className="st-actions">
          <button className="st-btn st-primary" onClick={copy} disabled={!list.length}>
            Copy changes{list.length ? ` (${list.length})` : ""}
          </button>
          <button className="st-btn" onClick={() => confirmReset() && (setD(initial()), setCopied(""))} disabled={!list.length}>
            Start over
          </button>
        </div>
      </div>
      {stale && <p className="st-note">The site has been updated since your last visit, so Studio starts fresh from the live version.</p>}
      {copied === "ok" && <p className="st-note">Copied. Paste it into your chat with Claude, along with any new photos.</p>}
      {copied === "manual" && (
        <div className="st-note">
          <p>Your browser blocked copying. Select all of this text and copy it:</p>
          <textarea className="st-input" readOnly rows={8} value={text} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}

      <div className="tabs mono" role="tablist">
        {([["projects", "Projects"], ["new", "New project"], ["info", "Info & settings"]] as const).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === "projects" && p && (
        <div className="st-cols">
          <div>
            <h2 className="mono st-h">Order on the site</h2>
            <ol className="st-order" ref={orderRef as React.RefObject<HTMLOListElement>}>
              {d.order.map((slug, n) => {
                const q = d.projects[slug];
                return (
                  <li key={slug} className={slug === p.slug ? "on" : ""}>
                    <span data-drag className="st-handle" aria-label="Drag to reorder">⋮⋮</span>
                    <span className="mono">{String(n + 1).padStart(2, "0")}</span>
                    <button className="st-link" onClick={() => setSel(slug)}>{q.title || "Untitled"}</button>
                    {q.isNew && <span className="st-badge mono">New</span>}
                  </li>
                );
              })}
            </ol>
            <p className="mono st-hint">Drag ⋮⋮ to reorder. The first {d.homeCount} show on Home.</p>
          </div>

          <div className="st-edit">
            <div className="st-fields">
              <label>Title<input className="st-input" value={p.title} onChange={(e) => setField("title", e.target.value)} /></label>
              <label>Client<input className="st-input" value={p.client ?? ""} onChange={(e) => setField("client", e.target.value || undefined)} /></label>
              <label>Category
                <select className="st-input" value={p.category ?? ""} onChange={(e) => setField("category", (e.target.value || undefined) as Category | undefined)}>
                  <option value="">None</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>Date<input className="st-input" type="month" value={p.date} onChange={(e) => setField("date", e.target.value)} /></label>
              <label>Location<input className="st-input" value={p.location ?? ""} onChange={(e) => setField("location", e.target.value || undefined)} /></label>
              <label className="st-wide">Summary<textarea className="st-input" rows={2} value={p.summary ?? ""} onChange={(e) => setField("summary", e.target.value || undefined)} /></label>
            </div>

            <div className="st-row">
              <h2 className="mono st-h">Photos · drag to arrange</h2>
              <button className="st-btn st-danger" onClick={() => {
                if (!confirmRemove(p.title)) return;
                update((x) => {
                  x.order = x.order.filter((s) => s !== p.slug);
                  if (p.isNew) delete x.projects[p.slug];
                });
                setSel(d.order.find((s) => s !== p.slug) ?? "");
              }}>Remove project</button>
            </div>
            {p.photos.length === 0 ? (
              <p className="st-empty">No photos yet. Send them to Claude with your changes and they&apos;ll be added in this order.</p>
            ) : (
              <ul className="st-photos" ref={photoRef as React.RefObject<HTMLUListElement>}>
                {p.photos.map((ph, n) => {
                  const portrait = ph.height > ph.width;
                  return (
                    <li key={ph.file}>
                      <div data-drag className="st-thumb" style={{ aspectRatio: `${ph.width} / ${ph.height}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumb(p, ph)} alt={ph.file} draggable={false} />
                        <span className="mono">{n + 1}</span>
                      </div>
                      <p className="mono st-file">{ph.file}</p>
                      <div className="st-tools">
                        <button className={`st-chip ${p.cover === ph.file ? "on" : ""}`} onClick={() => setField("cover", ph.file)}>
                          {p.cover === ph.file ? "Cover" : "Make cover"}
                        </button>
                        {portrait ? (
                          <span className="st-chip st-auto mono">Pairs</span>
                        ) : (
                          <button className={`st-chip ${ph.half ? "on" : ""}`} onClick={() => update((x) => {
                            const t = x.projects[p.slug].photos[n];
                            t.half = !t.half || undefined;
                          })}>{ph.half ? "Side by side" : "Full width"}</button>
                        )}
                        <button className="st-chip" aria-label={`Remove ${ph.file}`} onClick={() => update((x) => {
                          const q = x.projects[p.slug];
                          q.photos = q.photos.filter((_, i) => i !== n);
                          if (q.cover === ph.file) q.cover = q.photos[0]?.file ?? "";
                        })}>Remove</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {p.photos.length > 0 && (
              <>
                <h2 className="mono st-h">Page preview</h2>
                <div className="st-preview">
                  {photoRows(p.photos).map((row) => (
                    <div key={row.map((r) => r.file).join("|")} className="st-prow">
                      {row.map((ph) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={ph.file} src={thumb(p, ph)} alt="" style={{ flex: row.length > 1 ? ph.width / ph.height : undefined, width: row.length === 1 && ph.height > ph.width ? "50%" : undefined }} />
                      ))}
                    </div>
                  ))}
                </div>
                <p className="mono st-hint">Portraits pair up automatically. Set a landscape to Side by side to pair it too.</p>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "new" && (
        <form className="st-new" onSubmit={(e) => { e.preventDefault(); if (!formError && form.title.trim()) addProject(); }}>
          <div className="st-fields">
            <label>Title<input id="new-title" className="st-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Chicago Marathon" /></label>
            <label>Client<input id="new-client" className="st-input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Citius" /></label>
            <label>Category
              <select id="new-category" className="st-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category | "" })}>
                <option value="">None</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Date<input id="new-date" className="st-input" type="month" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
            <label>Location<input id="new-location" className="st-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Chicago, IL" /></label>
            <label className="st-wide">Summary (optional)<textarea id="new-summary" className="st-input" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
            <label className="st-wide">Photo filenames, in order (optional)<textarea id="new-files" className="st-input" rows={2} value={form.files} onChange={(e) => setForm({ ...form, files: e.target.value })} placeholder="JWP 21.JPG, JWP 24.JPG" /></label>
          </div>
          <p className="mono st-hint">Web address: /projects/{newSlug || "…"}/</p>
          {formError && <p className="st-error">{formError}</p>}
          <button className="st-btn st-primary" type="submit" disabled={!form.title.trim() || !!formError}>Add project</button>
        </form>
      )}

      {tab === "info" && (
        <div className="st-fields st-info">
          <label className="st-wide">Bio, one paragraph per line
            <textarea id="info-bio" className="st-input" rows={5} value={d.info.bio.join("\n")} onChange={(e) => update((x) => void (x.info.bio = e.target.value.split("\n")))} />
          </label>
          <label>Clients, one per line
            <textarea id="info-clients" className="st-input" rows={6} value={d.info.clients.join("\n")} onChange={(e) => update((x) => void (x.info.clients = e.target.value.split("\n")))} />
          </label>
          <label>Publications, one per line
            <textarea id="info-pubs" className="st-input" rows={6} value={d.info.publications.join("\n")} onChange={(e) => update((x) => void (x.info.publications = e.target.value.split("\n")))} />
          </label>
          {d.info.links.map((l, i) => (
            <label key={l.label}>{l.label} link
              <input id={`info-link-${i}`} className="st-input" value={l.href} placeholder={l.label === "LinkedIn" ? "https://www.linkedin.com/in/…" : ""} onChange={(e) => update((x) => void (x.info.links[i].href = e.target.value))} />
            </label>
          ))}
          <label>Projects on Home
            <input id="home-count" className="st-input" type="number" min={1} max={12} value={d.homeCount} onChange={(e) => update((x) => void (x.homeCount = Math.max(1, Math.min(12, Number(e.target.value) || 1))))} />
          </label>
        </div>
      )}

      <section className="st-summary">
        <h2 className="mono st-h">Your changes</h2>
        {list.length ? <ul>{list.map((l) => <li key={l}>{l}</li>)}</ul> : <p className="st-empty">No changes yet.</p>}
      </section>
    </div>
  );
}

const confirmReset = () => window.confirm("Throw away all your Studio changes?");
const confirmRemove = (t: string) => window.confirm(`Remove "${t}" from the site?`);
