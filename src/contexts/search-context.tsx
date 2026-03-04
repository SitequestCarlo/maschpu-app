import { createContextId, type Signal } from "@builder.io/qwik";

export const SearchContext = createContextId<Signal<boolean>>("search-open");
