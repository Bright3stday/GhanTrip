// Optional internet-backed data (sunset times, venue hours) — off by default
const LiveData = {
  isEnabled() {
    try {
      return localStorage.getItem('aus_live_data') === 'true';
    } catch (e) {
      return false;
    }
  },

  setEnabled(enabled) {
    try {
      localStorage.setItem('aus_live_data', enabled ? 'true' : 'false');
    } catch (e) {
      // Ignore storage errors (e.g. private browsing)
    }
  },

  async fetchSunTimes(lat, lng) {
    try {
      const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status !== 'OK') return null;
      const toLocalTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      return {
        sunrise: toLocalTime(data.results.sunrise),
        sunset: toLocalTime(data.results.sunset)
      };
    } catch (e) {
      return null;
    }
  },

  async fetchVenueStatus(lat, lng, name) {
    try {
      const query = `[out:json][timeout:10];node(around:200,${lat},${lng})["opening_hours"];out body 5;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.elements || data.elements.length === 0) return null;

      const nameLower = (name || '').toLowerCase();
      const nameWords = nameLower.split(/\s+/).filter(w => w.length > 3);
      const match = data.elements.find(el => {
        const elName = (el.tags && el.tags.name || '').toLowerCase();
        return elName && nameWords.some(w => elName.includes(w));
      }) || data.elements[0];

      return (match.tags && match.tags.opening_hours) || null;
    } catch (e) {
      return null;
    }
  }
};
