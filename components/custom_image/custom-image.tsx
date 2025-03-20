import Image from "next/image";

type CustomImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const CustomImage = ({ src, alt, width, height }: CustomImageProps) => (
  <div style={{ border: "2px solid #000", padding: "10px" }}>
    <Image src={src} alt={alt} width={width} height={height} />
  </div>
);

export default CustomImage;
