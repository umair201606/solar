import PageHero from "../components/shared/PageHero";
import StoreSection from "../components/store/StoreSection";
import PriceAlertBanner from "../components/store/PriceAlertBanner";

export default function Store() {
  return (
    <>
      <PageHero title="Store" />
      <StoreSection />
      <PriceAlertBanner />
    </>
  );
}
