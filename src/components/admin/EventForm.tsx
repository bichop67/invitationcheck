import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Image, MapPin } from 'lucide-react';
import type { Event } from '../../types';
import EventMap from '../EventMap';

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    price: '',
    max_participants: '',
    logo_url: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        price: event.price.toString(),
        max_participants: event.max_participants.toString(),
        logo_url: event.logo_url || '',
        address: event.address || '',
        latitude: event.latitude?.toString() || '',
        longitude: event.longitude?.toString() || ''
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const geocodeAddress = async (address: string) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        setFormData(prev => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon
        }));
        toast.success('Adresse localisée avec succès');
      } else {
        toast.error('Adresse non trouvée');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast.error('Erreur lors de la localisation de l\'adresse');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setFormData(prev => ({ ...prev, address: newAddress }));
  };

  const handleAddressBlur = () => {
    if (formData.address) {
      geocodeAddress(formData.address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        ...formData,
        price: parseFloat(formData.price),
        max_participants: parseInt(formData.max_participants),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      const { error } = event
        ? await supabase
            .from('events')
            .update(eventData)
            .eq('id', event.id)
        : await supabase
            .from('events')
            .insert([eventData]);

      if (error) throw error;

      toast.success(event ? 'Événement modifié avec succès' : 'Événement créé avec succès');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Heure</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre max. de participants</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL du logo</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
            <Image className="h-5 w-5" />
          </span>
          <input
            type="url"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Adresse</label>
        <div className="mt-1">
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={formData.address}
              onChange={handleAddressChange}
              onBlur={handleAddressBlur}
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="123 rue Example, 75000 Paris"
            />
          </div>
          {isGeocoding && (
            <p className="mt-1 text-sm text-gray-500">Recherche des coordonnées...</p>
          )}
        </div>
      </div>

      {formData.latitude && formData.longitude && (
        <div className="mt-4">
          <EventMap
            address={formData.address}
            latitude={parseFloat(formData.latitude)}
            longitude={parseFloat(formData.longitude)}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {event ? 'Modifier l\'événement' : 'Créer l\'événement'}
        </button>
      </div>
    </form>
  );
}