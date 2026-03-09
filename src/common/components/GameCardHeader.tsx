type Props = {
  title: string;
  right?: React.ReactNode;
};

export const GameCardHeader: React.FC<Props> = ({ title, right }) => {
  return (
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-lg">{title}</h3>
      {right}
    </div>
  );
};