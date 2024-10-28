export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
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
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}