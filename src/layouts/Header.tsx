const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Header</h1>
      </div>
    </div>
  );
};

export default Header;
