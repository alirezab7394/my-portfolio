import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Index");
  const title = t("title");

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">{title}</h1>
    </div>
  );
}
