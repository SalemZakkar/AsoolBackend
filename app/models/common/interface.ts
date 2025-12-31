export interface PhoneNumber {
  phone: string;
  code: string;
}

export interface LocalizedString {
  en: string;
  ar: string | null;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Address {
  position: GeoLocation;
  address?: string;
}
