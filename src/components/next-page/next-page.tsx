import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "~/styles/next-page.module.css";

import Arrow from "./right-arrow.svg?jsx";

type NextPageProps = {
  href: string;
  name: string;
};

export default component$(({ href, name }: NextPageProps) => {
  return (
    <Link href={href} class={styles.nextPage}>
      {name}
      <span>Nächster Abschnitt</span>
      <Arrow class={styles.arrow} />
    </Link>
  );
});
