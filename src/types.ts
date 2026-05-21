export interface CarModel {
  id: string;
  name: string;
  tagline: string;
  price: string;
  hp: number;
  torque: string;
  topSpeed: string; // e.g. "355 km/h"
  acceleration: string; // e.g. "2.4s"
  engine: string; // e.g. "V12 Hybrid"
  weight: string; // e.g. "1,525 kg"
  description: string;
  image: string;
  colors: {
    name: string;
    hex: string;
    glow: string;
  }[];
}
