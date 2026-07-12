import { OptionRepository } from '../repositories/option.repository';
import { CreateOptionDTO, UpdateOptionDTO } from '../types';
import { NotFoundError } from '../../../../core/middlewares/error.middleware';

const optionRepo = new OptionRepository();

export class OptionService {
  async create(dto: CreateOptionDTO, optionImagePath?: string) {
    const data = { ...dto, option_image: optionImagePath || dto.option_image || null };
    return optionRepo.create(data);
  }

  async update(id: string, dto: UpdateOptionDTO, optionImagePath?: string) {
    const opt = await optionRepo.findById(id);
    if (!opt) throw new NotFoundError('Option not found');
    const updateData: any = { ...dto };
    if (optionImagePath) updateData.option_image = optionImagePath;
    return optionRepo.update(id, updateData);
  }

  async delete(id: string) {
    const opt = await optionRepo.findById(id);
    if (!opt) throw new NotFoundError('Option not found');
    await optionRepo.delete(id);
  }
}