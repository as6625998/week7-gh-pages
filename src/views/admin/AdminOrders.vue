<template>
  <h3 class="fw-bold">後台訂單列表</h3>
  <div v-if="orders.length === 0">
    <p>目前尚未有訂單</p>
  </div>
  <table v-else class="table table-striped mt-5">
    <thead>
      <tr>
        <th>訂單時間</th>
        <th>Email</th>
        <th>購買品項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>
          {{
            `${new Date(order.create_at * 1000).getFullYear()}-${
              new Date(order.create_at * 1000).getMonth() + 1
            }-${new Date(order.create_at * 1000).getDate()} ${new Date(
              order.create_at * 1000
            ).getHours()} : ${new Date(order.create_at * 1000).getMinutes()}`
          }}
        </td>
        <td>{{ order.user.email }}</td>
        <td>
          <p v-for="item in order.products" :key="item.products">
            {{ item.product.title }} (數量 : {{ item.qty }}
            {{ item.product.unit }})
          </p>
        </td>
        <td>{{ order.total }}</td>
        <td>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              :id="`paidState${order.id}`"
              v-model="order.is_paid"
              @change="updatePaid(order)"
            />
            <label class="form-check-label" :for="`paidState${order.id}`">
              <span v-if="order.is_paid">已付款</span>
              <span v-else>未付款</span>
            </label>
          </div>
        </td>
        <td>
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="openOrderModal(order)"
            >
              檢視
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="deleteOrder(order)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <pagination :pages="page" :get-products="getOrders"></pagination>

  <!-- openModal  -->
  <div
    class="modal fade"
    id="orderModal"
    tabindex="-1"
    aria-labelledby="orderModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">訂單資訊</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <h3 class="fw-bold">用戶資料</h3>
              <table>
                <tbody>
                  <tr>
                    <th>姓名</th>
                    <td>{{ tempOrder?.user?.name }}</td>
                  </tr>

                  <tr>
                    <th>Email</th>
                    <td>{{ tempOrder?.user?.email }}</td>
                  </tr>

                  <tr>
                    <th>地址</th>
                    <td>{{ tempOrder?.user?.address }}</td>
                  </tr>

                  <tr>
                    <th>電話</th>
                    <td>{{ tempOrder?.user?.tel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col">
              <h3 class="fw-bold">訂單資訊</h3>
              <table>
                <tbody>
                  <tr>
                    <th>訂單編號</th>
                    <td>{{ tempOrder.id }}</td>
                  </tr>
                  <tr>
                    <th>訂單時間</th>
                    <td>
                      {{
                        `${new Date(
                          tempOrder.create_at * 1000
                        ).getFullYear()}-${
                          new Date(tempOrder.create_at * 1000).getMonth() + 1
                        }-${new Date(
                          tempOrder.create_at * 1000
                        ).getDate()} ${new Date(
                          tempOrder.create_at * 1000
                        ).getHours()} : ${new Date(
                          tempOrder.create_at * 1000
                        ).getMinutes()}`
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <span
                        v-if="tempOrder.is_paid"
                        class="fw-bold text-primary"
                        >已付款</span
                      >
                      <span v-else class="fw-bold text-danger">未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>
                      {{ tempOrder.total }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3 class="fw-bold">購買品項</h3>
              <table>
                <tbody>
                  <tr v-for="item in tempOrder.products" :key="item.id">
                    <th>
                      {{ item.product.title }}
                    </th>
                    <td>{{ item.qty }} / {{ item.product.unit }}</td>
                    <td class="text-end">
                      {{ item.final_total }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="d-flex justify-content-end">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="paidCheck"
                    v-model="tempOrder.is_paid"
                  />
                  <label class="form-check-label" for="paidCheck">
                    <span v-if="tempOrder.is_paid">已付款</span>
                    <span v-else>未付款</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updatePaid(tempOrder)"
          >
            修改付款狀態
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as bootstrap from 'bootstrap'
import pagination from '@/components/backstage/PaginationView.vue'
const { VITE_URL, VITE_PATH } = import.meta.env

let orderModal = null
export default {
  props: ['checkAdmin'],
  data () {
    return {
      orders: [],
      tempOrder: {},
      page: {},
      isLoading: false
    }
  },
  components: {
    pagination
  },
  methods: {
    getOrders (page = 1) {
      this.isLoading = true
      this.$http
        .get(`${VITE_URL}/v2/api/${VITE_PATH}/admin/orders?page=${page}`)
        .then((res) => {
          this.orders = res.data.orders
          this.page = res.data.pagination
          // console.log(res);
          this.isLoading = false
          console.log(res.data.orders)
        })
        .catch((err) => {
          this.isLoading = true
          alert(err.response.data.message)
        })
    },
    openOrderModal (order) {
      this.tempOrder = { ...order }
      orderModal.show()
    },
    updatePaid (order) {
      this.isLoading = true
      this.$http
        .put(`${VITE_URL}/v2/api/${VITE_PATH}/admin/order/${order.id}`, {
          data: {
            is_paid: order.is_paid
          }
        })
        .then((res) => {
          alert(res.data.message)
          this.getOrders()
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
          alert(err.response)
          // console.log(err);
        })
    },
    deleteOrder (order) {
      this.isLoading = true
      this.$http
        .delete(`${VITE_URL}/v2/api/${VITE_PATH}/admin/order/${order.id}`)
        .then((res) => {
          this.isLoading = false
          alert(res.data.message)
          location.reload()
          // console.log(res.data.message);
        })
        .catch((err) => {
          this.isLoading = true
          alert(err.response.data.message)
        })
    }
  },
  mounted () {
    this.checkAdmin()
    this.getOrders()
    orderModal = new bootstrap.Modal(document.getElementById('orderModal'))
  }
}
</script>
