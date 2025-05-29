'use client';
import Image from 'next/image';

interface LoadingScreenProps {
  size?: number;
}

export default function LoadingScreen({ size = 120 }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#2C2F36]">
      <Image 
        src="/images/Phoenix_ES_DADBE4.png" 
        alt="Loading..." 
        width={size}
        height={size}
        className="animate-[pulse_1.5s_ease-in-out_infinite]"
      />
    </div>
  );
} 
