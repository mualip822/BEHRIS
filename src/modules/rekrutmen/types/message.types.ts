export interface Message {
  id: number;
  apply_id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  apply_posisi?: string;
}