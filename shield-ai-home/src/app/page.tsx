'use client';

import Globe from '@/components/globe';
import Section from '@/components/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { notify } from '@/app/actions/notify';
import { toast } from 'sonner';
import NotifyMeEmail from '../../emails/notify-me';
import { render } from '@react-email/components';

export default function Home() {
  const ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Section name='hero' className='flex w-full grow flex-col py-16'>
        <div className='flex w-full flex-col items-center justify-center'>
          <h1 className='text-primary-background inline-block text-pretty bg-gradient-to-r from-primary to-backgroundDarker bg-clip-text pb-3 text-8xl font-black text-transparent md:text-left'>
            Never Compromise Safety
          </h1>
          <p className='w-2/3 text-pretty pt-8 text-xl text-muted-foreground'>
            Building cutting-edge technology that{' '}
            <span className='text-primary'>
              keeps you and your loved ones safe
            </span>
            . Shield AI scans local first responder radio frequencies and
            immediately notifies you of any public threats.
          </p>
        </div>

        <div className='flex w-full grow flex-col items-center justify-center gap-8 pt-8 md:flex-row'>
          <div className='flex w-1/2 flex-col items-end'>
            <form
              ref={ref}
              className='flex max-w-md flex-col justify-end gap-2'
              action={async (formData) => {
                setLoading(true);
                await notify(
                  formData.get('email')?.toString(),
                  render(<NotifyMeEmail baseUrl={window.location.origin} />)
                )
                  .then(() => {
                    toast('You have successfully subscribed!');
                    ref.current?.reset();
                  })
                  .catch((err) => {
                    toast(`There was an error: ${err}`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              <Label htmlFor='email' className='text-pretty text-base'>
                Get a notification when the app becomes available on the app
                store:
              </Label>
              <Input
                required
                name='email'
                id='email'
                type='email'
                placeholder='Email'
              />
              <Button type='submit' className='text-base' disabled={loading}>
                Notify me
              </Button>
              <p className='text-pretty text-sm text-muted-foreground'>
                By signing up, you agree to receive communications from Shield
                AI. Don&apos;t worry we promise not to spam you.
              </p>
            </form>
          </div>

          <div className='flex w-1/2 items-center justify-start pt-8 md:pt-0'>
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
    </>
  );
}
