
// Fix: Import React to support React.ReactNode for icons
import React from 'react';

export interface Project {
  project_id: number;
  commune_name: string;
  latitude: number;
  longitude: number;
  axis: string;
  sector: string;
  project_title: string;
  cost_mdh: number;
  jobs_planned: number;
  njt: number;
  duration_months: number;
}

export interface CommuneAggregated {
  name: string;
  lat: number;
  lng: number;
  projects: Project[];
  totalCost: number;
  totalJobs: number;
  totalNJT: number;
}

export enum SectorType {
  Emploi = "Emploi",
  Education = "Education",
  Sante = "Sante",
  Eau = "Eau",
  MiseNiveauTerritoriale = "MiseNiveauTerritoriale"
}

export interface SectorConfig {
  label: string;
  // Fix: Updated icon type from string to string | React.ReactNode to support both emojis and JSX icons
  icon: string | React.ReactNode;
  color: string; // Tailwind class equivalent for text/bg
  hex: string; // Hex code for charts/map
}
