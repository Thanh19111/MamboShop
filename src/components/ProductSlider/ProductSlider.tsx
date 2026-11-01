import ProductCard from "../ProductCard";
import {Carousel} from "antd";
import type {ProductType} from "../../types/product.type.ts";

interface Props {
    products: ProductType[]
}

const App = ({products}: Props) => {
    return <Carousel
        draggable
        dots={false}
        slidesToShow={4}
        rows={2}
        slidesPerRow={1}
        infinite={true}
    >
        {products.map((product) => (
            /* 💡 CHỈ DÙNG px-1.5 (hoặc px-2), XÓA mx-2 */
            <div key={product._id} className="px-1.5 py-2 focus:outline-none">
                <ProductCard
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                />
            </div>
        ))}
    </Carousel>
}

export default App;