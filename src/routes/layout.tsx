import { component$, Slot, useSignal, useContextProvider, useVisibleTask$ } from "@builder.io/qwik";
import { type RequestHandler, useLocation } from "@builder.io/qwik-city";
import NavBar from "~/components/nav-bar/nav-bar";
import SearchOverlay from "~/components/search/search-overlay";
import { SearchContext } from "~/contexts/search-context";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const searchOpen = useSignal(false);
  useContextProvider(SearchContext, searchOpen);

  const loc = useLocation();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => loc.url.pathname);
    document.querySelector('.content')?.scrollTo(0, 0);
  });

  return (
    <>
      <NavBar />
      <div class="content">
        <main>
          <Slot />
        </main>
      </div>
      <SearchOverlay open={searchOpen} />
    </>
  );
});
