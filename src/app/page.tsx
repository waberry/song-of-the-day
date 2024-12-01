import { api, HydrateClient } from "~/trpc/server";
import { Songs } from "./_components/songs";
import { Modes } from "./_components/modes";

export default async function Home() {
  void api.mode.getModes.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Modes />
          <Songs />
        </div>
      </main>
    </HydrateClient>
  );
}
