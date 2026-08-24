export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {children}
    </div>
  );
}
