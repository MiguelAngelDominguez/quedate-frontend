export function BackersMarquee() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
          Respaldado por
        </p>
        <div className="flex items-center justify-center gap-16">
          <img
            src="/logos/utec.png"
            alt="UTEC - Universidad de Ingeniería y Tecnología"
            loading="lazy"
            className="h-20 w-auto object-contain grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
          />
          <img
            src="/logos/pronabec.png"
            alt="PRONABEC"
            loading="lazy"
            className="h-20 w-auto object-contain grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
          />
        </div>
      </div>
    </section>
  )
}