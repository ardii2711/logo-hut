export default function LandscapeBanner() {
  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg mb-space-lg md:mb-margin-md">
      <div className="relative w-full h-32 sm:h-40 md:h-44 rounded-xl overflow-hidden shadow-sm flex items-end p-4 sm:p-space-lg">
        {/* Placeholder background - coastal/agricultural theme */}
        <div 
          className="bg-cover bg-center absolute inset-0 bg-linear-to-br from-secondary/20 via-surface-container to-tertiary-fixed/30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=400&fit=crop&q=80')",
            backgroundBlendMode: "multiply"
          }}
        ></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 text-on-primary max-w-xl">
          <span className="text-[10px] sm:text-label-mono text-secondary-fixed uppercase tracking-wider">
            Semangat Bumi Lalla Tassisara
          </span>
          <p className="text-base sm:text-headline-sm font-bold mt-1 leading-tight">
            Sinergi Kebudayaan, Agrikultur Hijau & Pembangunan Modern
          </p>
        </div>
      </div>
    </div>
  );
}
