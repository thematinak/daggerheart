import React from "react";

export type PreviousButtonProps = {
  onBack?: () => void
};

const PreviousButton: React.FC<PreviousButtonProps> = ({onBack}) => <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
              >Previous</button>


export default PreviousButton;