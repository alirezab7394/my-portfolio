"use client";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs - Much Larger */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Large floating orb - top left */}
        <div className="absolute top-[-15%] left-[-10%] w-[900px] h-[900px] bg-primary/15 rounded-full blur-3xl animate-float" />
        
        {/* Medium floating orb - top right */}
        <div className="absolute top-[-10%] right-[-15%] w-[700px] h-[700px] bg-primary/12 rounded-full blur-3xl animate-float-reverse" />
        
        {/* Large floating orb - bottom center */}
        <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-float" 
          style={{ animationDuration: '30s' }}
        />
        
        {/* Additional large orb - center left */}
        <div className="absolute top-1/2 left-[-8%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-float-reverse" 
          style={{ animationDuration: '35s' }}
        />
      </div>

      {/* Animated Grid Pattern - More Visible */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#d1e9f1_1px,transparent_1px),linear-gradient(to_bottom,#d1e9f1_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid-move"
        />
      </div>

      {/* Floating Geometric Shapes - Larger */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary/30 rounded-full animate-float shadow-lg shadow-primary/20" 
        style={{ animationDuration: '15s' }}
      />
      <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-primary/25 rounded-full animate-float-reverse shadow-lg shadow-primary/15" 
        style={{ animationDuration: '18s' }}
      />
      <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-primary/35 rounded-full animate-float shadow-lg shadow-primary/25" 
        style={{ animationDuration: '22s' }}
      />
      <div className="absolute top-1/2 left-1/4 w-3.5 h-3.5 bg-primary/28 rounded-full animate-float-reverse" 
        style={{ animationDuration: '20s' }}
      />
      
      {/* Accent Lines - Thicker and More Visible */}
      <div className="absolute top-1/2 left-0 w-48 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-drift shadow-lg shadow-primary/20" />
      <div className="absolute bottom-1/3 right-0 w-40 h-0.5 bg-gradient-to-l from-transparent via-primary/35 to-transparent animate-drift-reverse shadow-lg shadow-primary/15" />
      <div className="absolute top-1/4 left-1/2 w-36 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-drift" 
        style={{ animationDuration: '14s' }}
      />

      {/* Additional floating elements - Larger */}
      <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-float shadow-md shadow-primary/25" 
        style={{ animationDuration: '16s' }}
      />
      <div className="absolute bottom-1/4 left-2/3 w-4 h-4 bg-primary/35 rounded-full animate-float-reverse shadow-md shadow-primary/20" 
        style={{ animationDuration: '19s' }}
      />
      <div className="absolute top-3/4 right-1/4 w-2.5 h-2.5 bg-primary/30 rounded-full animate-float" 
        style={{ animationDuration: '17s' }}
      />

      {/* Large accent circles */}
      <div className="absolute top-1/5 right-1/5 w-12 h-12 border-2 border-primary/20 rounded-full animate-float" 
        style={{ animationDuration: '25s' }}
      />
      <div className="absolute bottom-1/5 left-1/5 w-10 h-10 border-2 border-primary/15 rounded-full animate-float-reverse" 
        style={{ animationDuration: '28s' }}
      />
    </div>
  );
}
