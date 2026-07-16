import useCounter from '../../lib/useCounter';

export default function AnimatedCounter({ value, duration = 2000, enabled = true, as = 'span', className = '' }) {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) {
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }

  const prefix = match[1];
  const num = parseInt(match[2], 10);
  const suffix = match[3];
  const count = useCounter(num, duration, enabled);
  const Tag = as;

  return (
    <Tag className={className}>
      {prefix}{count}{suffix}
    </Tag>
  );
}
