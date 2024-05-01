import { twMerge } from 'tailwind-merge';

export default function Section({
  children,
  name,
  className,
}: Readonly<{
  children: React.ReactNode;
  name: string;
  className?: string;
}>) {
  return (
    <section id={name} className={twMerge(`max-w-[1440px]`, className)}>
      {children}
    </section>
  );
}
