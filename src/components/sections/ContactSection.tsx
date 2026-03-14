import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import PhoneIcon from '../../assets/icons/phone.svg?react';
import EmailIcon from '../../assets/icons/email.svg?react';
import LocationIcon from '../../assets/icons/location.svg?react';
import { contactInfo } from './data/contactInfo';

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
    <section id="contact" className="contact">
      <div className="frame">
        <h2>Contactez-nous</h2>
        <p className="contact-subtitle">Des questions ou des remarques ? N'hésitez pas à nous écrire !</p>

        <div className="contact-grid">
          <aside className="contact-card">
            <h3>Contact Information</h3>
            <p>Say something to start a live chat!</p>

            <ul>
              <li>
                <PhoneIcon />
                <span>{contactInfo.phone}</span>
              </li>
              <li>
                <EmailIcon />
                <span>{contactInfo.email}</span>
              </li>
              <li>
                <LocationIcon />
                <span>{contactInfo.address}</span>
              </li>
            </ul>

            <div className="bubble-1" />
            <div className="bubble-2" />
          </aside>

          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <div className="row">
              <label>
                <span>First Name</span>
                <input {...register('firstName')} />
              </label>
              <label>
                <span>Last Name</span>
                <input {...register('lastName')} placeholder="Doe" />
              </label>
            </div>

            <div className="row">
              <label>
                <span>Email</span>
                <input {...register('email')} />
              </label>
              <label>
                <span>Phone Number</span>
                <input {...register('phoneNumber')} placeholder="+1 012 3456 789" />
              </label>
            </div>

            <label>
              <span>Message</span>
              <textarea {...register('message')} placeholder="Write your message.." rows={3} />
            </label>

            <div className="actions">
              <button type="submit">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
