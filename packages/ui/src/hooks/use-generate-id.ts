import { nanoid } from 'nanoid';

const useGenerateUniqueId = () => {
  const generateUniqueId = () => nanoid();
  return generateUniqueId;
};

export default useGenerateUniqueId;
