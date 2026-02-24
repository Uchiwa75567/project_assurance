import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import PhoneIcon from '../../assets/icons/phone.svg?react';
import EmailIcon from '../../assets/icons/email.svg?react';
import LocationIcon from '../../assets/icons/location.svg?react';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const ContactSection: FC = () => {
  const { register, handleSubmit } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log(data);
  };

  return (
    <section id="contact" className="bg-[#e7f0f9] px-4 pb-14 pt-4 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1220px]">
        <h2 className="text-center text-[44px] font-bold text-[#0f2a4d] md:text-[58px]">Contactez-nous</h2>
        <p className="mt-1 text-center text-[24px] font-semibold text-[#4d4f58] md:text-[43px]">
          Des questions ou des remarques ? N'hésitez pas à nous écrire !
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="relative overflow-hidden rounded-lg bg-[#021727] p-7 text-white">
            <h3 className="text-[32px] font-semibold">Contact Information</h3>
            <p className="mt-2 text-[14px] text-[#d2d8df]">Say something to start a live chat!</p>

            <div className="mt-10 space-y-7">
              <div className="flex items-center gap-3 text-[14px]">
                <PhoneIcon className="h-4 w-4 flex-shrink-0 [&_path]:fill-white" />
                <span>+1012 3456 789</span>
              </div>
              <div className="flex items-center gap-3 text-[14px]">
                <EmailIcon className="h-4 w-4 flex-shrink-0 [&_path]:fill-white" />
                <span>demo@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 text-[14px] leading-relaxed">
                <LocationIcon className="mt-[1px] h-4 w-4 flex-shrink-0 [&_path]:fill-white" />
                <span>132 Dartmouth Street Boston, Massachusetts 02156 United States</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 h-28 w-28 rounded-full bg-white/15" />
            <div className="absolute -bottom-2 right-6 h-20 w-20 rounded-full bg-white/10" />
          </aside>

          <form onSubmit={handleSubmit(onSubmit)} className="grid content-start gap-7 pt-2">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] text-[#5e6673]">First Name</span>
                <input
                  {...register('firstName')}
                  className="mt-2 w-full border-b border-[#aab5c4] bg-transparent pb-1.5 text-[13px] outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-[#5e6673]">Last Name</span>
                <input
                  {...register('lastName')}
                  placeholder="Doe"
                  className="mt-2 w-full border-b border-[#aab5c4] bg-transparent pb-1.5 text-[13px] outline-none"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] text-[#5e6673]">Email</span>
                <input
                  {...register('email')}
                  className="mt-2 w-full border-b border-[#aab5c4] bg-transparent pb-1.5 text-[13px] outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-[#5e6673]">Phone Number</span>
                <input
                  {...register('phoneNumber')}
                  placeholder="+1 012 3456 789"
                  className="mt-2 w-full border-b border-[#aab5c4] bg-transparent pb-1.5 text-[13px] outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[11px] text-[#5e6673]">Message</span>
              <textarea
                {...register('message')}
                placeholder="Write your message.."
                rows={3}
                className="mt-2 w-full resize-none border-b border-[#aab5c4] bg-transparent pb-1.5 text-[13px] outline-none"
              />
            </label>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="rounded bg-[#03223f] px-10 py-2.5 text-sm font-medium text-white transition hover:bg-[#073258]"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
