import RunList from './RunList';

function SavedPlanCard({
  plan,
  expandedWorkoutIds,
  onToggleExplanation,
  onDeletePlan,
}) {
  return (
    <article className="saved-plan-item">
      <div className="saved-plan-header">
        <h3>
          {plan.inputs.weeklyMileage} mi · {plan.inputs.runDays} days ·{' '}
          {plan.inputs.goal}
        </h3>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDeletePlan(plan.id)}
        >
          Delete
        </button>
      </div>

      <RunList
        runs={plan.runs}
        expandedWorkoutIds={expandedWorkoutIds}
        onToggleExplanation={onToggleExplanation}
        idPrefix={plan.id}
      />
    </article>
  );
}

export default SavedPlanCard;