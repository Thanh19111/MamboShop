import type {ProductType, ProductList, ProductListConfig} from "../types/product.type.ts";
import http from "../utils/http.ts";
import type {SuccessResponse} from "../types/response.type.ts";

const path = 'products'
const productApi = {
    getProducts(params: ProductListConfig) {
        return http.get<SuccessResponse<ProductList>>(path, {
            params
        })
    },
    getProductDetail(id: string) {
        return http.get<SuccessResponse<ProductType>>(`${path}/${id}`)
    }
}

export default productApi
