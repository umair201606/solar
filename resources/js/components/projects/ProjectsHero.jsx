import PageHero from "../shared/PageHero";

export default function ProjectsHero() {
  return (
    <PageHero
      title="Projects"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Projects" },
      ]}
    />
  );
}
