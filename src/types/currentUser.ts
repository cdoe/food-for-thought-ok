export default interface CurrentUser {
  latLng: [number, number] | null;
  isCurrentLocation: boolean;
  hasGeoAccess: boolean | null; // 'null' for unknown
  geoQuery: string; // for search bar
  geoName: string; // for search bar fallback
  sortType: 'nearby' | 'name';
}

export const defaultCurrentUser: CurrentUser = {
  latLng: null,
  isCurrentLocation: false,
  hasGeoAccess: null,
  geoQuery: '',
  geoName: '',
  sortType: 'nearby'
};
