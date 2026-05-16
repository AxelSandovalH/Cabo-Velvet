const dict: Record<string, string[]> = {
  yacht: ['yacht', 'yate', 'boat', 'barco', 'lancha', 'velero'],
  yate: ['yate', 'yacht', 'barco', 'lancha', 'velero', 'boat'],
  boat: ['boat', 'barco', 'yate', 'yacht', 'lancha'],
  barco: ['barco', 'boat', 'yate', 'yacht', 'lancha'],
  lancha: ['lancha', 'boat', 'yate', 'yacht', 'barco'],
  catamaran: ['catamaran', 'catamarán', 'sailing', 'velero'],
  catamarán: ['catamarán', 'catamaran', 'velero', 'sailing'],
  sailing: ['sailing', 'velero', 'vela', 'catamarán', 'catamaran'],
  velero: ['velero', 'sailing', 'vela', 'catamaran', 'catamarán'],

  diving: ['diving', 'buceo', 'snorkeling', 'snorkel', 'underwater', 'submarino'],
  buceo: ['buceo', 'diving', 'snorkeling', 'snorkel', 'submarino', 'underwater'],
  snorkeling: ['snorkeling', 'snorkel', 'buceo', 'diving'],
  snorkel: ['snorkel', 'snorkeling', 'buceo', 'diving'],

  whale: ['whale', 'ballena', 'humpback', 'jorobada', 'watching'],
  ballena: ['ballena', 'whale', 'jorobada', 'humpback', 'watching'],
  watching: ['watching', 'ballena', 'whale', 'avistamiento', 'delfines', 'dolphins'],
  avistamiento: ['avistamiento', 'watching', 'whale', 'ballena', 'dolphin', 'delfin'],

  dolphin: ['dolphin', 'delfin', 'delfines', 'dolphins'],
  delfin: ['delfin', 'dolphin', 'delfines', 'dolphins'],
  dolphins: ['dolphins', 'delfines', 'dolphin', 'delfin'],
  delfines: ['delfines', 'dolphins', 'delfin', 'dolphin'],

  fishing: ['fishing', 'pesca', 'fish', 'pescar', 'marlin', 'tuna', 'atun'],
  pesca: ['pesca', 'fishing', 'pescar', 'fish', 'marlin', 'atun', 'tuna'],
  marlin: ['marlin', 'pesca', 'fishing', 'tuna', 'atun'],

  sunset: ['sunset', 'atardecer', 'cruise', 'crucero', 'sundown'],
  atardecer: ['atardecer', 'sunset', 'crucero', 'cruise', 'sundown'],
  cruise: ['cruise', 'crucero', 'sunset', 'atardecer', 'tour'],
  crucero: ['crucero', 'cruise', 'atardecer', 'sunset', 'tour'],

  villa: ['villa', 'casa', 'house', 'residence', 'residencia', 'luxury'],
  casa: ['casa', 'villa', 'house', 'residence', 'residencia'],
  house: ['house', 'casa', 'villa', 'residence', 'residencia'],

  tour: ['tour', 'tours', 'excursion', 'excursión', 'trip', 'viaje'],
  tours: ['tours', 'tour', 'excursion', 'excursión', 'trip'],
  excursion: ['excursion', 'excursión', 'tour', 'tours', 'trip', 'viaje'],
  excursión: ['excursión', 'excursion', 'tour', 'tours', 'viaje'],
  viaje: ['viaje', 'trip', 'tour', 'excursión', 'excursion'],

  adventure: ['adventure', 'aventura', 'extreme', 'extremo', 'sport'],
  aventura: ['aventura', 'adventure', 'extremo', 'extreme', 'sport'],

  private: ['private', 'privado', 'exclusive', 'exclusivo', 'vip'],
  privado: ['privado', 'private', 'exclusivo', 'exclusive', 'vip'],
  exclusive: ['exclusive', 'exclusivo', 'private', 'privado', 'vip'],
  exclusivo: ['exclusivo', 'exclusive', 'privado', 'private', 'vip'],
  vip: ['vip', 'private', 'privado', 'exclusive', 'exclusivo'],

  ocean: ['ocean', 'mar', 'sea', 'océano', 'oceano', 'water', 'agua'],
  mar: ['mar', 'ocean', 'sea', 'océano', 'agua', 'water'],
  sea: ['sea', 'mar', 'ocean', 'océano', 'water'],

  luxury: ['luxury', 'lujo', 'premium', 'exclusive', 'exclusivo'],
  lujo: ['lujo', 'luxury', 'premium', 'exclusivo', 'exclusive'],

  cabo: ['cabo', 'los cabos', 'cabos', 'baja', 'san jose', 'san lucas'],
  cabos: ['cabos', 'cabo', 'los cabos', 'baja', 'san jose', 'san lucas'],

  nightlife: ['nightlife', 'vida nocturna', 'nocturna', 'club', 'bar', 'party'],
  nocturna: ['nocturna', 'nightlife', 'vida nocturna', 'club', 'bar', 'fiesta'],
  party: ['party', 'fiesta', 'nightlife', 'nocturna', 'club'],
  fiesta: ['fiesta', 'party', 'club', 'nocturna', 'nightlife'],

  transport: ['transport', 'transporte', 'transfer', 'traslado', 'car', 'auto', 'suv'],
  transporte: ['transporte', 'transport', 'transfer', 'traslado', 'auto', 'car'],
  transfer: ['transfer', 'traslado', 'transporte', 'transport', 'airport', 'aeropuerto'],
  traslado: ['traslado', 'transfer', 'transporte', 'transport', 'aeropuerto', 'airport'],
  airport: ['airport', 'aeropuerto', 'transfer', 'traslado'],
  aeropuerto: ['aeropuerto', 'airport', 'traslado', 'transfer'],

  concierge: ['concierge', 'conserje', 'service', 'servicio', 'butler'],
  conserje: ['conserje', 'concierge', 'servicio', 'service'],

  whale_watching: ['whale watching', 'avistamiento ballenas', 'ballenas', 'whale'],
}

export function expandQuery(term: string): string[] {
  const lower = term.toLowerCase().trim()
  const direct = dict[lower]
  if (direct) return [...new Set([lower, ...direct])]

  const partial: string[] = [lower]
  for (const [key, synonyms] of Object.entries(dict)) {
    if (key.includes(lower) || lower.includes(key)) {
      partial.push(...synonyms)
    }
  }
  return [...new Set(partial)]
}
