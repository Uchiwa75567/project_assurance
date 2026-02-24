import type { FC } from 'react';
import Partner1 from '../../assets/partners/logoipsum-1.svg?react';
import Partner2 from '../../assets/partners/logoipsum-2.svg?react';
import Partner3 from '../../assets/partners/lapsim.svg?react';
import Partner4 from '../../assets/partners/logoipsum-3.svg?react';
import Partner5 from '../../assets/partners/logoipsum-4.svg?react';

const PartnersSection: FC = () => {
  return (
    <section className="bg-[#e7f0f9] px-4 pb-8 pt-14 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1220px]">
        <h2 className="text-center text-[34px] font-bold text-[#143155] md:text-[50px]">Nos partenaires</h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-10">
          <Partner1 className="h-8 w-auto max-w-[150px] md:max-w-[170px]" />
          <Partner2 className="h-8 w-auto max-w-[160px] md:max-w-[178px]" />
          <Partner3 className="h-8 w-auto max-w-[160px] md:max-w-[175px]" />
          <Partner4 className="h-8 w-auto max-w-[170px] md:max-w-[190px]" />
          <Partner5 className="h-8 w-auto max-w-[155px] md:max-w-[175px]" />
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
