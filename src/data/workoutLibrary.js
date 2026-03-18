const WORKOUT_LIBRARY = [
  {
    id: 'beginner-steady-run',
    label: 'Steady Run',
    goal: 'build-endurance',
    experienceLevels: ['beginner', 'intermediate'],
    minWeeklyMileage: 12,
    minRunMiles: 3,
    preferredRunMiles: 4,
    type: 'steady',
    segments: {
      warmupMiles: 1,
      mainSet: 'Run steady at a controlled aerobic effort',
      cooldownMiles: 1,
    },
    explanation:
      'Start with an easy warm up, then settle into a comfortably hard pace that feels stronger than easy running but still controlled. You should feel like you are working, but not sprinting or racing. Finish by easing back down for your cool down.',
  },
  {
    id: 'beginner-fartlek',
    label: 'Intro Fartlek',
    goal: 'get-faster',
    experienceLevels: ['beginner'],
    minWeeklyMileage: 15,
    minRunMiles: 4,
    preferredRunMiles: 4,
    type: 'fartlek',
    segments: {
      warmupMiles: 1,
      mainSet: '4 x 1 minute faster with 2 minutes easy jog',
      cooldownMiles: 1,
    },
    explanation:
      'Run 4 rounds of 1 minute faster than your normal easy pace, followed by 2 minutes of very easy jogging or recovery. The faster portion should feel controlled, not all out. The easy jog is there to help you catch your breath before the next repeat.',
  },
  {
    id: 'intermediate-fartlek',
    label: 'Fartlek Session',
    goal: 'get-faster',
    experienceLevels: ['intermediate'],
    minWeeklyMileage: 18,
    minRunMiles: 4,
    preferredRunMiles: 5,
    type: 'fartlek',
    segments: {
      warmupMiles: 1,
      mainSet: '6 x 1 minute faster with 90 seconds easy jog',
      cooldownMiles: 1,
    },
    explanation:
      'Run 6 rounds of 1 minute at a faster controlled pace, with 90 seconds of easy jogging between each effort. The faster portions should feel strong and smooth, not like an all-out sprint. Use the easy jog recoveries to reset before the next repeat.',
  },
  {
    id: 'intermediate-tempo',
    label: 'Tempo Run',
    goal: 'get-faster',
    experienceLevels: ['intermediate'],
    minWeeklyMileage: 20,
    minRunMiles: 5,
    preferredRunMiles: 5,
    type: 'tempo',
    segments: {
      warmupMiles: 1,
      mainSet: '2 miles at tempo effort',
      cooldownMiles: 1,
    },
    explanation:
      'After your warm up, run the tempo portion at a comfortably hard pace that you could hold for a sustained effort, but not forever. It should feel stronger than easy running and require focus, while still staying controlled. Finish with an easy cool down.',
  },
  {
    id: 'beginner-progression',
    label: 'Progression Run',
    goal: 'stay-consistent',
    experienceLevels: ['beginner', 'intermediate'],
    minWeeklyMileage: 10,
    minRunMiles: 3,
    preferredRunMiles: 4,
    type: 'progression',
    segments: {
      warmupMiles: 1,
      mainSet: 'Gradually increase effort through the middle of the run',
      cooldownMiles: 1,
    },
    explanation:
      'Start relaxed and easy, then gradually pick up the pace as the run goes on. The goal is to finish stronger than you started without turning the run into a race. Think smooth progression, not sudden surges.',
  },
];

export default WORKOUT_LIBRARY;