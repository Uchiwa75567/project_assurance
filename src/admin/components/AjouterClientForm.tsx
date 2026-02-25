import type { FC } from 'react';
import { useForm } from 'react-hook-form';

type ClientFormData = {
  prenoms: string;
  nom: string;
  dateNaissance: string;
  telephone: string;
  adresse: string;
  numeroCNI: string;
  packAssurance: string;
};

interface AjouterClientFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const packOptions = [
  { value: 'basic', label: 'Pack Basic' },
  { value: 'standard', label: 'Pack Standard' },
  { value: 'premium', label: 'Pack Premium' },
  { value: 'famille', label: 'Pack Famille' },
];

const AjouterClientForm: FC<AjouterClientFormProps> = ({ onCancel, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm<ClientFormData>();

  const onSubmit = (data: ClientFormData) => {
    console.log('Nouveau client:', data);
    onSuccess?.();
  };

  const handleReset = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className="add-agent-form-card">
      <h2 className="add-agent-form-card__title">Ajouter un Client</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Two-column fields ── */}
        <div className="add-agent-form__grid">
          {/* Prenom(s) */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Prenom (s)<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('prenoms', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* Nom */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Nom<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('nom', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* Date de naissance */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              date de naissance<span className="add-agent-form__required">*</span>
            </label>
            <div className="add-client-form__date-wrap">
              <input
                type="date"
                {...register('dateNaissance', { required: true })}
                className="add-agent-form__input add-client-form__date-input"
              />
              <img
                src="/admin/icon-calendar.svg"
                alt="calendrier"
                className="add-client-form__date-icon"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              numéro de téléphone,<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('telephone', { required: true })}
              placeholder="+221 77 123 45 67"
              className="add-agent-form__input"
            />
          </div>

          {/* Adresse */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              adresse<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('adresse', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* CNI */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              numéro d'identification (CNI)<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('numeroCNI', { required: true })}
              className="add-agent-form__input"
            />
          </div>
        </div>

        {/* ── Pack d'assurance (full-width dropdown) ── */}
        <div className="add-agent-form__field add-client-form__pack-field">
          <label className="add-agent-form__label add-client-form__pack-label">
            le pack d'assurance choisi par le client
          </label>
          <div className="add-client-form__select-wrap">
            <select
              {...register('packAssurance')}
              className="add-agent-form__input add-client-form__select"
              defaultValue=""
            >
              <option value="" disabled>
                Choisissez le pack d'assurance choisi par le client
              </option>
              {packOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <img
              src="/admin/icon-dropdown-triangle.svg"
              alt="▾"
              className="add-client-form__select-icon"
            />
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="add-agent-form__actions add-client-form__actions">
          <button
            type="button"
            className="add-agent-form__reset-btn"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
          <button type="submit" className="add-agent-form__submit-btn">
            Valider
            <img
              src="/admin/icon-arrow-right.svg"
              alt="→"
              className="add-agent-form__submit-icon"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterClientForm;
