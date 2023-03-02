<template>
  <Loading :active="isLoading" :z-index="1060"></Loading>
  <div class="container">
    <h3 class="fw-bold">後台產品列表</h3>
    <div class="text-end mt-4">
      <!-- data-bs-toggle="modal" data-bs-target="#productModal" -->
      <button class="btn btn-primary" @click="openModal('new')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-end">{{ product.origin_price }}</td>
          <td class="text-end">{{ product.price }}</td>
          <td>
            <span class="text-success" v-if="product.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('del', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination :pages="page" :get-products="getProducts"></pagination>
  </div>

  <!-- Modal 新增 & 編輯-->
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">輸入圖片網址</label>
                  <input
                    type="text"
                    v-model="tempProduct.imageUrl"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <img
                  class="img-fluid"
                  :src="tempProduct.imageUrl"
                  :alt="tempProduct.title"
                />
              </div>
              <h2 class="fw-bold">多圖新增</h2>

              <!-- 判斷是否為陣列 -->
              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <!-- 為避免key 一樣可以在後面+數字 -->
                <div
                  v-for="(image, key) in tempProduct.imagesUrl"
                  :key="key + 1"
                >
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">圖片網址</label>
                    <!-- 要改陣列裡原始值的時候，要用索引去帶 ↓ -->
                    <input
                      type="text"
                      v-model="tempProduct.imagesUrl[key]"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img class="img-fluid" :src="image" />
                </div>

                <div v-if="tempProduct.imagesUrl.length < 5">
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.push('')"
                  >
                    <!-- 新增一組空的 lable & input -->
                    新增圖片
                  </button>
                </div>
                <div v-if="tempProduct.imagesUrl.length > 0">
                  <button
                    class="btn btn-outline-danger btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.pop()"
                  >
                    <!-- 從最後一個開始刪除 -->
                    刪除圖片
                  </button>
                </div>
              </div>
              <div v-else>
                <!-- 預設只有一張主圖時，不會有 imagesUrl，所以要新增一組空的 -->
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImgs"
                >
                  新增圖片
                </button>
              </div>
            </div>

            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  v-model="tempProduct.title"
                  class="form-control"
                  placeholder="請輸入標題"
                />
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    type="text"
                    v-model="tempProduct.category"
                    class="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    type="text"
                    v-model="tempProduct.unit"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    type="number"
                    v-model.number="tempProduct.origin_price"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    type="number"
                    v-model.number="tempProduct.price"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  type="text"
                  v-model="tempProduct.description"
                  class="form-control"
                  placeholder="請輸入產品描述"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  type="text"
                  v-model="tempProduct.content"
                  class="form-control"
                  placeholder="請輸入說明內容"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    v-model="tempProduct.is_enabled"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="newOrEditProduct"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 刪除-->
  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除 {{ tempProduct.title }}
          <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
</template>

<script>
import * as bootstrap from 'bootstrap'
import pagination from '@/components/backstage/PaginationView.vue'

const { VITE_URL, VITE_PATH } = import.meta.env
let productModal = null
let delProductModal = null

export default {
  props: ['checkAdmin'],
  data () {
    return {
      products: [],
      isNew: true,
      tempProduct: {
        imagesUrl: []
      },
      isLoading: false,
      page: {} // 用變數決定現在要帶第幾頁
    }
  },
  components: {
    pagination
  },
  methods: {
    getProducts (page = 1) {
      this.isLoading = true
      this.$http
        .get(`${VITE_URL}/v2/api/${VITE_PATH}/admin/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products
          this.page = res.data.pagination
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
          console.log(err)
          alert(err.response.data.message)
        })
    },
    openModal (type, product) {
      if (type === 'new') {
        this.isNew = true
        this.tempProduct = {
          // 如果先開啟編輯，再新增，this.tempProduct 會帶到資料，所以這個動作意思是要先清空欄位
          imagesUrl: []
        }
        productModal.show()
      } else if (type === 'del') {
        this.tempProduct = { ...product } // 避免位儲存改到原本的值
        delProductModal.show()
      } else if (type === 'edit') {
        this.isNew = false
        this.tempProduct = { ...product }
        productModal.show()
      }
    },
    newOrEditProduct () {
      // console.log(this.tempProduct);
      if (this.isNew) {
        this.$http
          .post(`${VITE_URL}/v2/api/${VITE_PATH}/admin/product`, {
            data: this.tempProduct
          })
          .then((res) => {
            alert(res.data.message)
            productModal.hide()
            this.getProducts()
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      } else {
        this.$http
          .put(
            `${VITE_URL}/v2/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`,
            {
              data: this.tempProduct
            }
          )
          .then((res) => {
            alert(res.data.message)
            productModal.hide()
            this.getProducts()
          })
          .catch((err) => {
            // alert(err.response.data.message);
            alert(err.response.data.message)
          })
      }
    },
    deleteProduct () {
      this.isLoading = true
      this.$http
        .delete(
          `${VITE_URL}/v2/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          alert(res.data.message)
          delProductModal.hide()
          this.getProducts()
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
          alert(err.response.data.message)
        })
    },
    createImgs () {
      // 只有一張主圖時，不會有 imagesUrl，要新增一組空的，才能往下新增其他照片
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
    }
  },
  mounted () {
    this.checkAdmin()
    this.getProducts()
    // btn 新增產品
    productModal = new bootstrap.Modal(document.getElementById('productModal'))
    // btn 刪除產品
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal')
    )
  }
}
</script>
