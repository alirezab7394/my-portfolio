import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'fa'];

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the requestLocale since it's a Promise in Next.js 15
    const locale = await requestLocale;

    // Use default locale if none provided or invalid
    const finalLocale = locale && locales.includes(locale) ? locale : 'fa';

    // Validate that the final locale is valid
    if (!locales.includes(finalLocale)) notFound();

    return {
        locale: finalLocale,
        messages: (await import(`../../messages/${finalLocale}.json`)).default
    };
});