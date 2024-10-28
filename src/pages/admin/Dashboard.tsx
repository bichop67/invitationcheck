import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import EventForm from '../../components/admin/EventForm';
import EventList from '../../components/admin/EventList';
import ReservationList from '../../components/admin/ReservationList';
import { Event, Reservation } from '../../types';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, CalendarPlus, Users, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../store/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'reservations'>('events');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchReservations();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erreur lors du chargement des événements');
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/connexion');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tab: 'events' | 'reservations') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold">Administration</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 ${
              isSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="p-6 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                  <span className="text-xl font-bold">Administration</span>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-16 lg:mt-0">
                <button
                  onClick={() => handleTabChange('events')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'events' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <CalendarPlus className="h-5 w-5" />
                  <span>Événements</span>
                </button>

                <button
                  onClick={() => handleTabChange('reservations')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'reservations' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Réservations</span>
                </button>
              </nav>

              <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        {activeTab === 'events' ? (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-2xl font-bold">Gestion des événements</h2>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full lg:w-auto"
              >
                <CalendarPlus className="h-5 w-5" />
                <span>{showEventForm ? 'Masquer le formulaire' : 'Nouvel événement'}</span>
              </button>
            </div>

            {showEventForm && (
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">Créer un nouvel événement</h3>
                <EventForm onSuccess={() => {
                  fetchEvents();
                  setShowEventForm(false);
                }} />
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <EventList 
                events={events} 
                onEventDeleted={fetchEvents}
                onEventUpdated={fetchEvents}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestion des réservations</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <ReservationList 
                reservations={reservations} 
                onReservationUpdated={fetchReservations} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}