import React from "react";

export type InfoItem = {
  name: string;
  description: string;
};

type InfoCardProps = {
  item: InfoItem;
  onSelect: (info: InfoItem) => void;
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const InfoCard: React.FC<InfoCardProps> = ({
  item,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="border rounded-xl p-6 flex flex-col gap-4 w-full max-w-md bg-white shadow-lg">
        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center">Basic Character Details</h2>

        {/* Name Input */}
        <label className="font-semibold text-gray-700">Enter character name</label>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Name"
          value={item.name}
          onChange={(e) => onSelect({ ...item, name: e.target.value })}
        />

        {/* Description Textarea */}
        <label className="font-semibold text-gray-700">Physical Description</label>
        <textarea
          className="border rounded px-3 py-2 w-full resize-none"
          placeholder="Description"
          value={item.description}
          onChange={(e) => onSelect({ ...item, description: e.target.value })}
        />

        {/* Next / Back Buttons */}
        {(showBack || showNext) && (
          <div className="flex justify-between mt-4">
            {showBack ? (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
              >
                Previous
              </button>
            ) : <div className="w-24" />}

            {showNext ? (
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 font-semibold"
              >
                Next
              </button>
            ) : <div className="w-24" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;