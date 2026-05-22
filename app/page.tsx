import PrenotazioneModal from "@/components/PrenotazioneModal";
import SchedaUtente from "@/components/SchedaUtente";
import PhotoGallery from "@/components/PhotoGallery";

// La Home è un Server Component che compone i Client Components interattivi
export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-10">
      <PrenotazioneModal />
      <SchedaUtente />
      <PhotoGallery />
    </div>
  );
}
