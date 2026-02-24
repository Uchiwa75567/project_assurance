import type { FC } from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type AgentFormData = {
  prenoms: string;
  nom: string;
  telephone: string;
  zone: string;
  adresse: string;
  numeroCNI: string;
};

interface AjouterAgentFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const AjouterAgentForm: FC<AjouterAgentFormProps> = ({ onCancel, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<AgentFormData>();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: AgentFormData) => {
    console.log('Nouvel agent:', data);
    onSuccess?.();
  };

  const handleReset = () => {
    reset();
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="add-agent-form-card">
      <h2 className="add-agent-form-card__title">Ajouter un Agent</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Two-column fields ── */}
        <div className="add-agent-form__grid">
          {/* Left: Prénom(s) */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Prenom (s)<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('prenoms', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* Right: Prénom(s) */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Prenom (s)<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('nom', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* Left: Téléphone */}
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

          {/* Right: Zone */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Zone<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('zone', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* Left: Adresse */}
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              adresse<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('adresse', { required: true })}
              className="add-agent-form__input"
            />
          </div>

          {/* Right: CNI */}
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

        {/* ── Photo upload ── */}
        <p className="add-agent-form__upload-label">
          Importer la photo de l'agent:{' '}
          <strong className="add-agent-form__upload-label--optional">Optionnel</strong>
        </p>

        <div
          className="add-agent-form__upload-area"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <span className="add-agent-form__upload-text">
            {photoPreview
              ? 'Photo sélectionnée ✓'
              : "Cliquez pour Importer la photo de l'agent"}
          </span>
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Aperçu photo agent"
              className="add-agent-form__upload-preview"
            />
          ) : (
            <img
              src="/admin/icon-image-placeholder.svg"
              alt="Importer photo"
              className="add-agent-form__upload-icon"
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />

        {/* ── Actions ── */}
        <div className="add-agent-form__actions">
          <button
            type="button"
            className="add-agent-form__reset-btn"
            onClick={() => {
              handleReset();
              onCancel?.();
            }}
          >
            Réinitialiser
          </button>
          <button type="submit" className="add-agent-form__submit-btn">
            Valider
            <img src="/admin/icon-arrow-right.svg" alt="→" className="add-agent-form__submit-icon" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterAgentForm;
