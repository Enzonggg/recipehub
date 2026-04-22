import { SectionHeading } from '../components/common/SectionHeading.jsx'
import { plans } from '../data/mockData.js'

export function PremiumPage() {
  return (
    <section className="page-shell py-14">
      <SectionHeading
        eyebrow="Subscription"
        title="Choose your RecipeHub plan"
        description="Unlock premium content, exclusive recipes, and enhanced platform features."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`card border ${plan.highlighted ? 'border-primary bg-primary/5' : 'border-base-300 bg-base-100'} shadow-sm`}
          >
            <div className="card-body">
              <h3 className="text-3xl">{plan.title}</h3>
              <p className="text-2xl font-semibold">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.perks.map((perk) => <li key={perk}>- {perk}</li>)}
              </ul>
              <button className={`btn mt-6 ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}>
                {plan.highlighted ? 'Subscribe now' : 'Continue free'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
