import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import styles from "~/styles/nav-bar.module.css"

import PumpIcon from "~/assets/pump-icon.svg?jsx"
import CalcIcon from "~/assets/calc-icon.svg?jsx"
import TheoryIcon from "~/assets/theory-icon.svg?jsx"

export default component$(() => {

  const loc = useLocation()
  const pn = loc.url.pathname

  return  (
    <nav class={styles.nav}>
      <ul>
        <Link href="/pumpen">
          <li class={pn.includes("pumpen/") ? styles.active : ""}>
            <PumpIcon />
            <label>Pumpen</label>
          </li>
        </Link>

        <Link href="/rechner">
          <li class={pn.includes("rechner/") ? styles.active : ""}>
            <CalcIcon />
            <label>Rechner</label>
          </li>
        </Link>

        <Link href="/theorie">
          <li class={pn.includes("theorie/") ? styles.active : ""}>
            <TheoryIcon />
            <label>Theorie</label>
          </li>
        </Link>
      </ul>
    </nav>
  )
})