export type LostPetMatch = {
  id: number;
  name: string;
  species: string;
  breed: string;
  color: string;
  size: string;
  description: string;
  photo_url: string | null;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  address: string;
  lost_date: string;
  location: string;
  distance: number | string;
};
