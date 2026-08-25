'use client';
import { useState } from 'react';
import { Check, Camera, CameraOff, Download, RefreshCcw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ContentSection, HomeLink, PageFrame, PrimaryButton, SectionKicker } from '@/components/site-shell';

const ARCanvas = dynamic(() => import('@/components/ARCanvas'), { ssr: false });

export default function ThayDoPage() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (imgData: string) => {
    setCapturedImage(imgData);
  };

  const handleSaveImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = 'sac-nung-ar-fitting.jpg';
    link.click();
  };

  return (
    <PageFrame>
      <section className="bg-primary text-primary-foreground">
        <ContentSection className="min-h-[85vh]">
          <div className="mb-8 flex items-center justify-between">
            <HomeLink />
            <span className="font-mono text-[9px] uppercase tracking-[.2em] text-primary-foreground/50">03 / Trải nghiệm AR</span>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary-foreground/10 pb-6">
              <div>
                <SectionKicker>Tính năng tương tác trực tiếp</SectionKicker>
                <h1 className="font-serif text-4xl md:text-6xl mt-2">
                  Phòng <span className="text-accent">thay đồ ảo AR</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm md:text-base text-primary-foreground/70 font-light">
                  Đứng trước webcam và giơ bàn tay để tương tác chọn trang phục truyền thống của dân tộc Nùng ngay trên màn hình, chấm đỏ trên bàn tay di chuyển đến ô trang phục nào thì trang phục đó sẽ được ướm lên người dùng.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                <button 
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-bold transition-all ${
                    isCameraOn 
                      ? 'border-accent/50 text-accent hover:bg-accent/10' 
                      : 'border-muted-foreground/50 text-muted-foreground hover:bg-muted-foreground/10'
                  }`}
                >
                  {isCameraOn ? <Camera className="size-4" /> : <CameraOff className="size-4" />}
                  {isCameraOn ? 'Tắt Camera' : 'Camera đang tắt'}
                </button>
                
                {isCameraOn && (
                  <span className="inline-flex items-center gap-2 border border-accent/50 bg-accent/10 px-4 py-2 text-xs text-accent">
                    <Check className="size-4" /> AR sẵn sàng
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-full h-[650px] bg-black rounded-3xl overflow-hidden border-4 border-accent/40 shadow-2xl flex items-center justify-center">
              
              {isCameraOn ? (
                <>
                  <ARCanvas onCapture={handleCapture} isPaused={!!capturedImage} />
                  
                  {/* Bảng Hướng dẫn thao tác (Ẩn đi khi đã chụp xong) */}
                  {!capturedImage && (
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none text-center space-y-2 w-full px-4">
                      <div className="inline-block bg-black/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-xs tracking-wider text-white shadow-xl">
                        <span className="text-accent font-bold">Lướt đốm đỏ</span> vào các nút bên phải để đổi trang phục
                      </div>
                      <div className="inline-block bg-accent/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-accent-foreground text-xs tracking-wider text-accent-foreground shadow-xl mt-2 font-medium">
                        <span className="font-bold">Giơ một tay lên cao qua đầu</span> và giữ 3 giây để chụp ảnh!
                      </div>
                    </div>
                  )}

                  {capturedImage && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
                      <img 
                        src={capturedImage} 
                        alt="Ảnh Fitting" 
                        className="h-[75%] rounded-xl shadow-2xl border-4 border-accent object-contain" 
                      />
                      <div className="mt-8 flex gap-5">
                        <button 
                          onClick={handleSaveImage} 
                          className="flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3 rounded-full font-bold text-sm hover:brightness-110 transition"
                        >
                          <Download className="size-5" /> Lưu ảnh về máy
                        </button>
                        <button 
                          onClick={() => setCapturedImage(null)} 
                          className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition"
                        >
                          <RefreshCcw className="size-5" /> Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center flex flex-col items-center">
                  <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
                    <CameraOff className="size-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-serif text-2xl text-primary-foreground">Trải nghiệm đang tạm nghỉ</h3>
                  <p className="mt-2 text-muted-foreground text-sm max-w-sm">
                    Hãy bật camera để hệ thống nhận diện chuyển động và giúp bạn ướm thử các bộ trang phục truyền thống nhé.
                  </p>
                  <button 
                    onClick={() => setIsCameraOn(true)}
                    className="mt-8 inline-flex items-center gap-2 border border-accent bg-accent/10 px-7 py-3 text-sm font-bold text-accent transition-all hover:bg-accent hover:text-accent-foreground rounded-full"
                  >
                    <Camera className="size-4" /> Khởi động Camera
                  </button>
                </div>
              )}

            </div>
          </div>
        </ContentSection>
      </section>

      <section className="bg-secondary">
        <ContentSection>
          <div className="mx-auto max-w-3xl text-center">
            <SectionKicker>Giá trị văn hóa</SectionKicker>
            <h2 className="font-serif text-4xl text-primary md:text-5xl">
              Trải nghiệm thực tế ảo,<br /><span className="text-accent">lưu giữ ngàn đời bản sắc.</span>
            </h2>
            <p className="mt-6 text-sm leading-8 text-muted-foreground">
              Thông qua công nghệ nhận diện chuyển động, bạn có thể dễ dàng tìm hiểu cấu trúc áo chàm, khăn và phụ kiện của đồng bào dân tộc Nùng một cách trực quan nhất.
            </p>
            <div className="mt-9">
              <PrimaryButton href="/trang-phuc">Đọc lại chuyên đề trang phục</PrimaryButton>
            </div>
          </div>
        </ContentSection>
      </section>
    </PageFrame>
  );
}