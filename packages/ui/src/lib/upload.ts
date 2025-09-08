export const uploadToStorage = async ({
  preSignedUrl,
  file,
}: {
  preSignedUrl: string;
  file: File;
}): Promise<void> => {
  const response = await fetch(preSignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload avatar: ${response.statusText}`);
  }
};
