export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating Orbs */}
      <div 
        className="orb particle w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-float" 
        style={{
          top: '10%', 
          left: '10%', 
          animationDelay: '0s'
        }}
      />
      <div 
        className="orb particle w-24 h-24 bg-gradient-to-r from-accent to-primary rounded-full opacity-15 animate-float" 
        style={{
          top: '70%', 
          left: '80%', 
          animationDelay: '2s'
        }}
      />
      <div 
        className="orb particle w-40 h-40 bg-gradient-to-r from-secondary to-accent rounded-full opacity-10 animate-float" 
        style={{
          top: '50%', 
          left: '60%', 
          animationDelay: '4s'
        }}
      />
      <div 
        className="orb particle w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full opacity-25 animate-float" 
        style={{
          top: '20%', 
          left: '70%', 
          animationDelay: '1s'
        }}
      />
      <div 
        className="orb particle w-28 h-28 bg-gradient-to-r from-accent to-secondary rounded-full opacity-15 animate-float" 
        style={{
          top: '80%', 
          left: '20%', 
          animationDelay: '3s'
        }}
      />
    </div>
  );
}
