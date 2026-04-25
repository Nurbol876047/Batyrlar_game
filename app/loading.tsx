export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-steppe-glow px-6 text-foreground">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative h-28 w-28">
          <div className="absolute inset-0 rounded-full border border-primary/40 bg-primary/10 blur-2xl" />
          <div className="absolute inset-4 animate-pulse-soft rounded-full border border-primary/70 bg-primary/15" />
          <div className="absolute inset-[34px] rounded-full bg-primary/80" />
        </div>
        <div className="space-y-2">
          <p className="font-display text-4xl font-semibold tracking-[0.18em] text-primary">
            Ерлік жолы
          </p>
          <p className="text-sm uppercase tracking-[0.35em] text-foreground/70">
            Дала рухы жүктелуде...
          </p>
        </div>
      </div>
    </main>
  );
}
