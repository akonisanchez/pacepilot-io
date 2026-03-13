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
    We distribute the remaining miles across all non-long runs.

    Instead of rounding an equal split for every run, we:
    1. assign a base mileage using Math.floor()
    2. calculate leftover miles
    3. add one leftover mile to the first few runs

    This guarantees that the total weekly mileage matches
    the user's requested mileage exactly.
  */
  const nonLongRuns = plan.filter((run) => run.type !== 'Long Run');
  const baseMiles =
    nonLongRuns.length > 0 ? Math.floor(remainingMiles / nonLongRuns.length) : 0;
  let leftoverMiles =
    nonLongRuns.length > 0 ? remainingMiles % nonLongRuns.length : 0;

  const completedPlan = plan.map((run) => {
    if (run.type === 'Long Run') {
      return run;
    }

    let assignedMiles = baseMiles;

    if (leftoverMiles > 0) {
      assignedMiles += 1;
      leftoverMiles -= 1;
    }

    return {
      ...run,
      miles: assignedMiles,
    };
  });

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

export default generatePlan;