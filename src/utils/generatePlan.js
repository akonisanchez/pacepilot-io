import WORKOUT_LIBRARY from '../data/workoutLibrary';

/*
  Generate a flexible weekly running plan based on
  the runner's mileage, preferred run days, and goals.
*/
function generatePlan(formData) {
  const weeklyMileage = Number(formData.weeklyMileage);
  const runDays = Number(formData.runDays);
  const { experienceLevel, goal, longRunPreference } = formData;

  const longRunPercent = getLongRunPercent(longRunPreference);
  const longRunMiles = Math.max(3, Math.round(weeklyMileage * longRunPercent));
  const remainingMiles = Math.max(0, weeklyMileage - longRunMiles);

  const plan = buildPlanSkeleton(
    runDays,
    longRunMiles,
    goal,
    experienceLevel
  );

  /*
    Distribute the remaining miles across non-long runs using weights,
    then assign leftover miles to the runs with the largest decimal
    remainders so the total stays aligned with weekly mileage.
  */
  const nonLongRuns = plan.filter((run) => run.type !== 'Long Run');
  const weightedRuns = nonLongRuns.map((run) => ({
    ...run,
    weight: getRunWeight(run.type),
  }));

  const totalWeight = weightedRuns.reduce((sum, run) => sum + run.weight, 0);

  let assignedMilesTotal = 0;

  const runsWithBaseMiles = weightedRuns.map((run) => {
    const exactMiles =
      totalWeight > 0 ? (remainingMiles * run.weight) / totalWeight : 0;

    const baseMiles = Math.floor(exactMiles);
    assignedMilesTotal += baseMiles;

    return {
      ...run,
      miles: baseMiles,
      exactMiles,
    };
  });

  const leftoverMiles = remainingMiles - assignedMilesTotal;

  const runsSortedByRemainder = [...runsWithBaseMiles].sort(
    (a, b) => (b.exactMiles - b.miles) - (a.exactMiles - a.miles)
  );

  for (let i = 0; i < leftoverMiles; i += 1) {
    runsSortedByRemainder[i].miles += 1;
  }

  /*
    Rebuild the original plan order and remove helper-only fields
    before returning the final decorated plan.
  */
  const finalizedNonLongRuns = runsWithBaseMiles.map((run) => {
    const updatedRun = runsSortedByRemainder.find(
      (sortedRun) =>
        sortedRun.type === run.type && sortedRun.notes === run.notes
    );

    return {
      type: updatedRun.type,
      miles: updatedRun.miles,
      notes: updatedRun.notes,
    };
  });

  const completedPlan = [];
  let nonLongRunIndex = 0;

  for (const run of plan) {
    if (run.type === 'Long Run') {
      completedPlan.push(run);
    } else {
      completedPlan.push(finalizedNonLongRuns[nonLongRunIndex]);
      nonLongRunIndex += 1;
    }
  }

  return completedPlan.map((run) => decorateRunDetails(run, formData));
}

function getLongRunPercent(longRunPreference) {
  if (longRunPreference === 'light') {
    return 0.25;
  }

  if (longRunPreference === 'strong') {
    return 0.35;
  }

  return 0.3;
}

function buildPlanSkeleton(runDays, longRunMiles, goal, experienceLevel) {
  const workoutNote = getWorkoutNote(goal, experienceLevel);

  const planTemplates = {
    3: [
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Comfortable conversational pace.',
      },
      {
        type: 'Workout Run',
        miles: 0,
        notes: workoutNote,
      },
      {
        type: 'Long Run',
        miles: longRunMiles,
        notes: 'Steady effort. Do not race this run.',
      },
    ],
    4: [
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Comfortable conversational pace.',
      },
      {
        type: 'Workout Run',
        miles: 0,
        notes: workoutNote,
      },
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Relaxed aerobic effort.',
      },
      {
        type: 'Long Run',
        miles: longRunMiles,
        notes: 'Steady effort. Do not race this run.',
      },
    ],
    5: [
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Comfortable conversational pace.',
      },
      {
        type: 'Workout Run',
        miles: 0,
        notes: workoutNote,
      },
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Relaxed aerobic effort.',
      },
      {
        type: 'Recovery Run',
        miles: 0,
        notes: 'Short and easy. Keep effort low.',
      },
      {
        type: 'Long Run',
        miles: longRunMiles,
        notes: 'Steady effort. Do not race this run.',
      },
    ],
    6: [
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Comfortable conversational pace.',
      },
      {
        type: 'Workout Run',
        miles: 0,
        notes: workoutNote,
      },
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Relaxed aerobic effort.',
      },
      {
        type: 'Recovery Run',
        miles: 0,
        notes: 'Short and easy. Keep effort low.',
      },
      {
        type: 'Easy Run',
        miles: 0,
        notes: 'Smooth aerobic running.',
      },
      {
        type: 'Long Run',
        miles: longRunMiles,
        notes: 'Steady effort. Do not race this run.',
      },
    ],
  };

  return planTemplates[runDays] || [];
}

function getWorkoutNote(goal, experienceLevel) {
  if (goal === 'get-faster' && experienceLevel === 'intermediate') {
    return 'Tempo effort or interval session.';
  }

  if (goal === 'get-faster') {
    return 'Short controlled speed session.';
  }

  if (goal === 'build-endurance') {
    return 'Steady aerobic workout with controlled effort.';
  }

  return 'Keep this moderate and focus on consistency.';
}

function getRunWeight(runType) {
  if (runType === 'Workout Run') {
    return 1.2;
  }

  if (runType === 'Recovery Run') {
    return 0.7;
  }

  return 1;
}

function decorateRunDetails(run, formData) {
  if (run.type === 'Workout Run') {
    return decorateRunWithWorkout(run, formData);
  }

  if (run.type === 'Recovery Run') {
    return decorateRecoveryRun(run);
  }

  if (run.type === 'Easy Run') {
    return decorateEasyRun(run);
  }

  return run;
}

function decorateRunWithWorkout(run, formData) {
  if (shouldConvertWorkoutToSteady(formData, run)) {
    return convertWorkoutToSteadyRun(run);
  }

  const matchingWorkouts = getMatchingWorkouts(formData, run.miles);

  if (matchingWorkouts.length === 0) {
    return convertWorkoutToSteadyRun(run);
  }

  const selectedWorkout = selectBestWorkout(matchingWorkouts, run.miles);

  return {
    ...run,
    workoutLabel: selectedWorkout.label,
    workoutExplanation: selectedWorkout.explanation,
    notes: formatWorkoutDescription(selectedWorkout, run.miles),
  };
}

function convertWorkoutToSteadyRun(run) {
  return {
    ...run,
    type: 'Steady Run',
    notes: 'Controlled aerobic effort. Keep this comfortably hard, not all out.',
    workoutLabel: null,
    workoutExplanation: null,
  };
}

function shouldConvertWorkoutToSteady(formData, run) {
  const weeklyMileage = Number(formData.weeklyMileage);
  const experienceLevel = formData.experienceLevel;

  if (experienceLevel === 'beginner' && weeklyMileage < 15) {
    return true;
  }

  if (run.miles < 4) {
    return true;
  }

  return false;
}

function decorateRecoveryRun(run) {
  if (run.miles < 3) {
    return {
      ...run,
      type: 'Optional Recovery Run',
      notes: 'Optional short recovery jog. Skip if you need extra rest.',
    };
  }

  return run;
}

function decorateEasyRun(run) {
  if (run.miles < 3) {
    return {
      ...run,
      type: 'Optional Easy Run',
      notes: 'Optional easy effort. Skip or replace with walking if needed.',
    };
  }

  return run;
}

function getMatchingWorkouts(formData, runMiles) {
  const weeklyMileage = Number(formData.weeklyMileage);
  const { goal, experienceLevel } = formData;

  return WORKOUT_LIBRARY.filter((workout) => {
    return (
      workout.goal === goal &&
      workout.experienceLevels.includes(experienceLevel) &&
      weeklyMileage >= workout.minWeeklyMileage &&
      runMiles >= workout.minRunMiles
    );
  });
}

function selectBestWorkout(workouts, runMiles) {
  return workouts.reduce((bestWorkout, currentWorkout) => {
    const bestDifference = Math.abs(bestWorkout.preferredRunMiles - runMiles);
    const currentDifference = Math.abs(currentWorkout.preferredRunMiles - runMiles);

    return currentDifference < bestDifference ? currentWorkout : bestWorkout;
  });
}

function formatWorkoutDescription(workout, runMiles) {
  const scaledWarmupMiles = getScaledWarmupMiles(runMiles);
  const scaledCooldownMiles = getScaledCooldownMiles(runMiles);
  const { mainSet } = workout.segments;

  return `Warm up ${scaledWarmupMiles} miles easy, then ${mainSet}, cool down ${scaledCooldownMiles} miles easy. Total: about ${runMiles} miles.`;
}

function getScaledWarmupMiles(runMiles) {
  if (runMiles >= 6) {
    return 2;
  }

  return 1;
}

function getScaledCooldownMiles(runMiles) {
  if (runMiles >= 6) {
    return 2;
  }

  return 1;
}

export default generatePlan;