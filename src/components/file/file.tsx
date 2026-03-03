import { component$ } from "@builder.io/qwik";
import styles from "~/styles/file.module.css";
import Icon from "~/assets/file-icon.svg?jsx";

type FileProps = {
  href: string;
  name: string;
};

export default component$(({ href, name }: FileProps) => {
  return (
    <>
      <a href={href} class={styles.file}>
        <Icon />
        <div class={styles.name}>
          <span>{name}</span>
          <span class={styles.filename}>{href.split("/").at(-1)}</span>
        </div>
      </a>
    </>
  );
});
