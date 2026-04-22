export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p> : null}
      <h2 className="text-3xl leading-tight md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm md:text-base opacity-80">{description}</p> : null}
    </div>
  )
}
