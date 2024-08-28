import { formatUnits } from "viem";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

export function Amount({
  value,
  decimals,
}: {
  value: bigint;
  decimals: number;
}) {
  const unitsValue = formatUnits(value, decimals);
  const floatValue = parseFloat(unitsValue);

  if (floatValue !== 0 && floatValue < 0.0001) {
    return (
      <span
        className="underline underline-offset-4 decoration-dotted decoration-muted-foreground decoration-2 cursor-context-menu"
        title={unitsValue}
      >
        &lt;0.0001
      </span>
    );
  }

  const formattedValue = formatter.format(floatValue);

  if (formattedValue !== floatValue.toString()) {
    return <span title={unitsValue}>{formattedValue}</span>;
  }

  return <span>{formattedValue}</span>;
}
