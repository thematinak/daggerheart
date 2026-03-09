import React from "react";


export type Attributes = {
  agility: {value: number,id: number} | null;
  strength: {value: number,id: number} | null;
  finesse: {value: number,id: number} | null;
  instinct: {value: number,id: number} | null;
  presence: {value: number,id: number} | null;
  knowledge: {value: number,id: number} | null;
};

export type AttributeItem = {
  id: string;
  name: keyof Attributes;
  skills: string[];
};


type AttributesGridProps = {
  attributes: AttributeItem[];
  attributeOptions: {value: number,id: number}[];
  selected: Attributes;
  onSelect: (selectedAttributes: Attributes) => void;
  showBack?: boolean;
  showNext?: boolean;
  onBack?: () => void;
  onNext?: () => void;
};

export const AttributesGrid: React.FC<AttributesGridProps> = ({
  attributes,
  attributeOptions,
  selected,
  onSelect,
  showBack = false,
  showNext = false,
  onBack,
  onNext,
}) => {
  
    let attrsUsed: number[] = []
    if (selected.agility != null) {
        attrsUsed.push(selected.agility.id)
    }
    if (selected.strength != null) {
        attrsUsed.push(selected.strength.id)
    }
    if (selected.finesse != null) {
        attrsUsed.push(selected.finesse.id)
    }
    if (selected.instinct != null) {
        attrsUsed.push(selected.instinct.id)
    }
    if (selected.presence != null) {
        attrsUsed.push(selected.presence.id)
    }
    if (selected.knowledge != null) {
        attrsUsed.push(selected.knowledge.id)
    }

  const available = attributeOptions.filter((opt) => !attrsUsed.includes(opt.id));

  
  return (
    <>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">Assign Attributes</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {attributes.map((item) => (
            <div key={item.id}>
              <AttributeCard
                item={item}
                available={available}
                choosen={selected[item.name]}
                onSelect={(val) => {
                  onSelect({ ...selected, [item.name]: val});
                }}
                onDeselect={(val) => {
                  onSelect({ ...selected, [item.name]: null});
                }}
              />
            </div>
          ))}
        </div>

        {/* Tlačidlá Späť / Pokračovať */}
        {(showBack || showNext) && (
          <div className="flex justify-between mt-4">
            {showBack ? (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
              >
                Previous
              </button>
            ) : <div />}
            {showNext ? (
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
              >
                Next
              </button>
            ) : <div />}
          </div>
        )}
      </div>
    </>
  );
};

// AttributeCard môžeme použiť rovnaký ako predtým
type AttributeCardProps = {
  item: AttributeItem;
  available: { value: number; id: number }[];
  choosen: { value: number; id: number } | null;
  onSelect: (selected: { value: number; id: number }) => void;
  onDeselect: (selected: { value: number; id: number }) => void;
};

const AttributeCard: React.FC<AttributeCardProps> = ({ item, available, choosen, onSelect, onDeselect }) => (
  <div className="border rounded-xl p-4 w-40 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
    <ul className="text-sm mb-3 list-disc list-inside text-gray-700">
      {item.skills.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>

    <div>
      <p className="text-sm font-semibold mb-1">Available Modifiers:</p>
      <div className="flex flex-wrap gap-2">
        {choosen ? (
          <div
            className="px-3 py-1 bg-green-200 border-2 border-green-500 rounded-lg font-semibold cursor-pointer"
            onClick={() => onDeselect(choosen)}
          >
            {choosen.value} ✕
          </div>
        ) : (
          available.map((av) => (
            <div
              key={item.id + "-" + av.id}
              className="px-3 py-1 bg-yellow-100 border-2 border-yellow-400 rounded-lg font-semibold cursor-pointer hover:bg-yellow-200"
              onClick={() => onSelect(av)}
            >
              {av.value}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);