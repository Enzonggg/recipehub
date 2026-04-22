export function CustomerPremiumPage() {
  return (
    <section className="panel-section flex min-h-[70vh] items-start justify-center pt-10">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold">Lifetime Premium Access</h1>
        <article className="panel-card mx-auto max-w-md p-8 text-center">
          <h2 className="text-4xl font-bold">You're Already a Premium Member!</h2>
          <p className="mt-4 text-lg opacity-80">Enjoy unlimited recipe access and unlocked locked recipes.</p>
          <button className="btn btn-primary mt-8 w-full" type="button">Already Subscribed</button>
        </article>
      </div>
    </section>
  )
}
