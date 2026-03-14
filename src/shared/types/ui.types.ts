export type PlanFeature = {
  text: string;
};

export type PlanCard = {
  title: string;
  description: string;
  price: string;
  subtitle?: string;
  features: PlanFeature[];
  recommended?: boolean;
  bordered?: boolean;
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: string;
};
