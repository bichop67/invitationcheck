import React from 'react';
import { Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Reservation } from '../../lib/database.types';

interface ReservationListProps {
  reservations: Reservation[];
  onReservationUpdated: () => void;
}

export default function ReservationList({ reservations, onReservationUpdated }: ReservationListProps) {
  const handleReservationStatus = async (reservationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);
      
      if (error) throw error;

      toast.success('Statut mis à jour avec succès');
      onReservationUpdated();
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="lg:hidden">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="border-b p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{reservation.full_name}</h3>
                <p className="text-sm text-gray-500">{reservation.email}</p>
                <p className="text-sm text-gray-500">{reservation.phone}</p>
                {reservation.company && (
                  <p className="text-sm text-gray-500">{reservation.company}</p>
                )}
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                reservation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {reservation.status === 'approved' ? 'Approuvée' :
                 reservation.status === 'rejected' ? 'Rejetée' : 'En attente'}
              </span>
            </div>
            {reservation.status === 'pending' && (
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => handleReservationStatus(reservation.id, 'approved')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                >
                  <Check className="h-4 w-4" />
                  <span>Approuver</span>
                </button>
                <button
                  onClick={() => handleReservationStatus(reservation.id, 'rejected')}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                  <span>Rejeter</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <table className="min-w-full divide-y divide-gray-200 hidden lg:table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.company}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                  reservation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {reservation.status === 'approved' ? 'Approuvée' :
                   reservation.status === 'rejected' ? 'Rejetée' : 'En attente'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {reservation.status === 'pending' && (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleReservationStatus(reservation.id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReservationStatus(reservation.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}