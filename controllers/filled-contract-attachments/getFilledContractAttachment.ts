import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';
import { isWitnessOf } from '../filled-contracts/signUtils';

class GetFilledContractAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetFilledContractAttachmentError';
    this.code = code;
  }
}

export interface FilledContractAttachmentResponse {
  user: User;
  attachment: FilledContractAttachment;
}

export const getFilledContractAttachment = async (
  email: string,
  attachmentId: number,
): Promise<FilledContractAttachmentResponse> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const attachmentRepository = db.getRepository(FilledContractAttachment);

  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new GetFilledContractAttachmentError('USER_NOT_FOUND');
  }

  const attachment = await attachmentRepository.findOne(attachmentId, {
    relations: ['filledContract', 'filledContract.witnessSignatures'],
  });

  if (!attachment) {
    throw new GetFilledContractAttachmentError('ATTACHMENT_NOT_FOUND');
  }

  const filledContract = attachment.filledContract;

  if (
    !user.isAdmin &&
    ![filledContract.userId, filledContract.buyerId].includes(user.id) &&
    !isWitnessOf(user.id, filledContract)
  ) {
    throw new GetFilledContractAttachmentError('ACCESS_TO_ATTACHMENT_DENIED');
  }

  return { user, attachment };
};
