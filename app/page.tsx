import PrenotazioneModal from "@/components/PrenotazioneModal";
import SchedaUtente from "@/components/SchedaUtente";
import PhotoGallery from "@/components/PhotoGallery";

// La Home è un Server Component che compone i Client Components interattivi
export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-5 h-full">
      <PrenotazioneModal />
      <SchedaUtente />
      <div className="flex-1 min-h-0">
        <PhotoGallery />
      </div>
    </div>
  );
}
