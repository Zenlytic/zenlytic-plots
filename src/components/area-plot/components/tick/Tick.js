export default function Tick({ payload: { value }, verticalAnchor, visibleTicksCount, ...rest }) {
  return (
    <text {...rest} className="bar-chart-tick" dy={12}>
      {value}
    </text>
  );
}
