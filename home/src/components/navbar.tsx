import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className='sticky left-0 top-0 z-10 flex w-full flex-row items-center justify-center border-b border-b-muted-foreground bg-background py-2'>
      <div className='flex w-full max-w-[1440px] flex-row items-center justify-between px-8'>
        <Link
          href='/'
          className='flex h-full flex-row items-center justify-center gap-2'
        >
          <Image
            width={50}
            height={50}
            className='rounded-lg border-2 border-primary'
            src='/logo.png'
            alt='Logo'
          />
          <p className='text-center text-3xl text-foreground'>Shield AI</p>
        </Link>
        <Button asChild disabled={true}>
          <Link href='#'>Download</Link>
        </Button>
      </div>
    </nav>
  );
}
