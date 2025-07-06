import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'fa'] as const;
export const localePrefix = 'as-needed'; // This allows the root domain to work
export const defaultLocale = 'en';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
    locales,
    localePrefix,
    defaultLocale
}); 