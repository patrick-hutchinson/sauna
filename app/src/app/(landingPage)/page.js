import { getLandingPage } from "@/sanity/fetch";
import LandingPage from "./LandingPage";

const page = await getLandingPage();

export default function Home() {
  return <LandingPage page={page} />;
}
