import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { join } from "path";
import NextPage from "~/components/next-page/next-page";
import { readMdxMeta } from "~/utils/scan-routes";

export const useNextPage = routeLoader$(({ url }) => {
  const parts = url.pathname.replace(/^\/|\/$/, "").split("/");
  // Only content pages: /theorie/{category}/{page}/
  if (parts.length < 3) return null;

  const [, category, page] = parts;
  const theorieDir = join(process.cwd(), "src", "routes", "theorie");
  const currentMeta = readMdxMeta(
    join(theorieDir, category, page, "index.mdx"),
  );
  if (!currentMeta?.next) return null;

  const nextMeta = readMdxMeta(
    join(theorieDir, category, currentMeta.next, "index.mdx"),
  );
  if (!nextMeta?.title) return null;

  return {
    url: `/theorie/${category}/${currentMeta.next}/`,
    title: nextMeta.title,
  };
});

export default component$(() => {
  const nextPage = useNextPage();

  return (
    <>
      <Slot />
      {nextPage.value && (
        <NextPage href={nextPage.value.url} name={nextPage.value.title} />
      )}
    </>
  );
});
