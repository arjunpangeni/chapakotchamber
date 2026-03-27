import { cn } from '@/lib/utils'

type PageIntroProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  className?: string
  align?: 'left' | 'center'
}

export default function PageIntro({
  title,
  subtitle,
  eyebrow,
  className,
  align = 'center',
}: PageIntroProps) {
  return (
    <section
      className={cn(
        'space-y-2',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && (
        <p
          className={cn(
            'text-sm md:text-base text-foreground/70',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-3xl'
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'h-px bg-border/70 pt-2',
          align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-3xl'
        )}
      />
    </section>
  )
}
