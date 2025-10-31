import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:shadow-blue-200/50 hover:scale-105 hover:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-14 rounded-lg px-8 text-lg md:h-16 md:text-xl has-[>svg]:px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function isFormCTA(children: React.ReactNode) {
  if (!children) return false;
  if (typeof children === 'string') {
    const txt = children.toLowerCase()
    return txt.includes('solicita') || txt.includes('empezar ahora') || txt.includes('tu coche gratis') || txt.includes('abrir formulario')
  } else if (Array.isArray(children)) {
    return children.some(c => isFormCTA(c))
  } else if (typeof children === 'object' && 'props' in children && children.props && children.props.children) {
    return isFormCTA(children.props.children)
  }
  return false;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  // intercept CTA: scroll to #formulario o abrir Tally en nueva pestaña en móvil
  function handleClick(e) {
    if(isFormCTA(children)){
      // si existe el elemento 'formulario', scroll. Sino, abre tally.
      const tgt = document.getElementById('formulario')
      if(tgt) {
        tgt.scrollIntoView({behavior: 'smooth'}); e.preventDefault(); return;
      }
      window.open("https://tally.so/r/YOUR_FORM_ID",'_blank');
      e.preventDefault();
      return;
    }
    if(onClick) onClick(e);
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  )
}
export { Button, buttonVariants }

