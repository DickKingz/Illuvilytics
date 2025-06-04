import React from 'react';
import illuvialsRaw from './data/illuvials.json';
import synergyMap from './data/illuvial_synergy_map.json';

export type Illuvial = {
  id: string;
  displayName: string;
  line: string;
  stage: number;
  tier: number;
  affinity: string;
  class: string;
  maxHealth: number;
  attackPhysical: number;
  attackSpeed: number;
  image: string;
};

// Add to team
type Props = {
  onAddToTeam: (illu: Illuvial) => void;
};

function getFullTypes(id: string) {
  const entry = (synergyMap as Record<string, any>)[id];
  if (!entry) {
    return {
      fullAffinity: 'Unknown',
      fullClass: 'Unknown',
    };
  }

  const allAffinities = [entry.baseAffinity, ...(entry.compositeAffinities || [])];
  const allClasses = [entry.baseClass, ...(entry.compositeClasses || [])];

  return {
    fullAffinity: allAffinities.join(' + '),
    fullClass: allClasses.join(' + ')
  };
}

// Type guard to filter only valid Illuvials
function isValidIlluvial(obj: any): obj is Illuvial {
  return (
    typeof obj.id === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.line === 'string' &&
    typeof obj.stage === 'number' &&
    typeof obj.tier === 'number' &&
    typeof obj.affinity === 'string' &&
    typeof obj.class === 'string' &&
    typeof obj.maxHealth === 'number' &&
    typeof obj.attackPhysical === 'number' &&
    typeof obj.attackSpeed === 'number' &&
    typeof obj.image === 'string'
  );
}

const IlluvialsGrid: React.FC<Props> = ({ onAddToTeam }) => {
  const illuvials = (illuvialsRaw as any[]).filter(isValidIlluvial);

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {illuvials.map((illu) => {
  const { fullAffinity, fullClass } = getFullTypes(illu.displayName);

  return (
    <div
      key={illu.id}
      className="relative bg-gray-800 p-1 rounded-lg shadow-lg border border-gray-700 transition hover:shadow-blue-500/40 hover:scale-105 duration-200 cursor-pointer"
      onClick={() => onAddToTeam(illu)}
    >
      <div className="overflow-hidden aspect-square rounded-[20%] border-4 border-gray-700 shadow-inner">
        <img src={illu.image} alt={illu.displayName} className="object-cover w-full h-full" />
      </div>
      <p className="text-center text-sm mt-1 font-bold">{illu.displayName}</p>
      <p className="text-center text-xs text-gray-400 leading-tight">
        Affinity: {fullAffinity}<br />
        Class: {fullClass}
      </p>
    </div>
  );
})}
    </div>
  );
};

export default IlluvialsGrid;
