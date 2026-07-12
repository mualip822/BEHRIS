import { TestRepository } from '../repositories/test.repository';
import {
  CreateTestDTO,
  UpdateTestDTO,
  Test,
} from '../types';

import {
  NotFoundError,
} from '../../../../core/middlewares/error.middleware';

const testRepo =
  new TestRepository();

export class TestService {
  async list(
    page: number,
    limit: number
  ) {
    return testRepo.findAll(
      page,
      limit
    );
  }

  async getById(
    id: string
  ): Promise<Test> {
    const test =
      await testRepo.findById(id);

    if (!test) {
      throw new NotFoundError(
        'Test not found'
      );
    }

    return test;
  }

  async create(
    dto: CreateTestDTO,
    userId: string
  ): Promise<Test> {
    console.log(
      'SERVICE DTO:',
      dto
    );

    console.log(
      'SERVICE USER:',
      userId
    );

    return testRepo.create(
      dto,
      userId
    );
  }

  async update(
    id: string,
    dto: UpdateTestDTO
  ): Promise<Test> {
    const test =
      await testRepo.update(
        id,
        dto
      );

    if (!test) {
      throw new NotFoundError(
        'Test not found'
      );
    }

    return test;
  }

  async delete(
    id: string
  ): Promise<void> {
    const test =
      await testRepo.findById(id);

    if (!test) {
      throw new NotFoundError(
        'Test not found'
      );
    }

    await testRepo.delete(id);
  }

  // =====================================================
  // ACTIVE TESTS
  // =====================================================

  async getActiveTests(): Promise<
    Test[]
  > {
    return testRepo.getActiveTests();
  }
}