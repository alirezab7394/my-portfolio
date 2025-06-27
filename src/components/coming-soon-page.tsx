import { ReactNode } from "react";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function ComingSoonPage({ title, description, icon }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">{icon}</div>
        <h1 className="text-3xl font-bold text-secondary mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <span>🚧</span>
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
