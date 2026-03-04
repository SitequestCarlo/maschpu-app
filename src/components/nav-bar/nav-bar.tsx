import { component$, useContext } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import styles from "~/styles/nav-bar.module.css";
import { SearchContext } from "~/contexts/search-context";

import PumpIcon from "~/assets/pump-icon.svg?jsx";
import CalcIcon from "~/assets/calc-icon.svg?jsx";
import TheoryIcon from "~/assets/theory-icon.svg?jsx";
import SearchIcon from "~/assets/search-icon.svg?jsx";
import BackIcon from "~/assets/back-icon.svg?jsx";

const MAIN_PAGES = ["/", "/pumpen/", "/rechner/", "/theorie/"];

export default component$(() => {
  const loc = useLocation();
  const pn = loc.url.pathname;
  const searchOpen = useContext(SearchContext);
  const isMainPage = MAIN_PAGES.includes(pn);

  const activeIndex = pn.includes("pumpen/")
    ? 0
    : pn.includes("rechner/")
      ? 1
      : pn.includes("theorie/")
        ? 2
        : -1;

  return (
    <nav class={styles.nav} aria-label="Hauptnavigation">
      <button
        class={[styles.backBtn, isMainPage && styles.backBtnHidden].filter(Boolean).join(" ")}
        aria-label="Zurück"
        aria-hidden={isMainPage}
        tabIndex={isMainPage ? -1 : 0}
        onClick$={() => { history.back(); }}
      >
        <BackIcon />
      </button>

      <div class={styles.pill}>
        {activeIndex >= 0 && (
          <div
            class={styles.indicator}
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        )}
        <ul>
          <Link href="/pumpen">
            <li class={pn.includes("pumpen/") ? styles.active : ""}>
              <PumpIcon />
              <span>Pumpen</span>
            </li>
          </Link>

          <Link href="/rechner">
            <li class={pn.includes("rechner/") ? styles.active : ""}>
              <CalcIcon />
              <span>Rechner</span>
            </li>
          </Link>

          <Link href="/theorie">
            <li class={pn.includes("theorie/") ? styles.active : ""}>
              <TheoryIcon />
              <span>Theorie</span>
            </li>
          </Link>
        </ul>
      </div>

      <button class={styles.searchBtn} aria-label="Suche" onClick$={() => {
        // iOS: programmatic focus only works within user gesture call stack.
        // Open keyboard via temp input, then transfer focus to real search input.
        const tmp = document.createElement('input');
        tmp.style.cssText = 'position:fixed;opacity:0;top:0;left:0;width:10px;height:10px;font-size:16px;';
        document.body.appendChild(tmp);
        tmp.focus();
        searchOpen.value = true;
        setTimeout(() => tmp.remove(), 1000);
      }}>
        <SearchIcon />
      </button>
    </nav>
  );
});
