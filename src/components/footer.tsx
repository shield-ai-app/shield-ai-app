import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='hr flex w-full flex-row items-center justify-center gap-8 border-t border-t-muted-foreground py-8'>
      <p className='text-xs text-muted-foreground'>
        Copyright &copy; 2024 All Rights Reserved by Shield AI
      </p>
      <Link href='/privacy-policy' className='text-xs text-muted-foreground'>
        Privacy Policy
      </Link>
      <Link href='/terms-of-service' className='text-xs text-muted-foreground'>
        Terms of Service
      </Link>
    </footer>
  );
}
