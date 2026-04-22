import { SectionHeading } from '../components/common/SectionHeading.jsx'
import { communityPosts } from '../data/mockData.js'

export function CommunityPage() {
  return (
    <section className="page-shell py-14">
      <SectionHeading
        eyebrow="Community"
        title="Share your kitchen wins"
        description="React to recipes, post your outcomes, and learn from fellow home cooks."
      />

      <div className="space-y-4">
        {communityPosts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="font-semibold">{post.author}</p>
            <p className="text-sm opacity-70">Cooked: {post.recipe}</p>
            <p className="mt-3">{post.content}</p>
            <div className="mt-4 flex gap-2 text-sm">
              <span className="badge badge-ghost">{post.likes} likes</span>
              <span className="badge badge-ghost">{post.comments} comments</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
