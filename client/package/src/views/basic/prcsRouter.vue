<!-- prcsRouter.vue -->
<script setup>
// 컴포넌트
import CardHeader from '@/components/production/card-header.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import draggable from 'vuedraggable'

// 모듈
import { ref, onBeforeMount, watch} from 'vue';
import axios from 'axios';

// 선언
const prcsRouterList = ref([]); // 등록된 공정흐름도 리스트
const selectedPrcsRouter = ref(null); // 선택된 공정 흐름도
const prcsRouterDetail = ref([]); // 공정 흐름도

// 공정흐름도 리스트 불러오기
const getPrcsRouterList = async () => {
  try {
    const { data } = await axios.get('/api/prod/prcsrouterlist');
    prcsRouterList.value = data ?? [];
  } catch (e) {
    console.error(e);
    prcsRouterList.value = [];
  }
};

onBeforeMount(getPrcsRouterList);

// 품목 선택시 공정흐름도 불러오기
watch(selectedPrcsRouter, async () => {
  // console.log(selectedPrcsRouter.value.itemId);
  let { itemId } = selectedPrcsRouter.value;
  try {
    const result = await axios.get('/api/prod/prcsrouter', {
      params: {
        itemId: itemId
      }
    });
    const { data } = result;
    prcsRouterDetail.value = data ?? [];
    // prcsRouterDetail.value = result;
  } catch (e) {
    console.error(e);
    prcsRouterDetail.value = [];
  }
});

</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-card elevation="10">
          <v-card-item class="py-6 px-6">
            <v-container fluid>
              <CardHeader title="공정 흐름도 조회" />
                <DataTable 
                  :value="prcsRouterList"
                  v-model:selection="selectedPrcsRouter"
                  selectionMode="single"
                  paginator 
                  :rows="10" 
                  dataKey="itemId"
                >
                  <Column field="itemId" header="품목 번호" sortable />
                  <Column field="itemName" header="품목명" sortable />
                </DataTable>
            </v-container>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card elevation="10">
          <v-card-item class="py-6 px-6">
            <v-container fluid>
              <CardHeader title="선택된 공정 흐름도" />

              <draggable
                v-model="prcsRouterDetail"
                item-key="opNo"
                :animation="200"
                handle=".handle"
                ghost-class="ghost"
                chosen-class="chosen"
              >
                <template #item="{ element, index }">
                  <div class="row">
                    <span class="handle">⠿</span>
                    <strong>{{ element.prcsNumber }}</strong>
                    <span>{{ index + 1 }}번째</span>
                  </div>
                </template>
              </draggable>

                <v-btn append-icon="mdi-plus-circle" variant="outlined" color="primary" @click="" block>
                  공정 추가
                </v-btn>

            </v-container>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  {{ prcsRouterDetail }}
</template>

<style scoped>
.row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  margin-bottom: 6px;
  border: 1px solid #eee;
  border-radius: 8px
}

.handle {
  cursor: grab
}

.ghost {
  opacity: 0.5
}

.chosen {
  opacity: 0.9
}
</style>