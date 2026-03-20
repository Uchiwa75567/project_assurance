import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { partenaireApi } from '../services/partenaireApi';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import { ApiError } from '../../../services/api/httpClient';

type PartenaireFormData = {
  nomContact: string;
  societe: string;
  adresse: string;
  telephone: string;
};

interface AjouterPartenaireFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const AjouterPartenaireForm: FC<AjouterPartenaireFormProps> = ({ onCancel, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartenaireFormData>();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data: PartenaireFormData) => {
    setError(null);
    setSaving(true);
    try {
      await partenaireApi.create({
        nom: data.nomContact,
        societe: data.societe,
        adresse: data.adresse,
        telephone: data.telephone,
      });
      handleReset();
      onSuccess?.();
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError("Impossible d'ajouter le partenaire.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    reset();
    setError(null);
  };

  return (
    <div className="add-agent-form-card">
      <h2 className="add-agent-form-card__title">Ajouter un partenaire</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="add-agent-form__grid">
          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Nom (s)<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('nomContact', { required: true })}
              className={`add-agent-form__input${errors.nomContact ? ' add-agent-form__input--error' : ''}`}
              aria-label="Nom du responsable"
            />
          </div>

          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              Société<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('societe', { required: true })}
              className={`add-agent-form__input${errors.societe ? ' add-agent-form__input--error' : ''}`}
              aria-label="Nom de la société"
            />
          </div>

          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              adresse<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('adresse', { required: true })}
              className={`add-agent-form__input${errors.adresse ? ' add-agent-form__input--error' : ''}`}
              aria-label="Adresse du partenaire"
            />
          </div>

          <div className="add-agent-form__field">
            <label className="add-agent-form__label">
              numéro de téléphone,<span className="add-agent-form__required">*</span>
            </label>
            <input
              {...register('telephone', { required: true })}
              placeholder="+221 77 123 45 67"
              className={`add-agent-form__input${errors.telephone ? ' add-agent-form__input--error' : ''}`}
              aria-label="Numéro de téléphone"
            />
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

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
          <button
            type="submit"
            className="add-agent-form__submit-btn"
            disabled={saving}
            aria-label="Valider l'ajout du partenaire"
          >
            {saving ? 'Enregistrement...' : 'Valider'}
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

export default AjouterPartenaireForm;
