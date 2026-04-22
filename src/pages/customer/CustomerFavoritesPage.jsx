import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listRecipesApi } from '../../services/recipeApi.js'

export function CustomerFavoritesPage() {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadFavorites = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await listRecipesApi({ favorites: 1, limit: 120 })
        if (mounted) {
          setFavorites(response.recipes || [])
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Failed to load favorites.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadFavorites()

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => favorites.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [favorites, query])

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

      <h1 className="mb-8 text-4xl font-bold">My Favorite Recipes</h1>

      {loading ? <p>Loading favorites...</p> : null}
      {errorMessage ? <p className="text-error">{errorMessage}</p> : null}

      {filtered.length === 0 ? <p className="opacity-70">No favorites matched your search.</p> : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((recipe) => (
          <Link key={recipe.id} to={`/customer/recipe/${recipe.id}`} className="panel-card recipe-card">
            <img src={recipe.image || '/recipe-placeholder.svg'} alt={recipe.title} className="recipe-card-image" />
            <div className="recipe-card-body">
              <h2>{recipe.title}</h2>
              <p>{recipe.course}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
