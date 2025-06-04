import React, { useState } from 'react';
import IlluvialsGrid, { Illuvial } from './IlluvialsGrid';
import synergyMap from './data/illuvial_synergy_map.json';

function App() {
  const [team, setTeam] = useState<Illuvial[]>([]);

  // ✅ Add Illuvial to team
  const handleAddToTeam = (illu: Illuvial) => {
    if (team.length < 10 && !team.includes(illu)) {
      setTeam([...team, illu]);
    }
  };

  // ✅ Remove Illuvial from team
  const handleRemoveFromTeam = (id: string) => {
    setTeam(team.filter((i) => i.id !== id));
  };

  // ✅ Lookup base affinity/class
  function getSynergyDetails(id: string) {
  const entry = (synergyMap as Record<string, any>)[id];
  if (!entry) {
    return {
      baseAffinity: 'Unknown',
      baseClass: 'Unknown',
      compositeAffinities: [],
      compositeClasses: [],
    };
  }

  const classes = new Set([entry.baseClass, ...entry.compositeClasses]);
  const affinities = new Set([entry.baseAffinity, ...entry.compositeAffinities]);

  return {
    allClasses: Array.from(classes),
    allAffinities: Array.from(affinities),
  };
}

  // ✅ Calculate team breakdown using base values
  const breakdown = team.reduce(
  (acc, illu) => {
    const { allClasses = [], allAffinities = [] } = getSynergyDetails(illu.displayName);

    allClasses.forEach((cls) => {
      acc.classes[cls] = (acc.classes[cls] || 0) + 1;
    });

    allAffinities.forEach((aff) => {
      acc.affinities[aff] = (acc.affinities[aff] || 0) + 1;
    });

    return acc;
  },
  {
    classes: {} as Record<string, number>,
    affinities: {} as Record<string, number>,
  }
);


  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold text-center p-4 bg-blue-500 rounded-lg shadow-lg">
        Illuvilytics
      </h1>

      {/* TEAM BUILDER BAR */}
      <div className="p-4 bg-gray-900 flex gap-2 justify-center flex-wrap">
        {team.map((illu) => (
          <div
            key={illu.id}
            className="bg-gray-800 p-2 rounded shadow cursor-pointer hover:opacity-70"
            onClick={() => handleRemoveFromTeam(illu.id)}
          >
            <img src={illu.image} alt={illu.displayName} className="h-20 w-20 object-cover rounded" />
            <p className="text-center text-sm">{illu.displayName}</p>
            <p className="text-center text-xs text-gray-400">{illu.affinity} • {illu.class}</p>
          </div>
        ))}
        {team.length < 10 &&
          Array(10 - team.length)
            .fill(null)
            .map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-20 w-20 bg-gray-700 border-2 border-gray-500 rounded"
              />
            ))}
      </div>

      {/* TEAM BREAKDOWN */}
      <div className="p-4 text-sm bg-gray-800 rounded shadow max-w-xs mx-auto mt-4">
        <h2 className="text-lg font-bold mb-2">Team Breakdown</h2>
        <div>
          <strong>Base Class:</strong>
          <>
            {Object.entries(breakdown.classes).map(([cls, count]) => (
              <div key={cls}>{cls}: {count}</div>
            ))}
          </>
        </div>
        <div className="mt-2">
          <strong>Base Affinity:</strong>
          <>
            {Object.entries(breakdown.affinities).map(([aff, count]) => (
              <div key={aff}>{aff}: {count}</div>
            ))}
          </>
        </div>
      </div>

      {/* ILLUVIALS GRID */}
      <IlluvialsGrid onAddToTeam={handleAddToTeam} />
    </div>
  );
}

export default App;
