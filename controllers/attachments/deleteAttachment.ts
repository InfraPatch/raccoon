import { getStorageStrategy } from '@/lib/storageStrategies';
const storage = getStorageStrategy();

export const deleteAttachment = async (
  attachmentType: string,
  parentId: number,
  attachmentFilename: string,
): Promise<void> => {
  await storage.delete(
    `attachments/${attachmentType}/${parentId}/${attachmentFilename}`,
  );
};
