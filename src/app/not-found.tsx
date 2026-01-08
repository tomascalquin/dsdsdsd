import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-gray-100">404</h1>
      <div className="absolute">
        <p className="text-2xl font-bold text-gray-900 mb-2">¡Ups! Te perdiste</p>
        <p className="text-gray-500 mb-8">Ese producto o página ya no existe.</p>
        <Link 
          href="/" 
          className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
        >
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}