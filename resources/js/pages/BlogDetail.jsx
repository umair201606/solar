import { Link } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import PageHero from "../components/shared/PageHero";
import SEO from "../components/SEO";
import { blogPosts, getPostBySlug } from "../data/blogData";

function Block({ block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-12 mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-dark-bg">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span className="text-base sm:text-lg leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-10 rounded-2xl border-l-4 border-primary bg-light-bg px-6 py-6 text-lg sm:text-xl font-semibold italic leading-relaxed text-dark-bg">
          {block.text}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-10">
          <img
            src={block.src}
            alt={block.caption || ""}
            loading="lazy"
            className="w-full rounded-[1.5rem] object-cover shadow-lg"
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return (
        <p className="my-5 text-base sm:text-lg leading-relaxed text-gray-700">
          {block.text}
        </p>
      );
  }
}

export default function BlogDetail({ slug }) {
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <>
        <PageHero title="Article Not Found" />
        <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-gray-600">
            We couldn&apos;t find the article you were looking for.
          </p>
          <Link href="/#blog" className="font-bold text-dark-bg hover:text-primary">
            Back to the Blog
          </Link>
        </div>
      </>
    );
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <SEO title={post.title} description={post.excerpt} />
      <PageHero title="Solarkon Blog" />

      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        {/* Back link */}
        <Link
          href="/#blog"
          className="mb-8 flex w-fit items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-dark-bg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Category */}
        <span className="mb-5 inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-dark-bg">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-dark-bg sm:text-4xl lg:text-[2.75rem]">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary" /> {post.author}
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" /> {post.date}
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> {post.readTime}
          </span>
        </div>

        {/* Hero image */}
        <img
          src={post.img}
          alt={post.title}
          className="mb-4 h-[280px] w-full rounded-[1.75rem] object-cover shadow-xl sm:h-[420px]"
        />

        {/* Lead excerpt */}
        <p className="mb-2 border-b border-gray-100 pb-8 text-lg font-medium leading-relaxed text-dark-bg sm:text-xl">
          {post.excerpt}
        </p>

        {/* Body */}
        <div>
          {post.content.map((block, idx) => (
            <Block key={idx} block={block} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-start gap-5 rounded-[2rem] bg-dark-bg p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">Ready to switch to solar?</h3>
            <p className="mt-1 text-sm text-gray-300">
              Talk to our engineers about the right system and financing for you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-dark-bg transition-colors hover:bg-white"
          >
            Get a Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      {/* Read next */}
      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-dark-bg">
            Read Next
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex gap-4 rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                />
                <div className="flex flex-col justify-center">
                  <span className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-shadow-primary-hover">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-bold leading-snug text-dark-bg line-clamp-3 group-hover:text-primary-hover">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
