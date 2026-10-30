import {Carousel} from 'antd';

interface Props {
    images: string[]
}

const App = ({images}: Props) => {
    return <Carousel
        draggable
        autoplay
        dots={false}             // Ẩn/hiện chấm tròn bên dưới slider
        slidesToShow={5}         // Số lượng ảnh hiển thị cùng 1 lúc (5 hình như mẫu)
        slidesToScroll={1}       // Số lượng ảnh trượt mỗi lần
        infinite={true}          // Cho phép trượt lặp lại vô tận
        responsive={[            // Cấu hình hiển thị theo kích thước màn hình (Responsive)
            {
                breakpoint: 1200,
                settings: {slidesToShow: 4},
            },
            {
                breakpoint: 992,
                settings: {slidesToShow: 3},
            },
            {
                breakpoint: 768,
                settings: {slidesToShow: 2},
            },
            {
                breakpoint: 480,
                settings: {slidesToShow: 1},
            },
        ]}
    >
        {images.map((img, index) => (
            <div key={index} className="px-1.5 focus:outline-none">
                {/* Tỉ lệ ảnh dọc aspect-[3/4] chuẩn ảnh mẫu thời trang */}
                <div className="overflow-hidden aspect-[3/4] bg-gray-100 group cursor-pointer">
                    <img
                        src={img}
                        alt={`Slide ${index}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </div>
        ))}
    </Carousel>
}

export default App;