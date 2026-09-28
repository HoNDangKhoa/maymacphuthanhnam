export const site = {
  name: "Phú Thành Nam",
  fullName: "Công ty May Mặc Phú Thành Nam",
  slogan: "Chính xác - Quy mô - Chất lượng",
  hotline: "0979 999 888",
  email: "lienhe@phuthanhnam.vn",
  headOffice: "TP. Hồ Chí Minh, Việt Nam",
  factoryAddress: "KCN Bình Dương, Việt Nam",
};

export const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Về PTN" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/nang-luc-san-xuat", label: "Năng lực sản xuất" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

export const stats = [
  {
    value: 11,
    suffix: "+",
    label: "Năm kinh nghiệm",
    caption: "Đồng hành sản xuất may mặc ổn định, chuẩn xuất khẩu.",
  },
  {
    value: 10000,
    suffix: "+",
    label: "Mã hàng",
    caption: "Đa dạng style — blazer, coat, jacket, pant và hơn thế.",
  },
  {
    value: 100,
    suffix: "+",
    label: "Đối tác",
    caption: "Thương hiệu trong nước và quốc tế tin tưởng lựa chọn.",
  },
  {
    value: 200,
    suffix: "+",
    label: "Nhân sự",
    caption: "Đội ngũ lành nghề từ phòng mẫu đến hoàn thiện.",
  },
];

export const trustFeatures = [
  {
    title: "Lợi ích khách hàng",
    description:
      "Tối ưu chi phí, kiểm soát chất lượng AQL và minh bạch tiến độ từng đơn hàng.",
  },
  {
    title: "Phương châm chúng tôi",
    description:
      "Chính xác trong form — quy mô đủ lớn — chất lượng ổn định xuyên suốt lô hàng.",
  },
  {
    title: "Khuyến khích sáng tạo",
    description:
      "Phòng mẫu đồng hành phát triển prototype, hỗ trợ brand thử nghiệm design mới.",
  },
  {
    title: "Fast Turnaround",
    description:
      "Lịch sản xuất linh hoạt, rút ngắn lead time cho mùa hàng và drop mới.",
  },
];

export const values = [
  {
    title: "Cam kết chất lượng",
    description:
      "Kiểm soát từng công đoạn từ cắt đến hoàn thiện, đạt tiêu chuẩn xuất khẩu.",
  },
  {
    title: "Phương châm phục vụ",
    description:
      "Đồng hành dài hạn cùng thương hiệu — minh bạch tiến độ và chi phí.",
  },
  {
    title: "Tối ưu chi phí",
    description:
      "Tối ưu nguyên liệu và dây chuyền để giữ giá cạnh tranh mà không giảm chất.",
  },
  {
    title: "Fast Turnaround",
    description:
      "Linh hoạt lịch sản xuất, rút ngắn lead time cho mùa hàng và drop mới.",
  },
  {
    title: "Giao hàng đúng hẹn",
    description: "Tỷ lệ giao hàng đúng thời hạn đạt 100% trên các đơn đã xác nhận.",
  },
];

export const services = [
  {
    slug: "oem-odm",
    title: "OMD",
    subtitle: "Sản xuất theo thiết kế gốc",
    description:
      "Từ concept đến sản phẩm hoàn thiện — phát triển mẫu, chọn vải, sản xuất số lượng lớn.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
  },
  {
    slug: "cmt",
    title: "CMT",
    subtitle: "Cắt, May & Hoàn thiện",
    description:
      "Nhận gia công CMT với máy móc hiện đại, kiểm soát KCS và đóng gói xuất xưởng.",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
  },
];

export const productCategories = ["BLAZER", "COAT", "JACKET", "PANT"];

export const productCategoryInfo: Record<
  string,
  { name: string; description: string; image: string }
> = {
  BLAZER: {
    name: "Áo Blazer",
    description:
      "Blazer nam nữ form chuẩn, may đo tỉ mỉ từ vai áo, ve áo đến lớp lót — đáp ứng tiêu chuẩn xuất khẩu.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
  },
  COAT: {
    name: "Áo Coat",
    description:
      "Áo khoác dáng dài cho mùa thu đông, xử lý tốt vải dày, lót trong và đường may chịu lực.",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=80",
  },
  JACKET: {
    name: "Áo Jacket",
    description:
      "Jacket chất liệu kỹ thuật: dù, nỉ, denim — chi tiết khóa kéo, bo tay và túi phức tạp.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80",
  },
  PANT: {
    name: "Quần Pant",
    description:
      "Quần âu, kaki, casual — tối ưu rập để đứng dáng, vừa vặn theo nhiều size chart.",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=80",
  },
};

export const products = [
  {
    id: "1",
    slug: "ao-blazer",
    name: "Áo Blazer",
    label: "ÁO BLAZER",
    category: "BLAZER",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=80",
    detailTitle: "Form dáng chuẩn — đường may tinh tế",
    description:
      "Blazer là dòng sản phẩm chủ lực của Phú Thành Nam. Mỗi mẫu áo bắt đầu từ **techpack và rập chuẩn**, được phòng mẫu dựng proto, **chỉnh fit nhiều vòng** để vai áo, ve áo và độ ôm thân đạt đúng tinh thần thiết kế của thương hiệu.\n\nChúng tôi kiểm soát chặt từ khâu **chọn vải, ép keo, may ráp đến ủi định hình** và **KCS theo tiêu chuẩn AQL** — đảm bảo từng chiếc blazer đồng đều về chất lượng trên toàn bộ lô hàng xuất khẩu.",
    gallery: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    ],
  },
  {
    id: "2",
    slug: "ao-coat",
    name: "Áo Coat",
    label: "ÁO COAT",
    category: "COAT",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&q=80",
    detailTitle: "Ấm áp, sang trọng — bền bỉ theo mùa",
    description:
      "Áo coat đòi hỏi tay nghề cao ở khâu **xử lý vải dày, lót trong và đường may chịu lực**. Đội ngũ PTN phát triển mẫu từ phác thảo, thử nghiệm chất liệu và phụ liệu để áo **giữ form đẹp, đứng dáng** qua nhiều mùa sử dụng.\n\nToàn bộ quy trình từ cắt CNC, may ráp đến hoàn thiện được **giám sát theo SOP**, giúp thương hiệu yên tâm về tiến độ và chất lượng cho mùa thu đông.",
    gallery: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    ],
  },
  {
    id: "3",
    slug: "ao-jacket",
    name: "Áo Jacket",
    label: "ÁO JACKET",
    category: "JACKET",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&q=80",
    detailTitle: "Năng động, bền chắc — chuẩn xuất khẩu",
    description:
      "Jacket tại Phú Thành Nam được sản xuất trên **dây chuyền chuyên biệt cho chất liệu kỹ thuật**: dù, nỉ, denim và vải phối. Chúng tôi xử lý tốt **khóa kéo, bo tay, đường diễu** và các chi tiết túi phức tạp.\n\nMỗi đơn hàng đều trải qua kiểm tra đường may, độ bền phụ liệu và thông số size trước khi đóng gói — đáp ứng yêu cầu khắt khe của các **thị trường quốc tế**.",
    gallery: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    ],
  },
  {
    id: "4",
    slug: "quan-pant",
    name: "Quần Pant",
    label: "QUẦN PANT",
    category: "PANT",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=80",
    detailTitle: "Vừa vặn, thoải mái — tỉ mỉ từng chi tiết",
    description:
      "Quần pant là dòng sản phẩm đa dạng từ âu, kaki đến casual. Phòng mẫu của PTN **tối ưu rập** để quần đứng dáng, **vừa vặn ở eo, đáy và ống** — phù hợp nhiều size chart khác nhau của thương hiệu.\n\nChúng tôi kiểm soát độ đồng đều đường may, **cạp, túi và khuy nút** trên từng lô hàng, đảm bảo sản phẩm đạt chuẩn trước khi xuất xưởng.",
    gallery: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    ],
  },
];

export const galleryItems = [
  {
    id: "g1",
    title: "Dây chuyền cắt",
    caption: "Máy cắt tự động CNC",
    imageUrl:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=80",
  },
  {
    id: "g2",
    title: "Xưởng may",
    caption: "Hơn 500 công nhân lành nghề",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
  },
  {
    id: "g3",
    title: "Phòng mẫu",
    caption: "Phát triển mẫu nhanh 7–14 ngày",
    imageUrl:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
  },
  {
    id: "g4",
    title: "KCS",
    caption: "Kiểm định chất lượng đa tầng",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80",
  },
  {
    id: "g5",
    title: "Hoàn thiện",
    caption: "Ủi · Cắt chỉ · Đóng thùng",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80",
  },
  {
    id: "g6",
    title: "Xuất xưởng",
    caption: "Đóng gói đạt chuẩn xuất khẩu",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
  },
];

export const workflowSteps = [
  {
    stepNumber: "01",
    title: "Tiếp nhận",
    subtitle: "Brief & Techpack",
    description:
      "Tiếp nhận yêu cầu, phân tích techpack, tư vấn vải và phương án gia công phù hợp ngân sách.",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
  },
  {
    stepNumber: "02",
    title: "Làm mẫu",
    subtitle: "Sample Development",
    description:
      "Phòng mẫu thực hiện proto / fit sample, chỉnh sửa theo feedback thương hiệu đến khi chốt.",
    imageUrl:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
  },
  {
    stepNumber: "03",
    title: "Sản xuất lớn",
    subtitle: "Bulk Production",
    description:
      "Triển khai dây chuyền theo SOP, theo dõi tiến độ realtime và báo cáo định kỳ cho đối tác.",
    imageUrl:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=80",
  },
  {
    stepNumber: "04",
    title: "KCS",
    subtitle: "Quality Control",
    description:
      "Kiểm soát chất lượng AQL, đo size, kiểm tra đường may và phụ liệu trước khi đóng gói.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80",
  },
  {
    stepNumber: "05",
    title: "Xuất xưởng",
    subtitle: "Packing & Delivery",
    description:
      "Đóng gói theo yêu cầu, lập chứng từ xuất khẩu và giao hàng đúng lịch cam kết.",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
  },
];

export const testimonials = [
  {
    quote:
      "PTN đã đồng hành phát triển thương hiệu của chúng tôi. Sự tỉ mỉ trong từng đường may và cam kết chất lượng là điều khó tìm thấy ở đối tác khác.",
    author: "Sarah Jenkins",
    role: "Founder, Urban Threads",
    initials: "SJ",
    avatarTone: "ink" as const,
  },
  {
    quote:
      "Dịch vụ one-stop giúp chúng tôi tiết kiệm rất nhiều thời gian. Từ thiết kế mẫu đến giao hàng — quy trình liền mạch. Rất đáng tin cậy.",
    author: "David Chen",
    role: "CEO, ActiveWear Co.",
    initials: "DC",
    avatarTone: "accent" as const,
  },
  {
    quote:
      "Trước đây chúng tôi gặp khó về chất lượng ổn định. Phòng mẫu và sản xuất bulk của PTN thực sự ở mức top-tier.",
    author: "Elena Rodriguez",
    role: "Creative Director, ER Label",
    initials: "ER",
    avatarTone: "ink" as const,
  },
];

export const aboutSections = [
  {
    id: "lich-su",
    title: "Lịch sử hình thành",
    content:
      "Phú Thành Nam được thành lập với sứ mệnh cung cấp dịch vụ gia công may mặc đạt chuẩn quốc tế cho các thương hiệu trong và ngoài nước. Qua hơn một thập kỷ, PTN đã mở rộng quy mô xưởng, đầu tư máy móc tự động và xây dựng đội ngũ kỹ thuật vững chắc.",
  },
  {
    id: "tam-nhin",
    title: "Tầm nhìn & Sứ mệnh",
    content:
      "Tầm nhìn: trở thành đối tác sản xuất may mặc đáng tin cậy tại khu vực. Sứ mệnh: mang đến sản phẩm chính xác về form, ổn định về chất lượng và minh bạch về tiến độ cho mọi đơn hàng.",
  },
  {
    id: "gia-tri",
    title: "Giá trị cốt lõi",
    content:
      "Chính xác trong từng đường may. Quy mô đủ lớn để đáp ứng bulk order. Chất lượng kiểm soát xuyên suốt — từ phòng mẫu đến xuất xưởng.",
  },
  {
    id: "nhan-su",
    title: "Năng lực con người",
    content:
      "Hơn 500 nhân sự gồm thợ may lành nghề, kỹ thuật viên mẫu, QC và đội ngũ quản lý sản xuất. Đào tạo liên tục theo chuẩn vận hành xuất khẩu.",
  },
  {
    id: "chung-chi",
    title: "Hệ thống chứng chỉ",
    content:
      "Định hướng vận hành theo các chuẩn ISO, WRAP, BSCI nhằm đáp ứng yêu cầu compliance của đối tác quốc tế.",
  },
];

export const newsCategories = [
  "Tất cả",
  "Công nghệ dây chuyền",
  "Vải & Nguyên phụ liệu",
  "Xuất khẩu",
  "Tin thị trường",
];

export const posts = [
  {
    slug: "day-chuyen-cat-tu-dong",
    title: "Nâng cấp dây chuyền cắt tự động CNC",
    summary:
      "PTN đầu tư hệ thống cắt tự động giúp tối ưu hao hụt vải và tăng tốc độ chuẩn bị bán thành phẩm.",
    category: "Công nghệ dây chuyền",
    type: "CAPABILITY" as const,
    date: "2026-03-12",
    thumbnail:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=80",
    contentHtml: `
      <h2>Công nghệ cắt chính xác</h2>
      <p>Hệ thống cắt CNC mới cho phép tối ưu marker, giảm hao hụt và đồng bộ dữ liệu với phòng mẫu.</p>
      <blockquote>Mỗi centimet vải được tính toán — đó là cách chúng tôi giữ chất lượng và chi phí.</blockquote>
      <h3>Lợi ích cho đối tác</h3>
      <ul>
        <li>Lead time chuẩn bị bán thành phẩm ngắn hơn</li>
        <li>Đồng đều kích thước giữa các lô</li>
        <li>Báo cáo hao hụt minh bạch</li>
      </ul>
    `,
  },
  {
    slug: "xu-huong-vai-aw26",
    title: "Xu hướng vải & nguyên phụ liệu AW26",
    summary:
      "Tổng hợp các loại vải được thương hiệu quan tâm cho mùa Thu Đông: softshell, wool blend, stretch twill.",
    category: "Vải & Nguyên phụ liệu",
    type: "NEWS" as const,
    date: "2026-02-28",
    thumbnail:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
    contentHtml: `
      <h2>Vải nổi bật mùa AW26</h2>
      <p>Softshell kỹ thuật, wool blend trung bình và stretch twill tiếp tục là lựa chọn phổ biến cho outerwear và workwear.</p>
    `,
  },
  {
    slug: "xuat-khau-dong-phuc",
    title: "Đơn hàng đồng phục xuất khẩu quý I",
    summary:
      "PTN hoàn tất lô đồng phục xuất khẩu với tỷ lệ giao hàng đúng hạn 100%.",
    category: "Xuất khẩu",
    type: "NEWS" as const,
    date: "2026-01-20",
    thumbnail:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80",
    contentHtml: `
      <h2>Cam kết đúng hạn</h2>
      <p>Quy trình KCS đa tầng và lịch sản xuất linh hoạt giúp PTN giữ cam kết giao hàng với đối tác xuất khẩu.</p>
    `,
  },
  {
    slug: "phong-mau-7-ngay",
    title: "Phòng mẫu: chu kỳ phát triển 7–14 ngày",
    summary:
      "Năng lực làm mẫu nhanh giúp thương hiệu chốt form sớm và đẩy bulk đúng mùa.",
    category: "Công nghệ dây chuyền",
    type: "CAPABILITY" as const,
    date: "2025-12-05",
    thumbnail:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80",
    contentHtml: `
      <h2>Sample Development</h2>
      <p>Từ proto đến fit sample, đội ngũ kỹ thuật PTN làm việc sát brief để rút ngắn vòng chỉnh sửa.</p>
    `,
  },
  {
    slug: "thi-truong-may-mac-2026",
    title: "Nhịp thị trường may mặc 2026",
    summary:
      "Các thương hiệu ưu tiên đối tác có năng lực compliance và lead time linh hoạt.",
    category: "Tin thị trường",
    type: "NEWS" as const,
    date: "2025-11-18",
    thumbnail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
    contentHtml: `
      <h2>Xu hướng sourcing</h2>
      <p>Nearshore và đối tác có chứng chỉ quốc tế tiếp tục được ưu tiên trong chuỗi cung ứng.</p>
    `,
  },
  {
    slug: "kcs-aql",
    title: "Hệ thống KCS theo chuẩn AQL",
    summary:
      "Quy trình kiểm định giúp giảm tỷ lệ lỗi và bảo vệ uy tín thương hiệu trên từng lô hàng.",
    category: "Công nghệ dây chuyền",
    type: "CAPABILITY" as const,
    date: "2025-10-02",
    thumbnail:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80",
    contentHtml: `
      <h2>Quality Control</h2>
      <p>Kiểm tra đường may, size, phụ liệu và hoàn thiện trước khi đóng thùng xuất xưởng.</p>
    `,
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByType(type?: "NEWS" | "CAPABILITY") {
  if (!type) return posts;
  return posts.filter((p) => p.type === type);
}
