import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Mail } from 'lucide-react';

interface LocationState {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  firstName: string;
  lastName: string;
  email: string;
  quantity: number;
  totalAmount: number;
}

export default function Confirmation() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page non accessible directement</h1>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const {
    eventTitle,
    eventDate,
    eventTime,
    firstName,
    lastName,
    email,
    quantity,
    totalAmount
  } = state;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Merci pour votre réservation !
          </h1>
          <p className="text-gray-600">
            Un email de confirmation a été envoyé à {email}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Détails de votre réservation</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Événement</h3>
                  <p className="text-gray-600">{eventTitle}</p>
                  <p className="text-gray-600">
                    {new Date(eventDate).toLocaleDateString('fr-FR')} à {eventTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Vos informations</h3>
                  <p className="text-gray-600">{firstName} {lastName}</p>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Votre réservation</h3>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Billet d'entrée</span>
                  <span>× {quantity}</span>
                </div>
                <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>{totalAmount.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <h3 className="font-medium mb-2">Prochaines étapes</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Vous recevrez un email de confirmation avec vos billets</li>
              <li>• Présentez vos billets (format numérique ou imprimé) à l'entrée</li>
              <li>• Arrivez 15 minutes avant le début de l'événement</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}