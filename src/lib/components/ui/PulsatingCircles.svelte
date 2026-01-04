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
    width: 0;
    height: 0;
    border: 3px solid var(--color-success);
    border-radius: 50%;
    animation: pulse 4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .circle:nth-child(2) {
    animation-delay: 1s;
  }

  .circle:nth-child(3) {
    animation-delay: 2s;
  }

  @keyframes pulse {
    0% {
      width: 0;
      height: 0;
      opacity: 0;
      transform: translate(-50%, -50%);
    }
    50% {
      opacity: 1;
    }
    100% {
      width: 100%;
      height: 100%;
      opacity: 0;
      transform: translate(-50%, -50%);
    }
  }
</style>
