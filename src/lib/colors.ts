/**
 * Brand color definitions for Portfolio
 * Primary: #1a5f7a (Sophisticated Teal)
 * Secondary: #2d2d2d (Warm Dark)
 */

export const brandColors = {
    primary: {
        hex: '#1a5f7a',
        hsl: 'hsl(195, 65%, 29%)',
        oklch: 'oklch(0.42 0.08 220)',
        rgb: 'rgb(26, 95, 122)',
    },
    secondary: {
        hex: '#2d2d2d',
        hsl: 'hsl(0, 0%, 18%)',
        oklch: 'oklch(0.2 0.01 0)',
        rgb: 'rgb(45, 45, 45)',
    },
    accent: {
        hex: '#e8f4f8',
        hsl: 'hsl(195, 47%, 94%)',
        oklch: 'oklch(0.95 0.02 220)',
        rgb: 'rgb(232, 244, 248)',
    },
} as const;

export const getColorClasses = () => ({
    // Primary color classes
    primary: {
        bg: 'bg-primary',
        text: 'text-primary',
        border: 'border-primary',
        ring: 'ring-primary',
        hover: 'hover:bg-primary/90',
        active: 'active:bg-primary/95',
        // Specific shades
        50: 'bg-primary-50',
        100: 'bg-primary-100',
        200: 'bg-primary-200',
        300: 'bg-primary-300',
        400: 'bg-primary-400',
        500: 'bg-primary-500',
        600: 'bg-primary-600',
        700: 'bg-primary-700',
        800: 'bg-primary-800',
        900: 'bg-primary-900',
        950: 'bg-primary-950',
    },
    // Secondary color classes
    secondary: {
        bg: 'bg-secondary',
        text: 'text-secondary',
        border: 'border-secondary',
        ring: 'ring-secondary',
        hover: 'hover:bg-secondary/90',
        active: 'active:bg-secondary/95',
        // Specific shades
        50: 'bg-secondary-50',
        100: 'bg-secondary-100',
        200: 'bg-secondary-200',
        300: 'bg-secondary-300',
        400: 'bg-secondary-400',
        500: 'bg-secondary-500',
        600: 'bg-secondary-600',
        700: 'bg-secondary-700',
        800: 'bg-secondary-800',
        900: 'bg-secondary-900',
        950: 'bg-secondary-950',
    },
    // Brand color classes
    brand: {
        teal: {
            bg: 'bg-brand-teal',
            text: 'text-brand-teal',
            border: 'border-brand-teal',
        },
        dark: {
            bg: 'bg-brand-dark',
            text: 'text-brand-dark',
            border: 'border-brand-dark',
        },
    },
});

export type ColorClasses = ReturnType<typeof getColorClasses>;
