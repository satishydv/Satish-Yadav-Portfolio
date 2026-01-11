import { type ExpTypes } from '@/types/components/experience-types';

const experience: ExpTypes[] = [
  {
    org: 'ABO Infotech Pvt. Ltd.',
    duration: 'September 2025 - Present',
    logo: '/company/sylow.png',
    role: 'UI/UX Designer + Full Stack Developer',
    link: 'https://www.sylow.ai/',
    desc: [
      'Developed and completed 10 + Projects using Mern Stack and NextJS.',
      'Designed responsive and user-friendly interfaces, leveraging modern UI/UX principles.',
      'Collaborated with clients to gather requirements and deliver tailored web solutions, ensuring high customer satisfaction.',
      'Published a reusable npm package that abstracts AWS Amplify Auth setup with IAM-backed configuration, enabling teams to plug in Cognito.',
    ],
  },
  {
    org: 'Inkhub',
    duration: 'April - August 2025',
    logo: '/company/kannect.png',
    role: 'Fullstack Developer Intern',
    link: 'https://kannect.co/',
    desc: [
      'Implemented automatic Algolia indexing with AWS Lambda and API Gateway streaming CRUD events.',
      'Refined the front-end for Inkhub’s Admin website, ensuring responsive, and reducing bounce rates by about 35%.',
      'Collaborated closely with cross-functional teammates, contributed in daily stand-ups and design reviews.',
    ],
  },
];

export default experience;
