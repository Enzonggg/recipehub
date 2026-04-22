import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthRequiredModal } from '../components/auth/AuthRequiredModal.jsx'
import { RecipeCard } from '../components/common/RecipeCard.jsx'
import { SectionHeading } from '../components/common/SectionHeading.jsx'
import { communityPosts, plans } from '../data/mockData.js'
import { listRecipeCategoriesApi, listRecipesApi } from '../services/recipeApi.js'
import { isCustomerAuthenticated } from '../utils/authSession.js'

export function HomePage() {
  const navigate = useNavigate()
  const signedInCustomer = isCustomerAuthenticated()
  const [modalState, setModalState] = useState({ open: false, nextPath: '/customer' })
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let mounted = true

    const loadHomeRecipes = async () => {
      try {
        const [categoryResponse, recipeResponse] = await Promise.all([
          listRecipeCategoriesApi(),
          listRecipesApi({ limit: 8 }),
        ])

        if (!mounted) {
          return
        }

        setCategories(categoryResponse.categories || [])
        setRecipes(recipeResponse.recipes || [])
      } catch {
        if (!mounted) {
          return
        }

        setCategories([])
        setRecipes([])
      }
    }

    loadHomeRecipes()

    return () => {
      mounted = false
    }
  }, [])

  const promptIfGuest = (event, nextPath) => {
    if (isCustomerAuthenticated()) {
      return
    }

    event.preventDefault()
    setModalState({ open: true, nextPath })
  }

  const openGuestPrompt = (nextPath) => {
    setModalState({ open: true, nextPath })
  }

  const scrollToPremiumPlans = () => {
    const premiumSection = document.getElementById('premium-plans')
    premiumSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePremiumPlanClick = () => {
    if (isCustomerAuthenticated()) {
      navigate('/customer/premium')
      return
    }

    setModalState({ open: true, nextPath: '/premium' })
  }

  return (
    <>
      <section className="grain-bg border-b border-base-300/60 py-16">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Cook. Share. Learn.</p>
            <h1 className="text-5xl leading-tight md:text-6xl">Your all-in-one recipe and cooking platform.</h1>
            <p className="mt-5 max-w-xl text-base-content/80">
              Discover trusted recipes, save favorites, and join a real community built for home cooks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="btn btn-primary"
                to="/customer"
                onClick={(event) => promptIfGuest(event, '/customer')}
              >
                Explore recipes
              </Link>
              <button className="btn btn-outline" type="button" onClick={scrollToPremiumPlans}>
                View premium plans
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80"
              alt="Fresh ingredients and cooked food"
              className="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-base-100 p-4 shadow-xl">
              <p className="text-sm opacity-70">Available recipes</p>
              <p className="text-2xl font-semibold">{recipes.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-14">
        <SectionHeading
          eyebrow="Browse"
          title="Popular categories"
          description="Find recipes by mood, cuisine, or cooking pace."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <div key={category} className="rounded-2xl border border-base-300 bg-base-100 p-5 text-center font-semibold shadow-sm">
              {category}
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell py-4">
        <SectionHeading
          eyebrow="Featured"
          title="Recipes people love right now"
          description="Handpicked selections from our community and pro cooks."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onRequireAuth={openGuestPrompt}
              detailBasePath="/customer/recipe"
            />
          ))}
        </div>
      </section>

      <section className="page-shell py-14">
        <SectionHeading
          eyebrow="Community"
          title="What Our Community Is Cooking"
          description="Real feedback and shared kitchen wins from RecipeHub users."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {communityPosts.slice(0, 2).map((post) => (
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

      <section id="premium-plans" className="page-shell pb-16 pt-4">
        <SectionHeading
          eyebrow="Premium"
          title="Unlock More With Premium"
          description="Choose a plan that fits your cooking journey."
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
                <button
                  className={`btn mt-6 ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}
                  onClick={handlePremiumPlanClick}
                  type="button"
                >
                  {plan.highlighted ? 'Subscribe now' : 'Continue free'}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <Link className="btn btn-outline" to={signedInCustomer ? '/customer' : '/register'}>
            {signedInCustomer ? 'Go to my home' : 'Create account to continue'}
          </Link>
        </div>
      </section>

      <AuthRequiredModal
        open={modalState.open}
        nextPath={modalState.nextPath}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
      />
    </>
  )
}
