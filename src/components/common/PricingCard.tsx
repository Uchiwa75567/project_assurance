import type { FC } from 'react';

interface Feature {
  text: string;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  subtitle?: string;
  features: Feature[];
  recommended?: boolean;
  bordered?: boolean;
}

const PricingCard: FC<PricingCardProps> = ({
  title,
  description,
  price,
  subtitle,
  features,
  recommended = false,
  bordered = false,
}) => {
  return (
    <article className="relative">
      {recommended && (
        <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-[#071530] px-3 py-1 text-[10px] font-semibold text-white">
            <span>★</span>
            <span>Recommandé</span>
          </div>
        </div>
      )}

      <div
        className={`h-full rounded-[10px] bg-white p-4 shadow-[0_2px_7px_rgba(7,21,48,0.08)] ${
          bordered ? 'border border-[#1a2440]' : 'border border-transparent'
        }`}
      >
        <h3 className="text-[22px] font-semibold leading-tight text-[#111827]">{title}</h3>
        <p className="mt-2 min-h-[68px] text-[11px] leading-[1.5] text-[#6b7280]">{description}</p>

        <div className="mt-3 border-t border-[#e5e7eb] pt-3">
          <p className="text-[38px] font-bold leading-none text-[#111827]">{price}</p>
          {subtitle && <p className="mt-1 text-[11px] text-[#111827]">{subtitle}</p>}
        </div>

        <ul className="mt-4 space-y-2.5">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-[11px] leading-[1.35] text-[#3f4755]">
              <span className="mt-[1px] text-[#071530]">✓</span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        <button className="mt-5 w-full rounded-[6px] bg-[#06152f] py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#0c234d]">
          Découvrir le programme
        </button>
      </div>
    </article>
  );
};

export default PricingCard;
