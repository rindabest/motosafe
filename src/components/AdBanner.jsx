import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AdBanner() {
  return (
    <div className="w-full   p-4 flex flex-col items-center justify-between gap-3 transition">

      <a href="tel:+919913151805" className='bg-gray-300/60 p-3 rounded-xl ' >AD Here [+91 9913151805]</a>


      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 sm:mt-0 flex flex-col bg-gray-300/60 p-3 rounded-xl items-center gap-2 transition text-center"
      >
        Tải ứng dụng MotorSafe ngay hôm nay
        <p>Hỗ trợ cứu hộ xe máy nhanh chóng, tiện lợi.</p>
        <img className='max-w-[120px] w-full ' src="/ms.png" />
        <p>Giải pháp tối ưu cho hành trình của bạn</p>
      </a>

      <a className='bg-gray-300/60 p-3 rounded-xl ' href="tel:+84123456789">Quảng cáo tại đây [Liên hệ: 0123 456 789]</a>
      <a className='bg-gray-300/60 p-3 rounded-xl ' href="tel:+84123456789">Quảng cáo tại đây [Liên hệ: 0123 456 789]</a>
    </div>
  );
}
