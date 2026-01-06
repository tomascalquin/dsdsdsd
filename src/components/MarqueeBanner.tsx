import Marquee from "react-fast-marquee";

export default function MarqueeBanner() {
  return (
    <div className="bg-orange-500 text-white py-2 overflow-hidden border-b border-orange-600">
      <Marquee gradient={false} speed={40}>
        <div className="flex gap-12 mx-6 font-bold text-xs tracking-widest uppercase">
          <span>🔥 Envíos a todo Chile</span>
          <span>💳 3 Cuotas sin interés</span>
          <span>💎 Calidad Premium Garantizada</span>
          <span>🔥 Envíos a todo Chile</span>
          <span>💳 3 Cuotas sin interés</span>
          <span>💎 Calidad Premium Garantizada</span>
        </div>
      </Marquee>
    </div>
  );
}