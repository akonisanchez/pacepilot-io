function RunList({ runs, expandedWorkoutIds, onToggleExplanation, idPrefix }) {
  return (
    <ul>
      {runs.map((run, index) => {
        const explanationId = `${idPrefix}-${index}`;
        const isExpanded = expandedWorkoutIds.includes(explanationId);

        return (
          <li key={`${idPrefix}-${run.type}-${index}`}>
            <strong>{run.type}:</strong> {run.miles} miles

            {run.workoutLabel && (
              <>
                <br />
                <span className="workout-label">{run.workoutLabel}</span>
              </>
            )}

            <br />
            <span>{run.notes}</span>

            {run.workoutExplanation && (
              <>
                <br />
                <button
                  type="button"
                  className="toggle-explanation-button"
                  onClick={() => onToggleExplanation(explanationId)}
                >
                  {isExpanded
                    ? 'Hide workout explanation'
                    : 'How this workout works'}
                </button>

                {isExpanded && (
                  <p className="workout-explanation">
                    {run.workoutExplanation}
                  </p>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default RunList;