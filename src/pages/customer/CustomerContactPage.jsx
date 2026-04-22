export function CustomerContactPage() {
  return (
    <section className="panel-section mx-auto max-w-3xl">
      <h1 className="mb-3 text-center text-4xl font-bold">Contact Us</h1>
      <p className="mb-8 text-center opacity-70">If you have any feedback or concerns, feel free to contact us.</p>

      <form className="space-y-4">
        <label className="block">
          <span className="mb-2 block font-semibold">Your name:</span>
          <input className="panel-input" />
        </label>

        <label className="block">
          <span className="mb-2 block font-semibold">Your email:</span>
          <input className="panel-input" type="email" />
        </label>

        <label className="block">
          <span className="mb-2 block font-semibold">Subject:</span>
          <input className="panel-input" />
        </label>

        <label className="block">
          <span className="mb-2 block font-semibold">Your message:</span>
          <textarea className="panel-input min-h-40" />
        </label>

        <button className="panel-btn w-full bg-sky-600 text-white" type="button">Send Message</button>
      </form>
    </section>
  )
}
