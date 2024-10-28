import React, { useState, useEffect } from 'react';
import { createEvent, getEvents, getReservations } from '../lib/supabase';
import { CalendarPlus, Users } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  max_participants: number;
}

interface Reservation {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function Admin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: '',
    max_participants: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [eventsData, reservationsData] = await Promise.all([
        getEvents(),
        getReservations()
      ]);
      setEvents(eventsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createEvent(newEvent);
      setNewEvent({
        title: '',
        date: '',
        description: '',
        max_participants: 0
      });
      loadData();
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de création d'événement */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <CalendarPlus className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Créer un événement</h2>
            </div>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre maximum de participants</label>
                <input
                  type="number"
                  value={newEvent.max_participants}
                  onChange={(e) => setNewEvent({...newEvent, max_participants: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Créer l'événement
              </button>
            </form>
          </div>

          {/* Liste des réservations */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">Réservations</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Téléphone</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b">
                      <td className="p-2">{reservation.name}</td>
                      <td className="p-2">{reservation.email}</td>
                      <td className="p-2">{reservation.phone}</td>
                      <td className="p-2">
                        {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}