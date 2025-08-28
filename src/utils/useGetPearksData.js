import { useState, useEffect } from 'react';
import useStore from '../store/useStore.js';

// Mock data utility - replace with actual API when available
export const useGetPearksData = () => {
  const [data, setData] = useState({
    AllBooth: [],
    AllActivity: [],
    AllSample: [],
    AllSeminar: []
  });

  const { userInfo } = useStore();

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockData = {
      AllBooth: [
        {
          id: 1,
          booth_id: 'B001',
          booth_name: 'Technology Showcase',
          description: 'Latest in tech innovation',
          zone: 'Zone A',
          exhibitor: {
            booth_id: 'B001',
            company_name: 'TechCorp'
          }
        },
        {
          id: 2,
          booth_id: 'B002',
          booth_name: 'Health & Wellness',
          description: 'Products for better living',
          zone: 'Zone B',
          exhibitor: {
            booth_id: 'B002',
            company_name: 'HealthCo'
          }
        }
      ],
      AllActivity: [
        {
          id: 1,
          seminar_id: 'S001',
          title: 'AI in Business',
          description: 'Future of artificial intelligence',
          booth_stage_id: 'BS001',
          start_time: '09:00',
          end_time: '10:30'
        },
        {
          id: 2,
          seminar_id: 'S002',
          title: 'Digital Marketing',
          description: 'Latest marketing strategies',
          booth_stage_id: 'BS002',
          start_time: '11:00',
          end_time: '12:30'
        }
      ],
      AllSample: [
        {
          id: 1,
          sample_id: 'SA001',
          sample_name: 'Product Sample A',
          description: 'Try our latest product',
          booth_id: 'B001'
        }
      ],
      AllSeminar: [
        {
          id: 1,
          seminar_id: 'SE001',
          title: 'Industry Trends',
          description: 'What to expect in 2024',
          booth_stage_id: 'BS001',
          start_time: '14:00',
          end_time: '15:30'
        }
      ]
    };

    setData(mockData);
  }, [userInfo]);

  return data;
};
