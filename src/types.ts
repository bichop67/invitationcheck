export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  max_participants: number;
  created_at: string;
  latitude: number;
  longitude: number;
  address: string;
  logo_url?: string;
}

export interface Reservation {
  id: number;
  event_id: number;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}