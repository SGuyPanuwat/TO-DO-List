import React, { useState, useRef } from 'react'; // นำเข้า React, useState hook, และ useRef hook จากไลบรารี React
import './App.css'; // นำเข้าไฟล์ CSS เพื่อใช้ในการจัดรูปแบบหน้าจอ
import { 
  Button, Input, Form, Modal, DatePicker, Checkbox, Dropdown, Menu, ConfigProvider, Typography, FloatButton, Tooltip, Tour 
} from 'antd'; // นำเข้าคอมโพนเนนต์ต่าง ๆ จาก Ant Design library
import 'antd/dist/reset.css'; // นำเข้าไฟล์ CSS สำหรับ reset จาก Ant Design
import Card from 'antd/es/card/Card'; // นำเข้าคอมโพเนนต์ Card จาก Ant Design
import moment from 'moment'; // นำเข้า moment.js เพื่อใช้ในการจัดการข้อมูลวันที่
import { DeleteOutlined, EditOutlined, DownOutlined } from '@ant-design/icons'; // นำเข้าไอคอนต่าง ๆ จาก Ant Design

const { TextArea } = Input; // แยกออกจาก Input สำหรับใช้งาน TextArea
const { Text } = Typography; // แยกออกจาก Typography สำหรับใช้งาน Text

const text = <span>manual</span>; // กำหนด JSX element สำหรับ Tooltip


function App() { // นิยามคอมโพเนนต์หลัก App ในรูปแบบฟังก์ชัน
  // ตัวแปร state โดยใช้ useState hook
  const [todos, setTodos] = useState([]); // สถานะสำหรับเก็บรายการ todo
  const [showForm, setShowForm] = useState(false); // สถานะสำหรับควบคุมการแสดงฟอร์มเพิ่ม todo
  const [editingTodo, setEditingTodo] = useState(null); // สถานะสำหรับติดตามดัชนีของ todo ที่กำลังแก้ไข
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // สถานะสำหรับควบคุมการแสดง Modal ยืนยันการลบ
  const [todoToDelete, setTodoToDelete] = useState(null); // สถานะสำหรับติดตามดัชนีของ todo ที่จะลบ
  const [selectedDate, setSelectedDate] = useState(null); // สถานะสำหรับเก็บวันที่ที่เลือกในฟอร์ม todo
  const [sortOrder, setSortOrder] = useState('asc'); // สถานะสำหรับการเรียงลำดับของ todos

  // ฟังก์ชันสำหรับการเพิ่ม todo ใหม่
  const handleAddTodo = () => {
    setShowForm(true); // แสดงฟอร์มเพิ่ม todo
  };

  // ฟังก์ชันสำหรับการส่งฟอร์ม (เพิ่ม/แก้ไข todo)
  const handleFinish = (values) => {
    const { title, description, date } = values; // ดึงค่า title, description, date จาก values
    const formattedDate = date ? date.format('YYYY-MM-DD') : null; // กำหนดรูปแบบวันที่
    if (editingTodo !== null) { // ถ้ากำลังแก้ไข todo
      const updatedTodos = [...todos]; // คัดลอก todos ปัจจุบันไปยัง updatedTodos
      updatedTodos[editingTodo] = { ...updatedTodos[editingTodo], title, description, date: formattedDate }; // ปรับปรุง todo ที่กำลังแก้ไข
      setTodos(updatedTodos); // อัปเดต todos
    } else { // ถ้าเพิ่ม todo ใหม่
      setTodos([...todos, { title, description, date: formattedDate, checked: false }]); // เพิ่ม todo ใหม่เข้าไปในรายการ todos
    }
    setEditingTodo(null); // ล้างการติดตาม todo ที่กำลังแก้ไข
    setShowForm(false); // ซ่อนฟอร์ม
    setSelectedDate(null); // ล้างวันที่ที่เลือก
  };

  // ฟังก์ชันสำหรับการลบ todo
  const handleDeleteTodo = (index) => {
    setTodoToDelete(index); // ติดตามดัชนีของ todo ที่จะลบ
    setDeleteModalVisible(true); // แสดง Modal ยืนยันการลบ
  };

  // ฟังก์ชันสำหรับการแก้ไข todo
  const handleEditTodo = (index) => {
    setEditingTodo(index); // ตั้งค่าดัชนีของ todo ที่กำลังแก้ไข
    setShowForm(true); // แสดงฟอร์ม
    setSelectedDate(moment(todos[index].date)); // ตั้งค่าวันที่ที่เลือก
  };

  // ฟังก์ชันสำหรับยกเลิกการแก้ไข todo
  const handleCancelEdit = () => {
    setEditingTodo(null); // ล้างการติดตาม todo ที่กำลังแก้ไข
    setShowForm(false); // ซ่อนฟอร์ม
    setSelectedDate(null); // ล้างวันที่ที่เลือก
  };

  // ฟังก์ชันสำหรับการยืนยันการลบ
  const confirmDelete = () => {
    const newTodos = todos.filter((_, index) => index !== todoToDelete); // กรอง todos เพื่อลบ todo ที่มีดัชนีที่ต้องการลบ
    setTodos(newTodos); // อัปเดต todos
    setDeleteModalVisible(false); // ซ่อน Modal ยืนยันการลบ
  };

  // ฟังก์ชันสำหรับการตรวจสอบวันที่ที่ไม่สามารถเลือกได้
  const disabledDate = (current) => {
    return current && current < moment().startOf('day'); // ตรวจสอบว่าวันปัจจุบันมีวันที่เริ่มต้นของวันหรือไม่
  };

  // ฟังก์ชันสำหรับการเปลี่ยนการเรียงลำดับ
  const handleSortChange = ({ key }) => {
    setSortOrder(key); // ตั้งค่าการเรียงลำดับ
  };

  // แปลงลำดับของ todos ตามวันที่
  const sortedTodos = todos.sort((a, b) => {
    if (sortOrder === 'asc') { 
      return new Date(a.date) - new Date(b.date); 
    } else { 
      return new Date(b.date) - new Date(a.date); 
    }
  });

  // เมนูสำหรับเปลี่ยนการเรียงลำดับ
  const menu = (
    <Menu onClick={handleSortChange}>
      <Menu.Item key="asc">Sort by Date: Ascending</Menu.Item>
      <Menu.Item key="desc">Sort by Date: Descending</Menu.Item>
    </Menu>
  );
  const handleCheckboxChange = (e, index) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, checked: e.target.checked } : todo));
    setTodos(newTodos);
  };
  // การใช้งาน useRef 
  const ref1 = useRef(null); // ประกาศ useRef สำหรับเป้าหมาย
  const ref2 = useRef(null); 
  const ref3 = useRef(null); 
  const ref4 = useRef(null);
  // สถานะและฟังก์ชัน
  const [open, setOpen] = useState(false); // สถานะสำหรับการเปิด/ปิด
  const steps = [
    {
      title: 'Add task',
      description: 'add tesk is a button for creating tasks You must specify the title, decription, and end date of the work.',
      target: ref1.current,
    },
    {
      title: 'Sort by Date',
      description: 'Sort by Date is a button for sorting tasks. From the most to the least date From the least to the greatest date.',
      placement: 'right',
      target: () => ref2.current,
    },
    {
      title: 'Task',
      description: 'A task is an additional job. Tasks can be edited or deleted.',
      cover: (
        <img
          alt="Tour.PNG"
          src="src/img/Tour.PNG"
        />
      ),
      placement: 'top',
      target: () => ref3.current,
    },
    {
      title: 'Number of Tasks!',
      description: 'Tells the current number of jobs remaining.',
      placement: 'left',
      target: () => ref4.current,
    },
  ];
    // ถ้ากด  Add Task ให้่แสดงฟอร์มนี้ ขึ้นมา
  if (showForm) {
    const initialValues = editingTodo !== null ? { ...todos[editingTodo], date: selectedDate } : {};
    return (
      <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ maxWidth: "600px", border: "2px solid gray" }}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: 'black',
              },
              components: {
              },
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
              <h1 style={{ textAlign: "center" }}>{editingTodo !== null ? 'Edit Todo' : 'Add Task'}</h1>
              <Button style={{ marginLeft: "200px" }} onClick={handleCancelEdit}>Backward</Button>
            </div>
            <Form onFinish={handleFinish} layout="vertical" initialValues={initialValues}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter the title' }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter the description' }]}
              >
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
              <Form.Item
                name="date"
                label="Select Date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
              </Form.Item>
              <Form.Item style={{ marginTop: '20px' }}>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  {editingTodo !== null ? 'Update' : 'Submit'}
                </Button>
              </Form.Item>
            </Form>
          </ConfigProvider>
        </Card>

      </div>
    );
  }

  return (

  // ถ้าไม่ได้กด  Add Task ให้แสดงฟอร์มนี้
    <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card style={{ maxWidth: "600px", border: "2px solid gray" }}>
        <h1>To-Do List</h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div >
            <h4>My Tasks</h4>
            <h4 ref={ref4}>
              You have {todos.filter(todo => !todo.checked).length} tasks left!
            </h4>

          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: 'black',
                },
                components: {
                },
              }}
            >
              <Dropdown overlay={menu}>
                <Button style={{ border: "none", marginLeft: "60px", fontSize: "12px" }} ref={ref2}>
                  Sort by Date <DownOutlined />
                </Button>
              </Dropdown>
              <Button type="primary" onClick={handleAddTodo} style={{ marginLeft: 10 }} ref={ref1}>
                Add Task
              </Button>
            </ConfigProvider>
          </div>
        </div>
        <ul style={{ maxHeight: '500px', overflowY: 'auto', padding: 0, listStyle: 'none' }}>
          {sortedTodos.map((todo, index) => (
            <li key={index} style={{ justifyContent: "center", marginBottom: '10px' }}>
              <Card ref={ref3}
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: 'black',
                        },
                        components: {
                        },
                      }}
                    >
                      <Checkbox
                        checked={todo.checked}
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </ConfigProvider>
                    <span style={{ textDecoration: todo.checked ? 'line-through' : 'none', marginLeft: 8, color: todo.checked ? 'white' : 'black' }}>
                      {todo.title}
                    </span>
                  </div>
                }
                style={{ width: '100%', border: todo.checked ? '2px solid #8BC34A' : '2px solid gray', backgroundColor: todo.checked ? '#8BC34A' : 'white' }} hoverable
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="todo-item">
                    <p style={{ wordBreak: 'break-word', marginLeft: 8, color: todo.checked ? 'white' : 'black' }}>{todo.description}</p>
                    <p style={{ wordBreak: 'break-word', marginLeft: 8, color: todo.checked ? 'white' : 'red' }}>Due : {moment(todo.date).format('Do / MMMM / YYYY')}</p>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Button type="link" onClick={() => handleEditTodo(index)} style={{ color: todo.checked ? 'white' : 'green', fontSize: "20px" }} disabled={todo.checked}>
                      <EditOutlined />
                    </Button>
                    <Button type="link" onClick={() => handleDeleteTodo(index)} style={{ color: todo.checked ? 'red' : 'red', fontSize: "20px" }} >
                      <DeleteOutlined />
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Card>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'black',
          },
          components: {
          },
        }}
      >
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        <Tooltip placement="top" title={text}>
          <FloatButton onClick={() => setOpen(true)} />
        </Tooltip>
      </ConfigProvider>

      <Modal
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null} // Disable default footer buttons
      >
        <Card style={{ border: "none", textAlign: "center" }}>
          <Text strong><h3>Are you sure?</h3></Text>
          <p>Do you want delete item.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>

            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: 'green',
                },
                components: {
                },
              }}
            >
              <Button onClick={() => setDeleteModalVisible(false)} >
                No
              </Button>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: 'red',
                },
                components: {
                },
              }}
            >
              <Button onClick={confirmDelete} >
                Yes
              </Button>
            </ConfigProvider>
          </div>
        </Card>
      </Modal>

    </div >
  );
}

export default App;
















