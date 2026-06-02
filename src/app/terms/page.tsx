import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-center">
        <Image
          src="/chalaja.webp"
          alt="Terms Banner"
          width={800}
          height={800}
          priority
          className="rounded-3xl shadow-lg mt-30"
        />
      </div>
    </div>
  );
}
