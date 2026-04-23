import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { getAllSlugs, getPost } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://trailplot.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://trailplot.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://trailplot.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://trailplot.com/blog/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-gray-900">TrailPlot</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block"
          >
            ← All posts
          </Link>

          <time className="block text-sm text-gray-400 mt-4">
            {formatDate(post.date)}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 leading-snug">
            {post.title}
          </h1>

          <div
            className="mt-10 prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 px-6 py-8 mt-16">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span>TrailPlot</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/guide" className="hover:text-gray-700">
              GPX Guide
            </Link>
            <Link href="/blog" className="hover:text-gray-700">
              Blog
            </Link>
            <a href="mailto:trailplot@gmail.com" className="hover:text-gray-700">
              trailplot@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
