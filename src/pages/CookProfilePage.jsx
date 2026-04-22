import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cooks } from '../data/mockData.js'
import { listRecipesApi } from '../services/recipeApi.js'

export function CookProfilePage() {
  const { cookId } = useParams()
  const cook = cooks.find((item) => item.id === cookId)
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    let mounted = true

    const loadRecipes = async () => {
      try {
        const response = await listRecipesApi({ limit: 30 })
        if (mounted) {
          setRecipes(response.recipes || [])
        }
      } catch {
        if (mounted) {
          setRecipes([])
        }
      }
    }

    loadRecipes()

    return () => {
      mounted = false
    }
  }, [])

  const relatedRecipes = useMemo(() => {
    const specialty = String(cook?.specialty || '').toLowerCase()
    const filtered = recipes.filter((item) => specialty.includes(String(item.category || '').toLowerCase()))
    return filtered.slice(0, 3)
  }, [cook?.specialty, recipes])

  if (!cook) {
    return (
      <section className="page-shell py-20 text-center">
        <h1 className="text-4xl">Cook profile not found</h1>
        <Link to="/community" className="btn btn-primary mt-5">Back to community</Link>
      </section>
    )
  }

  return (
    <section className="page-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <img src={cook.image} alt={cook.name} className="h-96 w-full rounded-3xl object-cover" />
        <div>
          <span className="badge badge-success">Verified Professional Cook</span>
          <h1 className="mt-3 text-5xl">{cook.name}</h1>
          <p className="mt-2 text-lg opacity-80">{cook.specialty}</p>
          <p className="mt-3 max-w-2xl">{cook.bio}</p>
          <p className="mt-2 text-sm opacity-70">Experience: {cook.experience}</p>

          <div className="mt-8">
            <h2 className="text-2xl">Featured Recipes</h2>
            <div className="mt-3 space-y-3">
              {(relatedRecipes.length ? relatedRecipes : recipes.slice(0, 3)).map((recipe) => (
                <div key={recipe.id} className="rounded-xl border border-base-300 p-4">
                  <p className="font-semibold">{recipe.title}</p>
                  <p className="text-sm opacity-70">{recipe.category} - {recipe.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
