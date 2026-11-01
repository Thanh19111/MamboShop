import type {SuccessResponse} from "../types/response.type.ts";
import http from "../utils/http.ts";
import type {Category} from "../types/category.type.ts";

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}

export default categoryApi
