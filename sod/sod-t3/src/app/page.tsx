import LandingPage from "./landingpage/page";
import { DailySongPrefetchWrapper } from "./hooks/useDailySongPrefetch";

export default async function Home() {
  return (
    <>
      {/* <DailySongPrefetchWrapper> */}
        <LandingPage />
      {/* </DailySongPrefetchWrapper> */}
    </>
  );
}
