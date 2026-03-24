import svgPaths from "./svg-yfx0ohu3k5";

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_15_151)" id="svg">
          <path d={svgPaths.p3ed5e500} id="Vector" stroke="var(--stroke-0, #78716C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
          <path d="M9.5 2.5L12.3 5.3" id="Vector_2" stroke="var(--stroke-0, #78716C)" strokeLinecap="round" strokeWidth="1.3" />
        </g>
        <defs>
          <clipPath id="clip0_15_151">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Div() {
  return (
    <div className="bg-white relative rounded-[11px] shrink-0 size-[38px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#1c1917] text-[14px] top-0 tracking-[-0.28px] whitespace-nowrap">Fill in manually</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#78716c] text-[12px] top-[0.5px] tracking-[-0.12px] whitespace-nowrap">Takes about 3 minutes</p>
    </div>
  );
}

function Div1() {
  return (
    <div className="flex-[1_0_0] h-[41px] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Container />
        <Container1 />
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-full" data-name="svg">
      <div className="absolute inset-[16.67%_36.67%_16.67%_30%]" data-name="Vector">
        <div className="absolute inset-[-7%_-14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 11.4">
            <path d="M0.7 0.7L5.7 5.7L0.7 10.7" id="Vector" stroke="var(--stroke-0, #78716C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MotionDiv() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="motion.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Svg1 />
      </div>
    </div>
  );
}

export default function MotionButton() {
  return (
    <div className="bg-[#f5f3f0] content-stretch flex gap-[12px] items-center px-[16px] relative rounded-[16px] size-full" data-name="motion.button">
      <Div />
      <Div1 />
      <MotionDiv />
    </div>
  );
}