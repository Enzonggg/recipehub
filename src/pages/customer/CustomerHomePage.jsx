import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listRecipesApi } from '../../services/recipeApi.js'

export function CustomerHomePage() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadRecipes = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await listRecipesApi({ limit: 120 })
        if (mounted) {
          setRecipes(response.recipes || [])
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Failed to load recipes.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadRecipes()

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return recipes.filter((recipe) => recipe.title.toLowerCase().includes(query.toLowerCase()))
  }, [recipes, query])

  return (
    <section className="panel-section">
      <div className="mb-4 flex max-w-xl gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="panel-input"
          placeholder="Search recipes..."
        />
        <button className="panel-btn panel-btn-primary" type="button">Search</button>
      </div>

      <h1 className="panel-title">Recipes</h1>
      <p className="mb-6 text-sm opacity-80">Browse approved recipes curated by staff chefs.</p>

      {loading ? <p>Loading recipes...</p> : null}
      {errorMessage ? <p className="text-error">{errorMessage}</p> : null}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((recipe) => (
          <Link key={recipe.id} to={`/customer/recipe/${recipe.id}`} className="panel-card recipe-card">
            <img src={recipe.image || '/recipe-placeholder.svg'} alt={recipe.title} className="recipe-card-image" />
            <div className="recipe-card-body">
              <h2>{recipe.title}</h2>
              <p>{recipe.course}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {recipe.premium ? <span className="badge badge-warning">Premium</span> : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
