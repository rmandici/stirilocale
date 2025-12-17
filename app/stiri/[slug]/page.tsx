import { notFound } from "next/navigation";
import { getPostBySlug } from "../../lib/wp"; // o facem imediat

export default async function Stire({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {post.category.name}
      </div>

      <h1
        className="mt-2 text-4xl font-extrabold leading-tight"
        dangerouslySetInnerHTML={{ __html: post.title }}
      />

      <div className="mt-3 text-sm font-semibold text-gray-400">
        BY {post.author} ·{" "}
        {new Date(post.publishedAt).toLocaleDateString("ro-RO")}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="mt-6 w-full max-h-[520px] object-cover"
        />
      )}

      <div
        className="prose prose-lg mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.video && (
        <div className="mt-10">
          <video controls className="w-full">
            <source src={post.video} />
          </video>
        </div>
      )}
    </main>
  );
}
