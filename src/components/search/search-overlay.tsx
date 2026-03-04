import {
  $,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
  type Signal,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import styles from "~/styles/search.module.css";
import SearchIcon from "~/assets/search-icon.svg?jsx";

interface SearchEntry {
  url: string;
  title: string;
  desc?: string;
  tags?: string[];
}

interface SearchOverlayProps {
  open: Signal<boolean>;
}

export default component$<SearchOverlayProps>(({ open }) => {
  const query = useSignal("");
  const entries = useSignal<SearchEntry[]>([]);
  const filtered = useSignal<SearchEntry[]>([]);
  const inputRef = useSignal<HTMLInputElement>();
  const visible = useSignal(false);
  const closing = useSignal(false);
  const nav = useNavigate();

  const handleClose = $(() => {
    closing.value = true;
    setTimeout(() => {
      open.value = false;
      visible.value = false;
      closing.value = false;
    }, 150);
  });

  // Load the search index once when the overlay is first opened
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => open.value);
    if (!open.value) return;

    visible.value = true;
    closing.value = false;

    // Only fetch once
    if (entries.value.length === 0) {
      try {
        const res = await fetch("/search-index.json");
        entries.value = await res.json();
      } catch {
        entries.value = [];
      }
    }

    // Focus the input
    setTimeout(() => inputRef.value?.focus(), 50);
  });

  // Filter results when query changes
  useTask$(({ track }) => {
    const q = track(() => query.value).toLowerCase().trim();
    const all = entries.value;

    if (!q || q.length < 2) {
      filtered.value = [];
      return;
    }

    const terms = q.split(/\s+/);

    filtered.value = all
      .map((entry) => {
        const haystack = [
          entry.title,
          entry.desc || "",
          ...(entry.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        let score = 0;
        for (const term of terms) {
          if (!haystack.includes(term)) return { entry, score: -1 };

          // Boost title matches
          if (entry.title.toLowerCase().includes(term)) score += 3;
          // Boost tag matches
          if (entry.tags?.some((t) => t.toLowerCase().includes(term)))
            score += 2;
          // Description match
          if (entry.desc?.toLowerCase().includes(term)) score += 1;
        }

        return { entry, score };
      })
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.entry);
  });

  if (!visible.value) return null;

  return (
    <div
      class={[styles.overlay, closing.value ? styles.closing : ""]}
      onClick$={(e) => {
        if ((e.target as HTMLElement).classList.contains(styles.overlay)) {
          handleClose();
        }
      }}
    >
      <div class={styles.panel}>
        <div class={styles.inputRow}>
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            placeholder="Suche…"
            value={query.value}
            onInput$={(_, el) => {
              query.value = el.value;
            }}
            onKeyDown$={(e) => {
              if (e.key === "Escape") handleClose();
            }}
          />
          <button
            class={styles.closeBtn}
            onClick$={() => {
              handleClose();
            }}
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div class={styles.results}>
          {query.value.trim() === "" ? (
            <div class={styles.empty}>Suchbegriff eingeben…</div>
          ) : filtered.value.length === 0 ? (
            <div class={styles.empty}>Keine Ergebnisse für „{query.value}"</div>
          ) : (
            filtered.value.map((entry) => (
              <a
                key={entry.url}
                href={entry.url}
                class={styles.resultItem}
                onClick$={async (e) => {
                  e.preventDefault();
                  handleClose();
                  await nav(entry.url);
                }}
              >
                <p class={styles.resultTitle}>{entry.title}</p>
                {entry.desc && (
                  <p class={styles.resultDesc}>{entry.desc}</p>
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <div class={styles.resultTags}>
                    {entry.tags.slice(0, 5).map((tag) => (
                      <span key={tag} class={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
