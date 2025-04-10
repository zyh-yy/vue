import { createApp, ref, onMounted } from "./vue.esm-browser.js";

createApp({
    setup() {
        const activeTab = ref('scenes');
        const scenes = ref([]);
        const tasks = ref([]);
        const fields = ref([]);
        const newScene = ref({ scene_id: '', scene_name: '', description: '', detail: '', responsible: '' });
        const newTask = ref({ task_id: '', task_name: '', description: '', responsible: '' });
        const newField = ref({ field_name: '', description: '', responsible: '', field_type: '' }); // 添加 field_type
        const modalMessage = ref('');
        const modal = ref(null);
        const username = ref('');

        const getScenes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/get_scenes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取场景信息失败');
                }

                const data = await response.json();
                scenes.value = data;

            } catch (err) {
                console.error('获取场景信息失败:', err);
            }
        };

        const getTasks = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/get_tasks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取任务信息失败');
                }

                const data = await response.json();
                tasks.value = data;

            } catch (err) {
                console.error('获取任务信息失败:', err);
            }
        };

        const getFields = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/get_fields', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取字段信息失败');
                }

                const data = await response.json();
                fields.value = data;

            } catch (err) {
                console.error('获取字段信息失败:', err);
            }
        };

        const addScene = async () => {
            try {
                // 确保 scene_id 是数字
                const sceneData = {
                    scene_id: Number(newScene.value.scene_id),
                    scene_name: newScene.value.scene_name,
                    description: newScene.value.description,
                    detail: newScene.value.detail,
                    responsible: newScene.value.responsible
                };

                const response = await fetch('http://127.0.0.1:8080/api/set_scene', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sceneData)
                });

                if (!response.ok) {
                    throw new Error('增加场景失败');
                }

                const data = await response.json();
                getScenes();
                newScene.value = { scene_id: '', scene_name: '', description: '', detail: '', responsible: '' };
                showModal('增加场景成功:', data);
            } catch (err) {
                showModal('增加场景失败:', err.message);
            }
        };

        const addTask = async () => {
            try {
                const taskData = {
                    task_name: newTask.value.task_name,
                    description: newTask.value.description,
                    responsible: newTask.value.responsible
                };

                const response = await fetch('http://127.0.0.1:8080/api/set_task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });

                if (!response.ok) {
                    throw new Error('增加任务失败');
                }

                const data = await response.json();
                getTasks();
                newTask.value = { task_name: '', description: '', responsible: '' };
                showModal('增加任务成功:', data);
            } catch (err) {
                showModal('增加任务失败:', err.message);
            }
        };

        const addField = async () => {
            try {
                const fieldData = {
                    field_name: newField.value.field_name,
                    description: newField.value.description,
                    responsible: newField.value.responsible,
                    field_type: newField.value.field_type // 添加 field_type
                };

                const response = await fetch('http://127.0.0.1:8080/api/set_field', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fieldData)
                });

                if (!response.ok) {
                    throw new Error('增加字段失败');
                }

                const data = await response.json();
                getFields();
                newField.value = { field_name: '', description: '', responsible: '', field_type: '' }; // 重置 field_type
                showModal('增加字段成功:', data);
            } catch (err) {
                showModal('增加字段失败:', err.message);
            }
        };

        const viewSceneDetails = async (sceneId) => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/get_scene_details/${sceneId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取场景详情失败');
                }

                const data = await response.json();
                // 将数据存储在 localStorage 中
                localStorage.setItem('sceneDetails', JSON.stringify(data));
                localStorage.setItem('username', username.value);
                // 导航到下一个 HTML 文件
                window.location.href = 'scene_details.html';
            } catch (err) {
                console.error('获取场景详情失败:', err);
            }
        };

        const showModal = (message, data) => {
            modalMessage.value = `${message} ${JSON.stringify(data)}`;
            modal.value.style.display = 'block';
        };

        const closeModal = () => {
            modal.value.style.display = 'none';
        };

        onMounted(() => {
            getScenes();
            getTasks();
            getFields(); // 获取字段列表
            modal.value = document.getElementById('myModal');

            // 从 localStorage 中读取用户名
            username.value = localStorage.getItem('username') || '未登录';
        });

        return {
            activeTab,
            scenes,
            tasks,
            fields,
            newScene,
            newTask,
            newField,
            addScene,
            addTask,
            addField,
            viewSceneDetails,
            modalMessage,
            showModal,
            closeModal,
            username
        };
    }
}).mount("#app");