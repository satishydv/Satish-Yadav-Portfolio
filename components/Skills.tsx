const skills: Array<{ name: string; color: string }> = [
  { name: 'TypeScript', color: '#E0F2FE' }, // Pastel Blue
  { name: 'Javascript', color: '#FEF9C3' }, // Pastel Yellow
  { name: 'Next Js', color: '#F3E8FF' },    // Pastel Purple
  { name: 'React', color: '#E0FFFA' },      // Pastel Teal
  { name: 'Express', color: '#FCE7F3' },    // Pastel Pink
  { name: 'Node Js', color: '#DCFCE7' },    // Pastel Green
  { name: 'Tailwind', color: '#E0E7FF' },   // Pastel Indigo
  { name: 'PostgreSQL', color: '#FFEDD5' }, // Pastel Orange
  { name: 'Prisma', color: '#F1F5F9' },    // Pastel Slate
  { name: 'Supabase', color: '#ECFDF5' },  // Pastel Emerald
  { name: 'Neon DB', color: '#FFF7ED' },   // Pastel Amber
  { name: 'Zustand', color: '#FDF2F8' },   // Pastel Rose
  { name: 'Zod', color: '#F5F3FF' },       // Pastel Violet
  { name: 'Socket.IO', color: '#EFF6FF' }, // Pastel Sky
  { name: 'Git', color: '#F8FAFC' },       // Pastel Gray
  { name: 'AWS', color: '#FFF1F2' },       // Pastel Rose Red
  { name: 'JWT', color: '#FAFAF9' },       // Pastel Stone
  { name: 'Docker', color: '#F0FDFA' },    // Pastel Cyan
  { name: 'Vercel', color: '#F5F5F4' },    // Pastel Warm Gray
];

const Skills: React.FC = () => {
  return (
    <div className="mx-auto mb-[40px] h-[110px] w-[350px] lg:mb-[40px] lg:h-[160px] lg:w-[760px]">
      <div className="mx-auto mb-[10px] text-center text-[20px] font-semibold text-black lg:mb-[18px] lg:p-[2px] lg:text-[30px] dark:text-white">
        Skills
      </div>
      <div className="mx-auto flex h-auto w-[335px] flex-wrap justify-center gap-[6px] px-[2px] lg:w-[760px] lg:px-[4px]">
        {skills.map((el, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: el.color }}
            className="flex items-center justify-center rounded-full border border-black/10 px-3 py-1 text-center text-[10px] font-bold text-black/80 shadow-sm transition-transform hover:scale-105 lg:px-4 lg:py-1.5 lg:text-[13px] dark:border-white/10"
          >
            {el.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
