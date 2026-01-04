<div class="pulsating-circles">
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
</div>

<style>
  .pulsating-circles {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    z-index: -1;
  }

  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    /* Use fixed size with transform: scale() instead of animating width/height */
    width: 300px;
    height: 300px;
    border: 3px solid var(--color-success);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: pulse 4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, opacity;
  }

  .circle:nth-child(2) {
    animation-delay: 1s;
  }

  .circle:nth-child(3) {
    animation-delay: 2s;
  }

  /* Animate transform: scale() instead of width/height (GPU accelerated) */
  @keyframes pulse {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .circle {
      animation: none;
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(0.5);
    }
  }
</style>
