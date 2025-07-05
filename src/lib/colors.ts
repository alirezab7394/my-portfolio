/**
 * Brand color definitions for My Coach platform
 * Primary: #1E40AF (Navy Blue)
 * Secondary: #1F2937 (Dark Gray)
 */

export const brandColors = {
    primary: {
        hex: '#1E40AF',
        hsl: 'hsl(228, 71%, 40%)',
        oklch: 'oklch(0.4 0.153 263.5)',
        rgb: 'rgb(30, 64, 175)',
    },
    secondary: {
        hex: '#1F2937',
        hsl: 'hsl(217, 32%, 17%)',
        oklch: 'oklch(0.17 0.029 228.42)',
        rgb: 'rgb(31, 41, 55)',
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
        navy: {
            bg: 'bg-brand-navy',
            text: 'text-brand-navy',
            border: 'border-brand-navy',
        },
        darkGray: {
            bg: 'bg-brand-dark-gray',
            text: 'text-brand-dark-gray',
            border: 'border-brand-dark-gray',
        },
    },
});

export type ColorClasses = ReturnType<typeof getColorClasses>; 