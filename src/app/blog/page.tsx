import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Trail stories, GPX tips, and inspiration for turning your best hikes into wall art.",
  openGraph: {
    title: "Blog | TrailPlot",
    description:
      "Trail stories, GPX tips, and inspiration for turning your best hikes into wall art.",
    url: "https://trailplot.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | TrailPlot",
    description:
      "Trail stories, GPX tips, and inspiration for turning your best hikes into wall art.",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://trailplot.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://trailplot.com/blog" },
  ],
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="text-gray-500 mb-12">
            Trail stories, tips, and inspiration.
          </p>

          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <article key={post.slug} className="py-8">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <time className="text-sm text-gray-400">
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-emerald-700 group-hover:underline">
                    Read more →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 px-6 py-8">
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
