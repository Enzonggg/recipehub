import { Link } from 'react-router-dom'

export function RecipeCard({ recipe, onRequireAuth, detailBasePath = '/customer/recipe' }) {
  const detailPath = `${detailBasePath}/${recipe.id}`
  const imageSrc = recipe.image || '/recipe-placeholder.svg'

  const handleViewRecipe = (event) => {
    if (!onRequireAuth) {
      return
    }

    event.preventDefault()
    onRequireAuth(detailPath)
  }

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <figure>
        <img src={imageSrc} alt={recipe.title} className="h-52 w-full object-cover" loading="lazy" />
      </figure>
      <div className="card-body">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-outline">{recipe.category}</span>
          <span className="text-xs opacity-70">{recipe.rating || '4.0'} star</span>
        </div>
        <h3 className="card-title text-xl">{recipe.title}</h3>
        <p className="line-clamp-2 text-sm opacity-80">{recipe.summary}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="badge badge-ghost">{recipe.difficulty}</span>
          <span className="badge badge-ghost">{recipe.time}</span>
          {recipe.premium ? <span className="badge badge-warning">Premium</span> : null}
        </div>
        <div className="card-actions mt-4 justify-end">
          <Link className="btn btn-primary btn-sm" to={detailPath} onClick={handleViewRecipe}>
            View recipe
          </Link>
        </div>
      </div>
    </article>
  )
}
