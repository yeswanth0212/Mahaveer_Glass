import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
