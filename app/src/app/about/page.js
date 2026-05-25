import { getAboutPage, getLandingPage } from "@/sanity/fetch";
import AboutPage from "./AboutPage";

export default async function Home() {
  const page = await getAboutPage();
  const landingPage = await getLandingPage();

  return <AboutPage page={page} landingPage={landingPage} />;
}
