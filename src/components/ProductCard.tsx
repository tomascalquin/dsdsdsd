import Image from 'next/image'; 
import Link from 'next/link';

// 1. Definimos la "forma" que deben tener los datos. 
// Si intentas pasar un precio que sea texto, TS te gritará (eso es bueno).
interface ProductProps {
  id: number;
  title: string;
  price: number;
  image: string;
  slug: string;
}

export default function ProductCard({ title, price, image, slug }: ProductProps) {
  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {/* Next.js exige width y height para evitar saltos de carga */}
        <Image 
          src={image} 
          alt={title}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500"></p>
        </div>
        <p className="text-sm font-bold text-gray-900">${price.toLocaleString('es-CL')}</p>
      </div>
    </Link>
  );
}