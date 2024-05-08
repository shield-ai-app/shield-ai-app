'use client';

import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export default function NotifyMeEmail(props: { baseUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>
        Thanks for your interest in Shield AI! We received your information and
        will be in touch soon!
      </Preview>
      <Tailwind>
        <Body className='mx-auto my-auto bg-white px-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]'>
            <Section className='mt-[32px]'>
              <Img
                src={
                  props.baseUrl
                    ? `${props.baseUrl}/logo.png`
                    : 'http://localhost:3000/logo.png'
                }
                width={75}
                height={75}
                alt='Shield AI App Logo'
                className='mx-auto my-0 rounded-full'
              />
              <Text className='text-[14px] leading-[24px] text-black'>
                Hello!
              </Text>

              <Text className='text-[14px] leading-[24px] text-black'>
                Thanks for your interest in Shield AI! We received your
                information and will be in touch soon!
              </Text>

              <Text className='text-[14px] leading-[24px] text-black'>
                We&apos;re excited about what we&apos;re building and can&apos;t
                wait to share more with you. In the meantime, keep an eye out
                for more product updates regarding our launch!
              </Text>

              <Text className='mb-0 text-[14px] leading-[24px] text-black'>
                Rafael
              </Text>
              <Text className='mt-0 text-[14px] leading-[24px] text-black'>
                Founder & CEO | Shield AI App
              </Text>
            </Section>
            <Hr className='mx-0 my-2 w-full border border-solid border-[#eaeaea]' />
            <Row className='w-fit'>
              <Column>
                <Text className='text-[12px] text-[#666666]'>
                  Terms of Service
                </Text>
              </Column>

              <Column className='px-4'>
                <Text className='text-[12px] text-[#666666]'>
                  Privacy Policy
                </Text>
              </Column>
              <Column>
                <Text className='text-[12px] text-[#666666]'>Unsubscribe</Text>
              </Column>
            </Row>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
