import imgCaribbeanIslands from "figma:asset/3e976fbfab2307ad7013a67a6530798439106f13.png";
import imgGradient from "figma:asset/90cbae0603dd3090f2e9dad0c9ad7778a71aacdd.png";

function CaribbeanIslands() {
  return <div className="absolute bg-center bg-cover bg-no-repeat inset-0" data-name="Caribbean Islands" style={{ backgroundImage: `url('${imgCaribbeanIslands}')` }} />;
}

function Background() {
  return (
    <div className="absolute bg-[#023047] h-[1073px] left-0 overflow-clip right-0 top-0" data-name="Background">
      <CaribbeanIslands />
      <div className="absolute bg-[position:0%_0%,_0%_0%,_0%_0%,_50%_50%] bg-size-[auto,auto,auto,cover] inset-0" data-name="Gradient" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 71.64%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(90deg, rgba(0, 5, 76, 0.5) 0%, rgba(0, 5, 76, 0.5) 100%), linear-gradient(rgba(0, 19, 115, 0.19) 0%, rgba(0, 36, 217, 0.42) 100%), url('${imgGradient}')` }} />
    </div>
  );
}

function Paragraph() {
  return <div className="absolute bottom-[16px] h-[76px] left-[1374.88px] w-[100.12px]" data-name="Paragraph" />;
}

export default function Component1491WDefault() {
  return (
    <div className="bg-[#121212] relative size-full" data-name="1491w default">
      <Paragraph />
      <Background />
    </div>
  );
}