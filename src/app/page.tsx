import Globe from '@/components/globe';
import Section from '@/components/section';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Section name='hero' className='flex w-full grow flex-col py-16'>
        <div className='flex w-full flex-col items-center justify-center'>
          <h1 className='text-primary-background inline-block bg-gradient-to-r from-primary to-backgroundDarker bg-clip-text pb-3 text-center text-8xl font-black text-transparent md:text-left'>
            Never Compromise Safety
          </h1>
          <p className='w-2/3 pt-8 text-center text-xl text-muted-foreground'>
            Building cutting-edge technology that{' '}
            <span className='text-primary'>
              keeps you and your loved ones safe
            </span>
            . Shield AI scans local first responder radio frequencies and
            immediately notifies you of any public threats.
          </p>
        </div>

        <div className='flex w-full grow flex-col items-center justify-center pt-8 md:flex-row'>
          <div className='flex w-2/5 flex-col justify-end gap-2 md:flex-row'>
            <Button asChild className='min-w-36'>
              <Link href='#'>Get Started</Link>
            </Button>
            <Button
              asChild
              className='min-w-36 border-2 border-backgroundDarker bg-background text-foreground hover:bg-primary hover:text-background'
            >
              <Link href='#learn-more'>Learn More</Link>
            </Button>
          </div>

          <div className='flex w-3/5 items-center justify-center pt-8 md:pt-0'>
            <Image
              width={300}
              height={300}
              src='/home.png'
              priority
              alt='logo'
            />
          </div>
        </div>
      </Section>
      <Section name='learn-more' className='pt-8'>
        <h1 className='text-primary-background text-4xl'>
          What is Shield AI?{' '}
          <span className='text-muted-foreground'>
            Your frontline shield that keeps you alert and aware on the go.
          </span>
        </h1>

        <Globe />
      </Section>

      <Section name='about' className='pt-8'>
        <h1 className='text-primary-background text-4xl'>Our Founders</h1>

        <div className='mt-4 h-96 w-full bg-muted'></div>
      </Section>
    </>
  );
}
