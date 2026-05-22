import PrenotazioneModal from "@/components/PrenotazioneModal";
import SchedaUtente from "@/components/SchedaUtente";
import PhotoGallery from "@/components/PhotoGallery";

// La Home è un Server Component che compone i Client Components interattivi
export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-3 space-y-5">
      <PrenotazioneModal />
      <SchedaUtente />
      <PhotoGallery />
    </div>
  );
}
