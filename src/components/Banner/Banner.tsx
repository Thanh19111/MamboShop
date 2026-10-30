import {Carousel} from 'antd';

interface Props {
    images: string[]
}

const App = ({images} : Props) => {
    return <Carousel
        arrows
        autoplay
        dots={false}             // Ẩn/hiện chấm tròn bên dưới slider
        slidesToShow={1}         // Số lượng ảnh hiển thị cùng 1 lúc (5 hình như mẫu)
        slidesToScroll={1}       // Số lượng ảnh trượt mỗi lần
        infinite={true}          // Cho phép trượt lặp lại vô tận
    >
        {images.map((img, index) => (
            <div key={index} className="px-1.5 focus:outline-none">
                <div className=" bg-gray-100 group cursor-pointer">
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