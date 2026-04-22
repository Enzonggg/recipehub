import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listRecipesApi } from '../services/recipeApi.js'

export function DashboardPage() {
  const [savedRecipes, setSavedRecipes] = useState([])

  useEffect(() => {
    let mounted = true

    const loadSaved = async () => {
      try {
        const response = await listRecipesApi({ favorites: 1, limit: 3 })
        if (mounted) {
          setSavedRecipes(response.recipes || [])
        }
      } catch {
        if (mounted) {
          setSavedRecipes([])
        }
      }
    }

    loadSaved()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="page-shell py-14">
      <h1 className="text-4xl">My Dashboard</h1>
      <p className="mt-2 opacity-75">Sample user view for bookmarks, engagement, and subscription status.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="stat rounded-2xl border border-base-300 bg-base-100">
          <div className="stat-title">Saved Recipes</div>
          <div className="stat-value text-primary">18</div>
        </div>
        <div className="stat rounded-2xl border border-base-300 bg-base-100">
          <div className="stat-title">Comments Posted</div>
          <div className="stat-value text-secondary">12</div>
        </div>
        <div className="stat rounded-2xl border border-base-300 bg-base-100">
          <div className="stat-title">Plan</div>
          <div className="stat-value text-accent">Premium</div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-base-300 bg-base-100 p-5">
        <h2 className="text-2xl">Saved Recipes</h2>
        <div className="mt-4 space-y-3">
          {savedRecipes.map((recipe) => (
            <div key={recipe.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-base-300 p-3">
              <div>
                <p className="font-semibold">{recipe.title}</p>
                <p className="text-xs opacity-70">{recipe.category} - {recipe.time}</p>
              </div>
              <Link to={`/customer/recipe/${recipe.id}`} className="btn btn-outline btn-sm">Open</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
