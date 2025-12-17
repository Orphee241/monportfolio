interface FooterProps {
  year?: number;
}

export default function Footer({ year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="border-top-g py-12 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 max-w-[1400px]">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 rounded-full" />
            <p className="text-2xl font-bold text-cyan-400">GONA</p>
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-cyan-400 rounded-full" />
          </div>
          <p className="text-gray-400 text-sm">
            Développeur de solutions numériques
          </p>
          <div className="pt-4 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              &copy; {year} <span className="text-cyan-400 font-semibold">GONA</span>. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
