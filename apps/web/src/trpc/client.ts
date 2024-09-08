import type { AppRouter } from "api-trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      transformer: superjson,
    }),
  ],
});
