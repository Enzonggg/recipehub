import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  deleteRecipeCommentApi,
  getRecipeByIdApi,
  postRecipeCommentApi,
  toggleRecipeFavoriteApi,
  toggleRecipeLikeApi,
} from '../../services/recipeApi.js'
import { getAuthUser } from '../../utils/authSession.js'
import {
  formatPhp,
  getUserCoinWallet,
  giftRecipeCoins,
  hasUserPurchasedRecipe,
  purchaseRecipeAccess,
} from '../../utils/monetizationStore.js'

function normalizeRecipe(recipe) {
  return {
    ...recipe,
    accessType: recipe?.accessType || (recipe?.premium ? 'premium' : 'free'),
    pricePhp: Number(recipe?.pricePhp || (recipe?.accessType === 'paid' ? 99 : 0)),
    ingredients: recipe?.ingredients || [],
    instructions: recipe?.instructions || recipe?.steps || [],
    comments: recipe?.comments || [],
    likes: Number(recipe?.likes || 0),
  }
}

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg)$/i.test(url || '')
}

export function CustomerRecipeDetailPage() {
  const { recipeId } = useParams()
  const currentUser = getAuthUser()
  const currentUserId = String(currentUser?.id || '')
  const [recipe, setRecipe] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(true)
  const [giftCoins, setGiftCoins] = useState('25')
  const [walletBalance, setWalletBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadRecipe = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await getRecipeByIdApi(recipeId)
        if (mounted) {
          setRecipe(normalizeRecipe(response.recipe))
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Failed to load recipe.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadRecipe()

    return () => {
      mounted = false
    }
  }, [recipeId])

  useEffect(() => {
    setWalletBalance(getUserCoinWallet(currentUserId))
  }, [currentUserId])

  if (loading) {
    return (
      <section className="panel-section py-10 text-center">
        <p>Loading recipe...</p>
      </section>
    )
  }

  if (!recipe) {
    return (
      <section className="panel-section py-10 text-center">
        <h1 className="text-4xl">{errorMessage || 'Recipe not found'}</h1>
        <Link to="/customer" className="btn btn-primary mt-5">Back to recipes</Link>
      </section>
    )
  }

  const imageSrc = recipe.image || '/recipe-placeholder.svg'
  const isPaidRecipe = recipe.accessType === 'paid'
  const isOwner = currentUserId && String(recipe.submittedBy || '') === currentUserId
  const hasPurchaseAccess = hasUserPurchasedRecipe(currentUserId, recipe.id)
  const canViewLockedContent = !isPaidRecipe || hasPurchaseAccess || isOwner

  const submitComment = async () => {
    if (!commentText.trim()) {
      return
    }

    try {
      const response = await postRecipeCommentApi(recipe.id, commentText)
      setRecipe((state) => ({
        ...state,
        comments: [response.comment, ...(state.comments || [])],
      }))
      setCommentText('')
    } catch {
      setErrorMessage('Failed to post comment.')
    }
  }

  const removeComment = async (id) => {
    try {
      await deleteRecipeCommentApi(recipe.id, id)
      setRecipe((state) => ({
        ...state,
        comments: (state.comments || []).filter((comment) => comment.id !== id),
      }))
    } catch {
      setErrorMessage('Failed to delete comment.')
    }
  }

  const toggleLike = async () => {
    try {
      const response = await toggleRecipeLikeApi(recipe.id)
      setRecipe((state) => ({
        ...state,
        liked: response.liked,
        likes: response.liked ? state.likes + 1 : Math.max(0, state.likes - 1),
      }))
    } catch {
      setErrorMessage('Failed to toggle like.')
    }
  }

  const toggleFavorite = async () => {
    try {
      const response = await toggleRecipeFavoriteApi(recipe.id)
      setRecipe((state) => ({
        ...state,
        favorited: response.favorited,
      }))
    } catch {
      setErrorMessage('Failed to update favorite.')
    }
  }

  const handleBuyRecipe = () => {
    const result = purchaseRecipeAccess({
      userId: currentUserId,
      recipe,
    })

    if (!result.ok) {
      setErrorMessage(result.message)
      return
    }

    setErrorMessage('')
  }

  const handleGiftCoins = () => {
    const result = giftRecipeCoins({
      userId: currentUserId,
      recipe,
      coins: Number(giftCoins),
    })

    if (!result.ok) {
      setErrorMessage(result.message)
      return
    }

    setWalletBalance(getUserCoinWallet(currentUserId))
    setErrorMessage('')
  }

  const accessLabel = recipe.accessType === 'paid' ? 'Paid Recipe' : recipe.accessType === 'premium' ? 'Premium' : 'Free'

  return (
    <section className="panel-section py-6">
      <img src={imageSrc} alt={recipe.title} className="h-[420px] w-full rounded-3xl object-cover" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="badge badge-outline">{recipe.course}</span>
            <span className="badge badge-ghost">{recipe.duration} minutes</span>
            <span className={`badge ${recipe.accessType === 'paid' ? 'badge-primary' : recipe.accessType === 'premium' ? 'badge-warning' : 'badge-success'}`}>
              {accessLabel}
            </span>
            {recipe.videoUrl ? <span className="badge badge-info">Video Included</span> : null}
          </div>

          <h1 className="text-4xl md:text-5xl">{recipe.title}</h1>
          {recipe.accessType === 'paid' ? <p className="mt-2 text-sm opacity-75">Price: {formatPhp(recipe.pricePhp)}</p> : null}

          {recipe.videoUrl ? (
            <div className="mt-6">
              <h2 className="text-2xl">Cooking Video</h2>
              {canViewLockedContent ? (
                isDirectVideoUrl(recipe.videoUrl) ? (
                  <video className="mt-3 w-full rounded-2xl" controls src={recipe.videoUrl}>
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <a href={recipe.videoUrl} target="_blank" rel="noreferrer" className="btn btn-outline mt-3">
                    Open Video Link
                  </a>
                )
              ) : (
                <p className="mt-3 rounded-xl border border-base-300 bg-base-100 p-3 text-sm opacity-80">
                  Buy this recipe first to view the attached cooking video.
                </p>
              )}
            </div>
          ) : null}

          <div className="mt-6">
            <h2 className="text-2xl">Instructions</h2>
            {canViewLockedContent ? (
              <ol className="mt-4 list-decimal space-y-3 pl-5">
                {recipe.instructions.map((step) => <li key={step}>{step}</li>)}
              </ol>
            ) : (
              <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-4">
                <p className="text-sm opacity-80">This paid recipe is locked. Purchase to unlock full instructions and video.</p>
              </div>
            )}
          </div>

          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button
                className={`btn ${recipe.liked ? 'btn-secondary' : 'btn-outline'}`}
                onClick={toggleLike}
                type="button"
              >
                {recipe.liked ? '♥ Liked' : '♡ Like'}
              </button>
              <span className="text-sm opacity-75">{recipe.likes} likes</span>
              <button className="btn btn-outline btn-sm" onClick={() => setShowComments((state) => !state)} type="button">
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </button>
            </div>

            {showComments ? (
              <>
                <h2 className="text-2xl">Comments</h2>
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  className="panel-input mt-4 min-h-24"
                  placeholder="Write a comment..."
                />
                <button className="btn btn-primary mt-3" onClick={submitComment} type="button">Post Comment</button>

                <div className="mt-6 space-y-3">
                  {(recipe.comments || []).map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-base-300 p-4">
                      <p className="font-semibold">{comment.author}</p>
                      <p className="text-sm opacity-80">{comment.message}</p>
                      {(getAuthUser()?.id === comment.userId || getAuthUser()?.role === 'admin') ? (
                        <button className="mt-2 text-xs text-error" onClick={() => removeComment(comment.id)} type="button">Delete</button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-2xl">Ingredients</h2>
              <Link to="/customer" className="btn btn-ghost btn-xs">Back</Link>
            </div>
            {canViewLockedContent ? (
              <ul className="space-y-2 text-sm">
                {recipe.ingredients.map((ingredient) => <li key={ingredient}>- {ingredient}</li>)}
              </ul>
            ) : (
              <p className="text-sm opacity-80">Ingredients are visible after purchase for paid recipes.</p>
            )}
            <button className="btn btn-primary mt-6 w-full" onClick={toggleFavorite}>
              {recipe.favorited ? 'Saved to favorites' : 'Save recipe'}
            </button>

            <div className="mt-6 space-y-3 rounded-xl border border-base-300 p-4">
              <h3 className="text-lg font-semibold">Support Creator</h3>

              {isPaidRecipe && !canViewLockedContent ? (
                <button className="btn btn-secondary w-full" type="button" onClick={handleBuyRecipe}>
                  Buy Recipe ({formatPhp(recipe.pricePhp)})
                </button>
              ) : null}

              <div>
                <p className="mb-2 text-xs uppercase tracking-wider opacity-70">Gift Coins</p>
                <div className="flex gap-2">
                  <select
                    className="select select-bordered w-full"
                    value={giftCoins}
                    onChange={(event) => setGiftCoins(event.target.value)}
                  >
                    <option value="10">10 coins</option>
                    <option value="25">25 coins</option>
                    <option value="50">50 coins</option>
                    <option value="100">100 coins</option>
                  </select>
                  <button className="btn btn-outline" type="button" onClick={handleGiftCoins}>Gift</button>
                </div>
                <p className="mt-2 text-xs opacity-70">Your wallet: {walletBalance} coins</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {errorMessage ? <p className="mt-6 text-error">{errorMessage}</p> : null}
    </section>
  )
}
