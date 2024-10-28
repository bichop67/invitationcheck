-- Ajout des colonnes de géolocalisation à la table events
ALTER TABLE events
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN address TEXT;

-- Ajout d'un index spatial pour optimiser les requêtes géographiques
CREATE INDEX events_location_idx ON events USING gist (
  ll_to_earth(latitude, longitude)
);