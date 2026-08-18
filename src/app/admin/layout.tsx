export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      {children}
    </div>
  );
}
