import type { FC } from 'react';
import PricingCard from '../common/PricingCard';

const ServicesSection: FC = () => {
  const plans = [
    {
      title: 'Pack Noppalé Santé',
      description:
        'Une couverture essentielle axée sur la prévention et les soins de base, idéale pour rester en bonne santé au quotidien à moindre coût.',
      price: '3 900 FCFA',
      features: [
        { text: 'Un de aides  M. 25K étudiants' },
        { text: 'Soins de consultation' },
        { text: 'Médicaments de base' },
        { text: 'Prévention (contrôle santé)' },
        { text: 'Accès site web' },
        { text: 'ID assurance numérique' },
      ],
      recommended: false,
      bordered: false,
    },
    {
      title: 'Pack Teranga Plus',
      description: 'Couverture haut de gamme avec garantie dentaire incluse.',
      price: '15 000 FCFA',
      features: [
        { text: 'Tout inclus' },
        { text: 'Hospitalisation' },
        { text: 'Soins dentaires complets' },
        { text: 'Détartrage' },
        { text: 'Extraction' },
        { text: 'Soins caries' },
        { text: 'Vision' },
        { text: 'Assistance santé' },
        { text: 'Service VIP' },
      ],
      recommended: true,
      bordered: true,
    },
    {
      title: 'Pack Yaay ak Ndaw',
      description:
        "Un accompagnement complet pour la maman et l'enfant, de la grossesse à l'accouchement, avec un suivi médical sécurisé et prioritaire.",
      price: '9 900 FCFA',
      features: [
        { text: 'Tout le Pack Kër Yaram' },
        { text: 'Suivi grossesse' },
        { text: 'Examens prénataux' },
        { text: 'Accouchement (plafonné)' },
        { text: 'Priorité en clinique partenaire' },
      ],
      recommended: true,
      bordered: true,
    },
    {
      title: 'Pack Kër Yaram',
      description:
        'Une solution pensée pour toute la famille, offrant des soins élargis et un suivi médical continu pour vous et vos proches.',
      price: '5 900 FCFA',
      features: [
        { text: 'Tout le Pack Noppalé santé' },
        { text: 'Plus un Enfants inclus' },
        { text: 'Soins courants' },
        { text: 'Médicaments étendus' },
        { text: 'Suivi médical familial' },
      ],
      recommended: false,
      bordered: false,
    },
  ];

  return (
    <section id="services" className="bg-[#fcfdff] px-4 py-14 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1220px]">
        <h2 className="text-center text-[36px] font-bold text-[#06152f] md:text-[52px]">Services offerts</h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
