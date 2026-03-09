export const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
    {children}
  </span>
);