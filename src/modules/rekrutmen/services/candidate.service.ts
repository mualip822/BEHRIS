import { CandidateRepository } from '../repositories/candidate.repository';
import { InterviewRepository } from '../repositories/interview.repository';
import { Candidate, CandidateDetail, UpdateStatusRequest, InviteRequest, InterviewInvitation } from '../types/candidate.types';
import { sendInterviewInvitation } from '../../../core/utils/email';
export class CandidateService {
  private candidateRepository = new CandidateRepository();
  private interviewRepository = new InterviewRepository();

  async getCandidates(search: string, status: string, page: number, limit: number) {
    const { data, total } = await this.candidateRepository.findAll(search, status, page, limit);
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  }

  async getCandidateDetail(id: number): Promise<CandidateDetail | null> {
    return this.candidateRepository.findById(id);
  }

  async updateStatus(id: number, status: UpdateStatusRequest['status']): Promise<void> {
    const validStatuses = ['pending', 'review', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Status tidak valid');
    }
    await this.candidateRepository.updateStatus(id, status);
  }

  async inviteCandidate(applyId: number, data: InviteRequest): Promise<InterviewInvitation> {
    // Simpan undangan
    const invitation = await this.interviewRepository.create(applyId, data);
    // Update status ke interview
    await this.candidateRepository.updateStatus(applyId, 'interview');
    // Kirim email undangan (async, tidak perlu menunggu)
    const candidate = await this.candidateRepository.findById(applyId);
    if (candidate) {
      sendInterviewInvitation(candidate, data).catch(err => console.error('Gagal kirim email undangan:', err));
    }
    return invitation;
  }
}