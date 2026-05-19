import PageHero from "../components/shared/PageHero";
import StoreSection from "../components/store/StoreSection";
import Reveal from "../components/shared/Reveal";

export default function Store() {
  return (
    <>
      <PageHero
        title="Store"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Store" },
        ]}
      />
      <Reveal animation="fade-up" delay="50ms" slideOffset={60}>
        <StoreSection />
      </Reveal>
    </>
  );
}
