import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { AccentHeading, ContentSection, DecorativeRule, ImageCredit, ImageFrame, ImageMosaic, PageFrame, PagePattern, PrimaryButton, SectionKicker, TimelineItem } from '@/components/site-shell'

const details = [
  ['Màu chàm', 'Vải thường được nhuộm bằng lá chàm qua nhiều lần ngâm, phơi và vò. Sắc xanh đậm tạo nên vẻ trầm tĩnh, bền màu và gần gũi với môi trường miền núi.'],
  ['Áo nữ', 'Áo nữ thường là áo dài màu chàm, thân áo và nẹp áo tạo thành một đường dọc gọn gàng. Kiểu cài, độ dài và cách trang trí thay đổi theo từng nhóm Nùng.'],
  ['Áo nam', 'Nam giới thường mặc áo chàm giản dị hơn, phối cùng quần, khăn hoặc mũ trong những dịp lễ và sinh hoạt cộng đồng.'],
  ['Khăn và trang sức', 'Khăn đội đầu, vòng cổ, vòng tay hoặc đồ bạc có thể tạo điểm nhấn. Cách quấn khăn và phụ kiện phản ánh lứa tuổi, địa phương và dịp mặc.'],
]

export default function TrangPhucPage() {
  return (
    <PageFrame>
      <PagePattern>
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <SectionKicker>Trang phục truyền thống</SectionKicker>
                <h1 className="font-serif text-6xl leading-[.92] md:text-8xl mt-4">
                  Sắc chàm<br /><span className="text-accent">mặc lên</span><br />ký ức
                </h1>
                <p className="mt-8 max-w-lg text-base leading-8 text-primary-foreground/70">
                  Một bộ trang phục Nùng là kết quả của thời gian, đất đai và bàn tay người gieo hạt. Đừng nhìn nó như một món đồ vô tri vô giác, hãy nhìn như một ngôn ngữ nhận diện cộng đồng.
                </p>
              </div>
              
              {/* Thay thế ảnh trang phục thành Video tự động phát */}
              <figure className="image-frame relative overflow-hidden border border-primary-foreground/20 bg-primary/20 aspect-[1.15]">
                <video 
                  src="/trang-phuc.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 size-full object-cover" 
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent px-4 pb-3 pt-10 font-mono text-[9px] uppercase tracking-[0.12em] text-primary-foreground/75">
                  Tư liệu video
                </figcaption>
              </figure>

            </div>
          </div>
          <div className="mx-auto max-w-7xl border-t border-primary-foreground/20 px-5 py-4 lg:px-8">
            <p className="font-mono text-[9px] uppercase tracking-[.22em] text-primary-foreground/55">
              Tư liệu tham khảo 
            </p>
          </div>
        </section>
      </PagePattern>

      <ContentSection>
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Thay thế ảnh ruộng bậc thang nhỏ bằng ảnh trang phục */}
            <ImageMosaic large="/khong-gian-nung.jpg" small="/trang-phuc-nung.jpg" alt="Người Nùng và không gian văn hóa Đông Bắc" />
            <ImageCredit />
          </div>
          <div>
            <SectionKicker>01 / Đọc một bộ trang phục</SectionKicker>
            <AccentHeading>Đơn giản ở dáng hình,<br /><span className="text-accent">tinh tế ở chi tiết</span></AccentHeading>
            <DecorativeRule />
            <p className="text-sm leading-8 text-muted-foreground">
              Trang phục Nùng nổi bật bởi màu chàm, sự kín đáo, đường nét gọn và cách phối phụ kiện. Tuy nhiên, dân tộc Nùng có nhiều nhóm địa phương như Nùng Phàn Slình, Nùng An, Nùng Cháo, Nùng Inh… Vì vậy, kiểu áo, khăn, hoa văn và cách mặc không hoàn toàn giống nhau.
            </p>
            <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {details.map(([title, body]) => (
                <article key={title} className="border-t border-border pt-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center bg-primary text-primary-foreground"><Check className="size-3" /></span>
                    <h3 className="font-serif text-2xl text-primary">{title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>

      <section className="bg-secondary">
        <ContentSection>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <SectionKicker>02 / Xuất xứ của vải chàm</SectionKicker>
              <h2 className="font-serif text-5xl leading-tight text-primary">Một màu xanh<br /><span className="text-accent">có mùi của đất</span></h2>
              <p className="mt-6 max-w-xl text-sm leading-8 text-muted-foreground">
                Nhuộm chàm là một quy trình thủ công đòi hỏi kiên nhẫn. Vải được nhúng vào bể chàm nhiều lần, đưa ra phơi và vò để màu ngấm sâu. Cùng một sắc chàm nhưng mỗi vùng, mỗi gia đình có thể tạo ra độ xanh riêng.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <TimelineItem title="Lá chàm">Trồng, hái và ủ để tạo nước nhuộm.</TimelineItem>
                <TimelineItem title="Bàn tay">Nhúng, phơi, vò; lặp lại qua nhiều ngày.</TimelineItem>
                <TimelineItem title="Thời gian">Màu càng bền khi được chăm sóc đúng cách.</TimelineItem>
              </div>
            </div>
            {/* Thay thế ảnh ruộng bậc thang bằng ảnh trang phục */}
            <ImageFrame src="/vai-cham.jpg" alt="Trang phục truyền thống Nùng" className="aspect-[.9]" />
          </div>
        </ContentSection>
      </section>

      <section className="bg-primary px-5 py-20 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <SectionKicker>Trải nghiệm tương tác</SectionKicker>
            <h2 className="font-serif text-4xl md:text-5xl">Hiểu rồi, giờ thử<br /><span className="text-accent">một sắc chàm nhé?</span></h2>
          </div>
          <PrimaryButton href="/thay-do">Đến phòng thay đồ</PrimaryButton>
        </div>
      </section>
    </PageFrame>
  )
}