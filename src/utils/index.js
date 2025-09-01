// Web utility hooks mirroring mobile utils
// Provides useGetPearksData that returns the parsed "homeData" JSON
// with the same property names used by the mobile app (PlanVisitList.js)

import { useMemo } from 'react';

// Read and normalize homeData from localStorage once per render
export const useGetPearksData = () => {
  return useMemo(() => {
    try {
      const raw = localStorage.getItem('homeData');
      if (!raw) return {};
      const data = JSON.parse(raw);

      // Return with the same keys mobile uses
      // Many keys already match the mobile structure
      return {
        Exibitor: data?.Exibitor || data?.exhibitor || [],
        event: data?.event || [],
        AllAcivity: data?.AllAcivity || data?.activities || [],
        sample: data?.sample || data?.samples || [],
        seminars: data?.seminars || [],
        speaker: data?.speaker || [],
        Booth_N_Zone_with_company: data?.Booth_N_Zone_with_company || [],
        category: data?.category || [],
        show_exhibitor: data?.show_exhibitor || [],
        Booth_N_Zone: data?.Booth_N_Zone || [],
      };
    } catch (e) {
      console.warn('useGetPearksData: failed to parse homeData', e);
      return {};
    }
  }, []);
};

export default { useGetPearksData };


