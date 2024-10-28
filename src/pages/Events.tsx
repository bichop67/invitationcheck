import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  max_participants: number;
  logo_url?: string;
}

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [steps, setSteps] = useState<{ [key: string]: number }>({});
  const [tickets, setTickets] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      
      const initialSteps: { [key: string]: number } = {};
      const initialTickets: { [key: string]: number } = {};
      const initialFormData: { [key: string]: any } = {};
      
      data?.forEach(event => {
        initialSteps[event.id] = 1;
        initialTickets[event.id] = 0;
        initialFormData[event.id] = {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        };
      });

      setSteps(initialSteps);
      setTickets(initialTickets);
      setFormData(initialFormData);
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erreur lors du chargement des événements');
    }
  }

  const handleTicketChange = (eventId: number, delta: number) => {
    setTickets(prev => ({
      ...prev,
      [eventId]: Math.max(0, (prev[eventId] || 0) + delta)
    }));
  };

  const calculateTotal = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    const quantity = tickets[eventId] || 0;
    return event ? quantity * event.price : 0;
  };

  const handleNextStep = (eventId: number) => {
    setSteps(prev => ({
      ...prev,
      [eventId]: prev[eventId] + 1
    }));
  };

  const handlePreviousStep = (eventId: number) => {
    setSteps(prev => ({
      ...prev,
      [eventId]: prev[eventId] - 1
    }));
  };

const sendConfirmationEmail = async (eventData: any, formData: any, tickets: number) => {
  try {
    await emailjs.send(
      'service_uregdkm',
      'template_7h63t9n',
      {
        to_name: `${formData.firstName} ${formData.lastName}`,
        to_email: formData.email, // Email du participant
        reply_to: formData.email, // Pour pouvoir répondre au participant
        event_title: eventData.title,
        event_date: new Date(eventData.date).toLocaleDateString('fr-FR'),
        event_time: eventData.time,
        event_location: eventData.address,
        tickets_count: tickets,
        total_amount: calculateTotal(eventData.id),
      },
      'Fd_7_D1ZTZC9qxKYy'
    );
  } catch (error) {
    console.error('Error sending email:', error);
    toast.error('Erreur lors de l\'envoi de l\'email de confirmation');
  }
};

const handleSubmit = async (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    const eventFormData = formData[eventId];
    const ticketCount = tickets[eventId];

    if (!event) return;

    try {
      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .insert([{
          event_id: eventId,
          first_name: eventFormData.firstName,
          last_name: eventFormData.lastName,
          email: eventFormData.email,
          phone: eventFormData.phone,
          quantity: ticketCount,
          total_price: calculateTotal(eventId),
          status: 'pending'
        }])
        .select()
        .single();

      if (reservationError) throw reservationError;

      await sendConfirmationEmail(event, eventFormData, ticketCount);

      toast.success('Réservation confirmée !');
      navigate('/confirmation', { 
        state: { 
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          quantity: ticketCount,
          totalAmount: calculateTotal(eventId),
          ...eventFormData
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la réservation');
    }
  };

  const renderStepIndicator = (eventId: number) => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center w-1/3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              i <= steps[eventId] ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {i}
            </div>
            <span className="text-sm text-gray-600">
              {i === 1 ? 'Billets' : i === 2 ? 'Informations' : 'Validation'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((steps[eventId] - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Événements à venir</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {event.logo_url && (
                  <img 
                    src={event.logo_url} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
                  <div className="prose max-w-none text-gray-600 mb-6">
                    {event.description}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{event.address}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Euro className="w-5 h-5 mr-2" />
                      <span>{event.price} €</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-2" />
                      <span>{event.max_participants} places disponibles</span>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    {renderStepIndicator(event.id)}

                    <AnimatePresence mode="wait">
                      {steps[event.id] === 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-4"
                        >
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Billet d'entrée</h4>
                                <p className="text-lg font-semibold mt-1">{event.price} €</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleTicketChange(event.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {tickets[event.id] || 0}
                                </span>
                                <button
                                  onClick={() => handleTicketChange(event.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center text-lg font-semibold">
                              <span>Total</span>
                              <span>{calculateTotal(event.id)} €</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleNextStep(event.id)}
                            disabled={!tickets[event.id]}
                            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Continuer
                          </button>
                        </motion.div>
                      )}

                      {steps[event.id] === 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom
                              </label>
                              <input
                                type="text"
                                required
                                value={formData[event.id]?.firstName || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  [event.id]: { ...prev[event.id], firstName: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom
                              </label>
                              <input
                                type="text"
                                required
                                value={formData[event.id]?.lastName || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  [event.id]: { ...prev[event.id], lastName: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              required
                              value={formData[event.id]?.email || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                [event.id]: { ...prev[event.id], email: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              required
                              value={formData[event.id]?.phone || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                [event.id]: { ...prev[event.id], phone: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>

                          <div className="flex space-x-4">
                            <button
                              onClick={() => handlePreviousStep(event.id)}
                              className="w-1/2 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                              Retour
                            </button>
                            <button
                              onClick={() => handleNextStep(event.id)}
                              disabled={!formData[event.id]?.firstName || !formData[event.id]?.lastName || !formData[event.id]?.email || !formData[event.id]?.phone}
                              className="w-1/2 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Continuer
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {steps[event.id] === 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Récapitulatif de votre commande</h3>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Événement</span>
                                <span>{event.title}</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Date</span>
                                <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                              </div>

                              <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span>Billet × {tickets[event.id]}</span>
                                  <span>{calculateTotal(event.id)} €</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Vos informations</h3>
                            <div className="space-y-2">
                              <p><span className="font-medium">Nom :</span> {formData[event.id]?.lastName}</p>
                              <p><span className="font-medium">Prénom :</span> {formData[event.id]?.firstName}</p>
                              <p><span className="font-medium">Email :</span> {formData[event.id]?.email}</p>
                              <p><span className="font-medium">Téléphone :</span> {formData[event.id]?.phone}</p>
                            </div>
                          </div>

                          <div className="flex space-x-4">
                            <button
                              onClick={() => handlePreviousStep(event.id)}
                              className="w-1/2 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                              Retour
                            </button>
                            <button
                              onClick={() => handleSubmit(event.id)}
                              className="w-1/2 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                              Confirmer la réservation
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky top-6">
            {events.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <MapContainer
                  center={[events[0].latitude, events[0].longitude]}
                  zoom={13}
                  style={{ height: '500px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {events.map((event) => (
                    <Marker
                      key={event.id}
                      position={[event.latitude, event.longitude]}
                      icon={defaultIcon}
                    >
                      <Popup>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-600">{event.address}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}