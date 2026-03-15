import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/axios';

interface BrandingConfig {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  supportEmail: string;
}

const defaultBranding: BrandingConfig = {
  companyName: 'RustDesk Enterprise',
  logoUrl: null,
  primaryColor: '#10b981',
  supportEmail: 'suporte@empresa.com',
};

const BrandingContext = createContext<BrandingConfig>(defaultBranding);

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const [branding, setBranding] = useState<BrandingConfig>(defaultBranding);

  useEffect(() => {
    api.get('/downloads/branding')
      .then(res => setBranding(res.data))
      .catch(() => setBranding(defaultBranding));
  }, []);

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
};
