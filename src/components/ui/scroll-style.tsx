const scrollKeyframes = `
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
`

export const ScrollStyle = () => (
  <style jsx global>{`
    ${scrollKeyframes}
    .animate-scroll {
      animation: scroll 30s linear infinite;
    }
    .animate-scroll:hover {
      animation-play-state: paused;
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .animate-scroll::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    .animate-scroll {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;     /* Firefox */
    }
  `}</style>
)