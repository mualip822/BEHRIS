import { LowonganRepository } from '../repositories/lowongan.repository';
import {
  CreateLowonganDTO,
  UpdateLowonganDTO,
  LowonganFilter,
  Lowongan,
} from '../types/lowongan.types';

export class LowonganService {
  private repository: LowonganRepository;

  constructor() {
    this.repository = new LowonganRepository();
  }

  // =========================
  // GET ALL
  // =========================
  async getAllLowongan(filter?: LowonganFilter): Promise<Lowongan[]> {
    return await this.repository.findAll(filter);
  }

  // =========================
  // GET BY ID
  // =========================
  async getLowonganById(id: number): Promise<Lowongan> {
    const lowongan = await this.repository.findById(id);

    if (!lowongan) {
      throw new Error('Lowongan tidak ditemukan');
    }

    return lowongan;
  }

  // =========================
  // CREATE
  // =========================
  async createLowongan(data: CreateLowonganDTO): Promise<Lowongan> {
    return await this.repository.create(data);
  }

  // =========================
  // UPDATE
  // =========================
  async updateLowongan(
    id: number,
    data: UpdateLowonganDTO
  ): Promise<Lowongan> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error('Lowongan tidak ditemukan');
    }

    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new Error('Gagal mengupdate lowongan');
    }

    return updated;
  }

  // =========================
  // DELETE
  // =========================
  async deleteLowongan(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error('Lowongan tidak ditemukan');
    }

    return await this.repository.delete(id);
  }

  // =========================
  // TOGGLE STATUS AKTIF / NONAKTIF
  // =========================
  async toggleStatus(id: number, is_active: boolean): Promise<Lowongan> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error('Lowongan tidak ditemukan');
    }

    const updated = await this.repository.update(id, {
      is_active,
    });

    if (!updated) {
      throw new Error('Gagal mengubah status lowongan');
    }

    return updated;
  }

  // =========================
  // OPTIONAL: EXPIRED CHECK HELPER
  // =========================
  isExpired(lowongan: Lowongan): boolean {
    if (!lowongan.deadline) return false;

    return new Date(lowongan.deadline) < new Date();
  }
}