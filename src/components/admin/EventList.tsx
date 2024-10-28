import React, { useState } from 'react';
import { Event } from '../../types';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import EventForm from './EventForm';

interface EventListProps {
  events: Event[];
  onEventDeleted: () => void;
  onEventUpdated: () => void;
}

export default function EventList({ events, onEventDeleted, onEventUpdated }: EventListProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Événement supprimé avec succès');
      onEventDeleted();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const toggleExpand = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p className="text-lg">Aucun événement n'a été créé.</p>
        <p className="text-sm mt-2">Commencez par créer votre premier événement.</p>
      </div>
    );
  }

  return (
    <div>
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 lg:px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Modifier l'événement</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 lg:p-6">
              <EventForm
                event={editingEvent}
                onSuccess={() => {
                  setEditingEvent(null);
                  onEventUpdated();
                  toast.success('Événement modifié avec succès');
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors p-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <button
                    onClick={() => toggleExpand(event.id)}
                    className="lg:hidden ml-2"
                  >
                    {expandedEvent === event.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                <div className={`mt-2 space-y-2 ${
                  expandedEvent === event.id || window.innerWidth >= 1024 ? 'block' : 'hidden'
                }`}>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="inline-flex items-center">
                      <span className="mr-2">📅</span>
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="inline-flex items-center">
                      <span className="mr-2">⏰</span>
                      {event.time}
                    </span>
                    <span className="inline-flex items-center">
                      <span className="mr-2">💰</span>
                      {event.price} €
                    </span>
                    <span className="inline-flex items-center">
                      <span className="mr-2">👥</span>
                      {event.max_participants} places
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}