const FALLBACK_TEAM = [
  {
    id: 'julien-deveraux',
    name: 'Julien Deveraux',
    role: 'Executive Chef',
    imageUrl:
      'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'camron-lang',
    name: 'Camron Lang',
    role: 'Seafood Specialist',
    imageUrl:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sofia-beaumont',
    name: 'Sofia Beaumont',
    role: 'Pastry Maestro',
    imageUrl:
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
  },
];

function getTeamEntries(team) {
  const source = Array.isArray(team) && team.length ? team : FALLBACK_TEAM;
  const normalized = source.slice(0, 3).map((entry, index) => ({
    id: entry.id || `${entry.name}-${index}`,
    name: entry.name || 'Culinary Artist',
    role: entry.role || entry.title || 'Chef',
    imageUrl: entry.imageUrl || FALLBACK_TEAM[index % FALLBACK_TEAM.length].imageUrl,
  }));

  while (normalized.length < 3) {
    normalized.push(FALLBACK_TEAM[normalized.length]);
  }
  return normalized;
}

export function TeamShowcaseSection({ team }) {
  const entries = getTeamEntries(team);

  return (
    <section className="content-shell section team-showcase">
      <div className="team-showcase-header">
        <div className="team-showcase-title">
          <span className="team-showcase-line" />
          <h2>The Architects Of Taste</h2>
        </div>
        <p>Devoted to perfection meet the hands and hearts behind extraordinary experience.</p>
      </div>

      <div className="team-showcase-grid">
        {entries.map((entry) => (
          <article className="team-card" key={entry.id}>
            <div className="team-card-image-wrap">
              <img src={entry.imageUrl} alt={entry.name} loading="lazy" />
            </div>
            <h3>{entry.name}</h3>
            <p>{entry.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
