import nodemailer from 'nodemailer';
import {
  CandidateDetail,
  InviteRequest,
} from '../../modules/rekrutmen/types/candidate.types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInterviewInvitation = async (
  candidate: CandidateDetail,
  invite: InviteRequest
) => {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: candidate.email,
    subject: 'Undangan Interview',
    html: `
      <h3>Assalamu'alaikum ${candidate.full_name}</h3>

      <p>Selamat, Anda lolos tahap seleksi administrasi.</p>

      <table border="1" cellpadding="8">
        <tr>
          <td><b>Posisi</b></td>
          <td>${candidate.posisi}</td>
        </tr>
        <tr>
          <td><b>Tanggal Interview</b></td>
          <td>${invite.tanggal_interview}</td>
        </tr>
        <tr>
          <td><b>Lokasi</b></td>
          <td>${invite.lokasi}</td>
        </tr>
      </table>

      ${
        invite.link_meeting
          ? `<p><b>Link Meeting:</b> ${invite.link_meeting}</p>`
          : ''
      }

      <p>${invite.catatan || ''}</p>

      <br/>

      <p>HRD Recruitment</p>
    `,
  });
};