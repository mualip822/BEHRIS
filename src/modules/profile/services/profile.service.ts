import { ProfileRepository } from "../repositories/profile.repository";

export class ProfileService {
  static async getProfile(userId: string) {
    return await ProfileRepository.findByUserId(
      userId
    );
  }

  static async saveProfile(
  userId: string,
    body: any,
    file?: Express.Multer.File
  ) {
    let avatar;

    if (file) {
      avatar = `/uploads/avatar/${file.filename}`;
    }

    return await ProfileRepository.upsert(
      userId,
      {
        ...body,
        avatar,
      }
    );
  }

  static async deleteProfile(userId: string) {
    return await ProfileRepository.delete(
      userId
    );
  }
}