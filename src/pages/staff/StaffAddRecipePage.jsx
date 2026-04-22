import { useState } from 'react'
import { createRecipeApi } from '../../services/recipeApi.js'

export function StaffAddRecipePage() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('Main Course')
  const [duration, setDuration] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [premium, setPremium] = useState(false)
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState([''])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const addIngredient = () => setIngredients((state) => [...state, ''])
  const addStep = () => setSteps((state) => [...state, ''])

  const updateIngredient = (index, value) => {
    setIngredients((state) => state.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const updateStep = (index, value) => {
    setSteps((state) => state.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorMessage('')

    try {
      await createRecipeApi({
        title,
        summary,
        category,
        course: category,
        duration,
        imageFile,
        videoUrl,
        premium,
        ingredients,
        instructions: steps,
      })

      setMessage('Recipe submitted successfully and is now pending admin review.')
      setTitle('')
      setSummary('')
      setDuration('')
      setImageFile(null)
      setVideoUrl('')
      setPremium(false)
      setIngredients([''])
      setSteps([''])
    } catch (error) {
      setErrorMessage(error.message || 'Failed to submit recipe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel-section">
      <form className="panel-card mx-auto max-w-4xl space-y-5 p-6" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-base font-semibold">Recipe Title</span>
          <input className="panel-input" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold">Summary</span>
          <textarea className="panel-input min-h-24" value={summary} onChange={(event) => setSummary(event.target.value)} />
        </label>

        <div>
          <span className="mb-2 block text-base font-semibold">Ingredients</span>
          {ingredients.map((item, index) => (
            <input
              key={`ingredient-${index}`}
              className="panel-input mb-2"
              value={item}
              onChange={(event) => updateIngredient(index, event.target.value)}
              placeholder="Enter an ingredient"
            />
          ))}
          <button className="panel-btn" onClick={addIngredient} type="button">+ Add Ingredient</button>
        </div>

        <div>
          <span className="mb-2 block text-base font-semibold">Instructions</span>
          {steps.map((item, index) => (
            <input
              key={`step-${index}`}
              className="panel-input mb-2"
              value={item}
              onChange={(event) => updateStep(index, event.target.value)}
              placeholder="Enter an instruction step"
            />
          ))}
          <button className="panel-btn" onClick={addStep} type="button">+ Add Step</button>
        </div>

        <label className="block">
          <span className="mb-2 block text-base font-semibold">Duration (in minutes)</span>
          <input className="panel-input" type="number" value={duration} onChange={(event) => setDuration(event.target.value)} required />
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold">Course Type</span>
          <select className="panel-input" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>Appetizer</option>
            <option>Main Course</option>
            <option>Dessert</option>
            <option>Healthy</option>
            <option>Quick Meals</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold">Recipe Image Upload</span>
          <input
            className="panel-input"
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          />
          <p className="mt-1 text-xs opacity-70">JPG, PNG, WEBP up to 5MB.</p>
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold">Cooking Video URL (optional)</span>
          <input
            className="panel-input"
            type="url"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://example.com/video.mp4"
          />
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={premium} onChange={(event) => setPremium(event.target.checked)} />
          <span>Mark as Premium</span>
        </label>

        {message ? <p className="text-success">{message}</p> : null}
        {errorMessage ? <p className="text-error">{errorMessage}</p> : null}

        <button className="panel-btn panel-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </form>
    </section>
  )
}
