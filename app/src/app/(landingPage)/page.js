import { getLandingPage } from "@/sanity/fetch";
import LandingPage from "./LandingPage";

export default async function Home({ searchParams }) {
  const page = await getLandingPage();

  const params = await searchParams;
  const selectedSectionKey = params?.section;
  const selectedView = params?.view;
  return <LandingPage page={page} selectedSectionKey={selectedSectionKey} selectedView={selectedView} />;
}
