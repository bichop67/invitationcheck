export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  max_participants: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}