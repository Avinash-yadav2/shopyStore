const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-400 py-6 text-center border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm">
          &copy; {currentYear} Shopy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;