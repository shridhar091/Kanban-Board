<script setup>
import { ref, computed } from "vue";
import { deleteTask } from "../services/api";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["onDeleted"]);

const showDropdown = ref(false);

const handleDelete = async () => {
  try {
    await deleteTask(props.task._id);
    emit("onDeleted", props.task._id);
  } catch (err) {
    console.error("Delete failed", err);
  }
};

const dateLabel = computed(() => {
  if (!props.task.dueDate) {
    return { text: "", color: "#555" };
  }

  const dueDate = new Date(props.task.dueDate);
  if (isNaN(dueDate)) {
    return { text: props.task.dueDate, color: "#555" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueTime = new Date(dueDate).setHours(0, 0, 0, 0);
  const diffTime = dueTime - today.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (diffTime === 0) {
    return { text: "Today", color: "black" };
  } else if (diffTime === -oneDay) {
    return { text: "Yesterday", color: "red" };
  } else if (diffTime === oneDay) {
    return { text: "Tomorrow", color: "blue" };
  } else {
    return { text: dueDate.toLocaleDateString(), color: "#555" };
  }
});

const onDragStart = (event) => {
  event.dataTransfer.setData("taskId", props.task._id);
  event.dataTransfer.setData(
    "fromSectionId",
    String(props.task.sectionId ?? "")
  );
  event.dataTransfer.effectAllowed = "move";
};
</script>

<template>
  <div class="task-card" draggable="true" @dragstart="onDragStart">
    <div class="card-header">
      <h4 class="title">{{ task.title }}</h4>
      <div class="menu">
        <button class="dots" @click="showDropdown = !showDropdown">⋮</button>
        <div v-if="showDropdown" class="dropdown">
          <button @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
    <div class="card-header">
      <small :style="{ color: dateLabel.color }"
        ><b>{{ dateLabel.text }}</b></small
      >
      <p class="description">{{ task.description }}</p>
    </div>
    <small> {{ task.assignee }}</small>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  position: relative;
}

.dots {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.description {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #5e5c5c;
  border: 1px solid #ccc;
}

.dropdown {
  position: absolute;
  top: 20px;
  right: 0;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.dropdown button {
  background: none;
  border: none;
  padding: 5px 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
</style>
