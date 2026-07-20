import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Client-side SEO sync.
 *
 * The authoritative SEO tags (title, description, canonical, Open Graph,
 * Twitter, JSON-LD) are rendered SERVER-SIDE in resources/views/app.blade.php
 * from the shared `seo` prop — that is what crawlers and social scrapers read.
 *
 * This component only keeps those exact same tags in sync during in-app
 * (client-side) navigation. It UPDATES the existing tags in place instead of
 * appending new ones, so there is never a duplicate <title> / <meta> tag.
 *
 * Per-page overrides can still be passed as props (e.g. blog/project detail).
 */

function setMeta(selector, value) {
    if (value == null) return;
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute('content', value);
}

function setLink(rel, href) {
    if (!href) return;
    const el = document.head.querySelector(`link[rel="${rel}"]`);
    if (el) el.setAttribute('href', href);
}

export default function SEO({ title, description, image, canonical } = {}) {
    const { props } = usePage();
    const seo = props?.seo ?? {};

    const finalTitle = title ?? seo.title;
    const finalDesc = description ?? seo.description;
    const finalImage = image ?? seo.image;
    const finalCanonical = canonical ?? seo.canonical;

    useEffect(() => {
        if (finalTitle) document.title = finalTitle;

        setMeta('meta[name="description"]', finalDesc);
        setMeta('meta[property="og:title"]', finalTitle);
        setMeta('meta[property="og:description"]', finalDesc);
        setMeta('meta[property="og:url"]', finalCanonical);
        setMeta('meta[property="og:image"]', finalImage);
        setMeta('meta[property="og:image:alt"]', finalTitle);
        setMeta('meta[name="twitter:title"]', finalTitle);
        setMeta('meta[name="twitter:description"]', finalDesc);
        setMeta('meta[name="twitter:image"]', finalImage);

        setLink('canonical', finalCanonical);
    }, [finalTitle, finalDesc, finalImage, finalCanonical]);

    return null;
}
