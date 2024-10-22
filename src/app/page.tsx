import Link from "next/link";

import { Modes } from "~/app/_components/modes";

import { api, HydrateClient } from "~/trpc/server";
import { Songs } from "./_components/songs";

export default async function Home() {

  void api.mode.getModes.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <Modes />
          <Songs />
      </main>
    </HydrateClient>
  );
}
