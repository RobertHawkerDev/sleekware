export function AccountPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-neutral-100 pb-5 md:pb-6">
      {/* Heavy, sharp uppercase display heading */}
      <h1 className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[1.2] text-black">
        {title}
      </h1>

      {/* Flat, neutral body descriptive copy */}
      {description && (
        <p className="mt-2 text-xs sm:text-sm font-medium text-neutral-500 max-w-xl leading-relaxed normal-case">
          {description}
        </p>
      )}
    </div>
  );
}
