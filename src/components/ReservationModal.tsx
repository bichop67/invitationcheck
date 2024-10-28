import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Minus, Plus, Ticket } from 'lucide-react';

interface ReservationModalProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    price: number;
    max_participants: number;
  };
  onClose: () => void;
}

const TICKET_TYPES = [
  {
    id: 'standard',
    name: 'Entrée seule',
    price: 15.00,
    description: 'Accès à l\'événement'
  },
  {
    id: 'vip',
    name: 'Carré privilège',
    price: 45.00,
    description: 'Accès privilégié + Cocktail networking'
  }
];

export default function ReservationModal({ event, onClose }: ReservationModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState<{ [key: string]: number }>(
    TICKET_TYPES.reduce((acc, type) => ({ ...acc, [type.id]: 0 }), {})
  );
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const totalAmount = Object.entries(tickets).reduce(
    (sum, [id, quantity]) => 
      sum + quantity * TICKET_TYPES.find(t => t.id === id)!.price,
    0
  );

  const totalTickets = Object.values(tickets).reduce((sum, qty) => sum + qty, 0);

  const handleTicketChange = (id: string, delta: number) => {
    const currentQty = tickets[id];
    const newQty = Math.max(0, currentQty + delta);
    setTickets({ ...tickets, [id]: newQty });
  };

  const handleSubmit = async () => {
    try {
      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .insert([{
          event_id: event.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          quantity: totalTickets,
          total_price: totalAmount,
          ticket_details: tickets,
          status: 'pending'
        }])
        .select()
        .single();

      if (reservationError) throw reservationError;

      toast.success('Réservation confirmée !');
      navigate('/confirmation', { 
        state: { 
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          tickets,
          totalAmount,
          ...formData
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la réservation');
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center w-1/3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              i <= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {i}
            </div>
            <span className="text-sm text-gray-600">
              {i === 1 ? 'Panier' : i === 2 ? 'Informations' : 'Validation'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderTicketSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {TICKET_TYPES.map((type) => (
        <div key={type.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">{type.name}</h3>
              {type.description && (
                <p className="text-sm text-gray-500">{type.description}</p>
              )}
              <p className="text-lg font-semibold mt-1">{type.price.toFixed(2)} €</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleTicketChange(type.id, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">
                {tickets[type.id]}
              </span>
              <button
                onClick={() => handleTicketChange(type.id, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Sous-total</span>
          <span>{totalAmount.toFixed(2)} €</span>
        </div>
      </div>
    </motion.div>
  );

  const renderContactForm = () => (
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
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
    </motion.div>
  );

  const renderSummary = () => (
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
            {Object.entries(tickets).map(([id, quantity]) => {
              if (quantity === 0) return null;
              const ticketType = TICKET_TYPES.find(t => t.id === id)!;
              return (
                <div key={id} className="flex justify-between items-center mb-2">
                  <span>{ticketType.name} × {quantity}</span>
                  <span>{(ticketType.price * quantity).toFixed(2)} €</span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>{totalAmount.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Vos informations</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Nom :</span> {formData.lastName}</p>
          <p><span className="font-medium">Prénom :</span> {formData.firstName}</p>
          <p><span className="font-medium">Email :</span> {formData.email}</p>
          <p><span className="font-medium">Téléphone :</span> {formData.phone}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Ticket className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Billetterie</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {step === 1 && renderTicketSelection()}
            {step === 2 && renderContactForm()}
            {step === 3 && renderSummary()}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
            )}
            
            <button
              onClick={() => {
                if (step === 3) {
                  handleSubmit();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={
                (step === 1 && totalTickets === 0) ||
                (step === 2 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
              }
              className={`ml-auto flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                step === 3 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-black text-white hover:bg-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{step === 3 ? 'Confirmer la réservation' : 'Suivant'}</span>
              {step < 3 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}