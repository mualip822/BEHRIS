import { LamaranRepository } from '../repositories/lamaran.repository';
import { JobApply } from '../types/lamaran.types';

export class LamaranService {
  private repository = new LamaranRepository();

  async getLamaranSaya(
  userId: string
): Promise<JobApply[]> {
    return this.repository.findByUserId(userId);
  }

  async getDetailLamaran(
  id: number,
  userId: string
) {
    return this.repository.findByIdAndUserId(id, userId);
  }
}