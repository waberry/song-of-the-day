import { api, HydrateClient } from "~/trpc/server";
import { Songs } from "./_components/songs";

export default async function Home() {
<<<<<<< HEAD
  // const hello = await api.post.hello({ text: "from tRPC" });
=======
>>>>>>> 3af6fe3 (DayEntry And mode logic)

  // void api.mode.getModes.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
<<<<<<< HEAD
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            lol
          </div>
        </div>
=======
          <Modes />
          <Songs />
>>>>>>> 3af6fe3 (DayEntry And mode logic)
      </main>
    </HydrateClient>
  );
}
