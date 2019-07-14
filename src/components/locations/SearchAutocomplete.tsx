// Core
import React, { FunctionComponent, useContext, useState, useRef } from 'react';
import { CurrentUserCtx } from '../../App';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
// Styles
import './SearchAutocomplete.scss';
// Components
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import Input from '../Input';
import Loader from '../Loader';

declare var google: any;

// Component
const SearchAutocomplete: FunctionComponent<{
  history: History;
  autofocus?: boolean;
  redirectOnSuccess?: boolean;
}> = ({ history, autofocus = false, redirectOnSuccess = false }) => {
  const [currentUser, setCurrentUser] = useContext(CurrentUserCtx);
  const [sessionToken, setSessionToken] = useState(
    new google.maps.places.AutocompleteSessionToken()
  );
  const [gettingLatLng, setGettingLatLng] = useState(false);
  const [errorFetching, setErrorFetching] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  let searchOptions: any = {
    sessionToken,
    componentRestrictions: {
      country: 'us'
    }
  };
  if (!!currentUser.latLng) {
    searchOptions.location = new google.maps.LatLng(...currentUser.latLng);
    searchOptions.radius = 32000; // 20 miles
  } else {
    // Oklahoma specific bounds
    searchOptions.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(33.61919542, -103.00246156),
      new google.maps.LatLng(37.00229935, -94.43121924)
    );
  }

  return (
    <PlacesAutocomplete
      value={currentUser.geoQuery}
      searchOptions={searchOptions}
      highlightFirstSuggestion={true}
      onChange={locationQuery => {
        setCurrentUser(currentUser => ({
          ...currentUser,
          geoQuery: locationQuery
        }));
      }}
      onSelect={address => {
        setGettingLatLng(true);
        setErrorFetching(false);
        setCurrentUser(currentUser => ({
          ...currentUser,
          geoQuery: address,
          geoName: address
        }));
        inputRef.current && inputRef.current.blur();
        setSessionToken(new google.maps.places.AutocompleteSessionToken());
        geocodeByAddress(address)
          .then(result => {
            const name = result[0].formatted_address;
            const lat = result[0].geometry.location.lat();
            const lng = result[0].geometry.location.lng();
            if (name && lat && lng) {
              setCurrentUser(currentUser => ({
                ...currentUser,
                geoQuery: name,
                geoName: name,
                latLng: [lat, lng]
              }));
              setGettingLatLng(false);
              redirectOnSuccess && history.push('/locations');
            } else {
              setGettingLatLng(false);
              setErrorFetching(true);
            }
          })
          .catch(err => {
            console.error(err);
            setGettingLatLng(false);
            setErrorFetching(true);
          });
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="SearchAutocomplete">
          {errorFetching && <div className="error">Could not find address. Try again.</div>}
          <Input
            {...getInputProps({
              forwardedRef: inputRef,
              placeholder: t('locations.enterAddressPrompt'),
              className: 'location-search-input input',
              autoFocus: autofocus,
              onBlur: () => {
                // Reset input field to last successful location if blurring
                setCurrentUser(currentUser => ({
                  ...currentUser,
                  geoQuery: currentUser.geoName
                }));
              },
              onFocus: e => {
                // Select all text
                e.target.select();
                e.target.setSelectionRange(0, e.target.value.length);
                // Trigger open on focus
                getInputProps().onChange({ target: { value: e.target.value } });
              }
            })}
          />
          {(loading || gettingLatLng) && <Loader />}
          <div className="autocomplete-dropdown-container">
            {suggestions.map(suggestion => {
              const className = suggestion.active ? 'suggestion-item active' : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

// Export
export default SearchAutocomplete;
