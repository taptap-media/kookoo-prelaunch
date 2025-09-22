import svgPaths from "./svg-kfa7yy36w9";

function Package() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="package">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="package">
          <path d="M24.75 14.1L11.25 6.315" id="Vector" stroke="var(--stroke-0, #27C840)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p294eb6d0} id="Vector_2" stroke="var(--stroke-0, #27C840)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p38a20b00} id="Vector_3" stroke="var(--stroke-0, #27C840)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M18 33.12V18" id="Vector_4" stroke="var(--stroke-0, #27C840)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="backdrop-blur-[7.561px] backdrop-filter bg-[rgba(0,0,0,0.1)] box-border content-stretch flex flex-col gap-[18.902px] h-[162.561px] items-center justify-center px-[58.598px] py-[32.134px] relative rounded-[18.902px] shrink-0 w-[196.586px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[37.805px] justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[26.05px] w-[75.61px]">
        <p className="leading-[37.805px]">Cargo</p>
      </div>
      <Package />
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="info">
          <path d={svgPaths.p2e363280} id="Vector" stroke="var(--stroke-0, #FF5F57)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M18 24V18" id="Vector_2" stroke="var(--stroke-0, #FF5F57)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M18 12H18.015" id="Vector_3" stroke="var(--stroke-0, #FF5F57)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="backdrop-blur-[7.561px] backdrop-filter bg-[rgba(0,0,0,0.1)] box-border content-stretch flex flex-col gap-[18.902px] h-[162.561px] items-center justify-center px-[64.268px] py-[32.134px] relative rounded-[18.902px] shrink-0 w-[196.586px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[26.05px] text-nowrap">
        <p className="leading-[37.805px] whitespace-pre">Story</p>
      </div>
      <Info />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[35.575px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="SVG">
          <path d={svgPaths.p28941180} id="Vector" stroke="var(--stroke-0, #FEBC2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p3cb0aa80} id="Vector_2" stroke="var(--stroke-0, #FEBC2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p33cdf5c0} id="Vector_3" stroke="var(--stroke-0, #FEBC2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p113e2d80} id="Vector_4" stroke="var(--stroke-0, #FEBC2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="backdrop-blur-[7.561px] backdrop-filter bg-[rgba(0,0,0,0.1)] box-border content-stretch flex flex-col gap-[18.902px] h-[162.561px] items-center justify-center p-[32.134px] relative rounded-[18.902px] shrink-0 w-[196.586px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[25.843px] text-nowrap">
        <p className="leading-[37.805px] whitespace-pre">Passenger</p>
      </div>
      <Svg />
    </div>
  );
}

export default function Frame6() {
  return (
    <div className="content-stretch flex gap-[59px] items-center justify-center relative size-full">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}