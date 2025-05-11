const BackgroundDecor = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
      <svg style={{ position: 'absolute', top: '10%', left: '5%' }} width="100" height="100" viewBox="0 0 200 200">
        <path fill="#3d2c8d" d="M40,-40C55,-25,70,0,60,20C50,40,25,55,0,60C-25,65,-50,60,-60,40C-70,20,-60,-15,-45,-35C-30,-55,-15,-60,5,-65C25,-70,50,-55,40,-40Z" transform="translate(100 100)" />
      </svg>

      <svg style={{ position: 'absolute', top: '40%', right: '9%' }} width="100" height="100" viewBox="0 0 200 200">
        <path fill="#2c8d65" d="M40,-40C55,-25,70,0,60,20C50,40,25,55,0,60C-25,65,-50,60,-60,40C-70,20,-60,-15,-45,-35C-30,-55,-15,-60,5,-65C25,-70,50,-55,40,-40Z" transform="translate(100 100)" />
      </svg>

      <svg style={{ position: 'absolute', bottom: '15%', right: '10%' }} width="80" height="80" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#3d2c8d" opacity="0.2" />
      </svg>

      <svg style={{ position: 'absolute', top: '10%', right: '20%' }} width="100" height="100" viewBox="0 0 100 100">
  <path fill="#B9B7F1" d="M60,10 C75,15 75,35 60,40 C45,45 45,55 60,60 C75,65 75,85 60,90 C45,95 30,90 30,70 L30,60 C30,50 45,50 45,40 C45,30 30,30 30,20 C30,10 45,5 60,10 Z" />
</svg>

<svg style={{ position: 'absolute', bottom: '7%', left: '10%' }} width="100" height="100" viewBox="0 0 100 100">
  <polygon fill="#FDE68A" points="20,90 50,10 80,90" />
</svg>

<svg style={{ position: 'absolute', bottom: '40%', left: '5%' }} width="100" height="100" viewBox="0 0 200 200">
  <path fill="#FECACA" d="M40,-40C55,-25,70,0,60,20C50,40,25,55,0,60C-25,65,-50,60,-60,40C-70,20,-60,-15,-45,-35C-30,-55,-15,-60,5,-65C25,-70,50,-55,40,-40Z" transform="translate(100 100)" />
</svg>
    </div>
  );
};

export default BackgroundDecor;
