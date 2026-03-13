/*
  generatePlan takes the user's form inputs
  and returns a flexible weekly running plan.
*/
function generatePlan(formData) {
  const weeklyMileage = Number(formData.weeklyMileage);
  const runDays = Number(formData.runDays);
  const { experienceLevel, goal, longRunPreference } = formData;

  const plan = [];

  /*
    We calculate a long run percentage based on the user's preference.
    This determines how much of the weekly mileage should be assigned
    to the long run.
  */
  let longRunPercent = 0.3;

  if (longRunPreference === 'light') {
    longRunPercent = 0.25;
  } else if (longRunPreference === 'moderate') {
    longRunPercent = 0.3;
  } else if (longRunPreference === 'strong') {
    longRunPercent = 0.35;
  }

  const longRunMiles = Math.max(3, Math.round(weeklyMileage * longRunPercent));
  const remainingMiles = Math.max(0, weeklyMileage - longRunMiles);

  /*
    Build the weekly structure based on preferred run days.
  */
  if (runDays === 3) {
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Comfortable conversational pace.',
    });
    plan.push({
      type: 'Workout Run',
      miles: 0,
      notes: getWorkoutNote(goal, experienceLevel),
    });
    plan.push({
      type: 'Long Run',
      miles: longRunMiles,
      notes: 'Steady effort. Do not race this run.',
    });
  }

  if (runDays === 4) {
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Comfortable conversational pace.',
    });
    plan.push({
      type: 'Workout Run',
      miles: 0,
      notes: getWorkoutNote(goal, experienceLevel),
    });
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Relaxed aerobic effort.',
    });
    plan.push({
      type: 'Long Run',
      miles: longRunMiles,
      notes: 'Steady effort. Do not race this run.',
    });
  }

  if (runDays === 5) {
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Comfortable conversational pace.',
    });
    plan.push({
      type: 'Workout Run',
      miles: 0,
      notes: getWorkoutNote(goal, experienceLevel),
    });
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Relaxed aerobic effort.',
    });
    plan.push({
      type: 'Recovery Run',
      miles: 0,
      notes: 'Short and easy. Keep effort low.',
    });
    plan.push({
      type: 'Long Run',
      miles: longRunMiles,
      notes: 'Steady effort. Do not race this run.',
    });
  }

  if (runDays === 6) {
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Comfortable conversational pace.',
    });
    plan.push({
      type: 'Workout Run',
      miles: 0,
      notes: getWorkoutNote(goal, experienceLevel),
    });
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Relaxed aerobic effort.',
    });
    plan.push({
      type: 'Recovery Run',
      miles: 0,
      notes: 'Short and easy. Keep effort low.',
    });
    plan.push({
      type: 'Easy Run',
      miles: 0,
      notes: 'Smooth aerobic running.',
    });
    plan.push({
      type: 'Long Run',
      miles: longRunMiles,
      notes: 'Steady effort. Do not race this run.',
    });
  }

  /*
    This distribute the remaining miles across non-long runs using weights.

    Assign a weight to each non-long run.
    Then calculate each run's share of the remaining mileage.
    Then distribute leftover miles one at a time so the
    weekly total still matches exactly.
  */
  const nonLongRuns = plan.filter((run) => run.type !== 'Long Run');
  const weightedRuns = nonLongRuns.map((run) => ({
    ...run,
    weight: getRunWeight(run.type),
  }));

  const totalWeight = weightedRuns.reduce(
    (sum, run) => sum + run.weight,
    0
  );

  let assignedMilesTotal = 0;

  const runsWithBaseMiles = weightedRuns.map((run) => {
    const exactMiles = totalWeight > 0
      ? (remainingMiles * run.weight) / totalWeight
      : 0;

    const baseMiles = Math.floor(exactMiles);
    assignedMilesTotal += baseMiles;

    return {
      ...run,
      miles: baseMiles,
      exactMiles,
    };
  });

  let leftoverMiles = remainingMiles - assignedMilesTotal;

  /*
    Give leftover miles to the runs with the largest decimal remainder first.
    This keeps the final output closer to the intended weighted split.
  */
  const runsSortedByRemainder = [...runsWithBaseMiles].sort(
    (a, b) => (b.exactMiles - b.miles) - (a.exactMiles - a.miles)
  );

  for (let i = 0; i < leftoverMiles; i += 1) {
    runsSortedByRemainder[i].miles += 1;
  }

  /*
    Rebuild the original plan order and remove helper-only fields
    like weight and exactMiles before returning the final plan.
  */
  const finalizedNonLongRuns = runsWithBaseMiles.map((run) => {
    const updatedRun = runsSortedByRemainder.find(
      (sortedRun) =>
        sortedRun.type === run.type &&
        sortedRun.notes === run.notes
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

  return completedPlan;
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

  if (runType === 'Easy Run') {
    return 1;
  }

  return 1;
}

export default generatePlan;