// src/modules/rekrutmen/services/masterData.service.ts

import { MasterDataRepository } from "../repositories/masterData.repository";

export class MasterDataService {

  // =====================================================
  // CATEGORY
  // =====================================================

  static async getCategories() {

    return await MasterDataRepository.getCategories();
  }

  static async getCategoryById(id: number) {

    const category =
      await MasterDataRepository.getCategoryById(id);

    if (!category) {
      throw new Error("Kategori tidak ditemukan");
    }

    return category;
  }

  static async createCategory(name: string) {

    const existing =
      await MasterDataRepository.findCategoryByName(name);

    if (existing) {
      throw new Error("Kategori sudah tersedia");
    }

    return await MasterDataRepository.createCategory(name);
  }

  static async updateCategory(id: number, name: string) {

    const category =
      await MasterDataRepository.getCategoryById(id);

    if (!category) {
      throw new Error("Kategori tidak ditemukan");
    }

    const existing =
      await MasterDataRepository.findCategoryByName(name);

    if (existing && existing.id !== id) {
      throw new Error("Kategori sudah tersedia");
    }

    return await MasterDataRepository.updateCategory(
      id,
      name
    );
  }

  static async deleteCategory(id: number) {

    const category =
      await MasterDataRepository.getCategoryById(id);

    if (!category) {
      throw new Error("Kategori tidak ditemukan");
    }

    return await MasterDataRepository.deleteCategory(id);
  }

  // =====================================================
  // JOB TYPES
  // =====================================================

  static async getJobTypes() {

    return await MasterDataRepository.getJobTypes();
  }

  static async getJobTypeById(id: number) {

    const jobType =
      await MasterDataRepository.getJobTypeById(id);

    if (!jobType) {
      throw new Error("Tipe pekerjaan tidak ditemukan");
    }

    return jobType;
  }

  static async createJobType(name: string) {

    const existing =
      await MasterDataRepository.findJobTypeByName(name);

    if (existing) {
      throw new Error("Tipe pekerjaan sudah tersedia");
    }

    return await MasterDataRepository.createJobType(name);
  }

  static async updateJobType(id: number, name: string) {

    const jobType =
      await MasterDataRepository.getJobTypeById(id);

    if (!jobType) {
      throw new Error("Tipe pekerjaan tidak ditemukan");
    }

    const existing =
      await MasterDataRepository.findJobTypeByName(name);

    if (existing && existing.id !== id) {
      throw new Error("Tipe pekerjaan sudah tersedia");
    }

    return await MasterDataRepository.updateJobType(
      id,
      name
    );
  }

  static async deleteJobType(id: number) {

    const jobType =
      await MasterDataRepository.getJobTypeById(id);

    if (!jobType) {
      throw new Error("Tipe pekerjaan tidak ditemukan");
    }

    return await MasterDataRepository.deleteJobType(id);
  }
}