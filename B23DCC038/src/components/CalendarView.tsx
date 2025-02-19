import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Subject } from '../models/subject';
import moment from 'moment';
import { Modal, Button, DatePicker, InputNumber, message, Form, Select } from 'antd';

// Định nghĩa màu cố định cho mỗi môn học (hoặc ánh xạ theo tên môn học)
const getSubjectColor = (subjectName: string) => {
  const colors: { [key: string]: string } = {
    'Toán': '#ff5733',
    'Văn': '#33ff57',
    'Anh': '#3357ff',
    'Khoa học': '#ff33a1',
    'Công nghệ': '#a1ff33',
  };

  return colors[subjectName] || '#cccccc'; // Màu mặc định nếu không có trong bảng
};

interface CalendarViewProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>; // Thêm để có thể cập nhật subjects từ component cha
}

const CalendarView: React.FC<CalendarViewProps> = ({ subjects, setSubjects }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal chỉnh sửa lịch học
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Modal thêm lịch học
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Để lưu sự kiện cần sửa
  const [newTime, setNewTime] = useState<moment.Moment | null>(null);
  const [newDuration, setNewDuration] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string>(""); // Môn học cho lịch học mới

  // Tạo danh sách sự kiện với màu sắc cố định và tên môn học
  const events = subjects.flatMap(subject => {
    if (Array.isArray(subject.studyTime)) {
      return subject.studyTime.map((time: string, index: number) => ({
        id: index.toString(),
        title: subject.name,
        date: moment(time).format('YYYY-MM-DD HH:mm:ss'),
        backgroundColor: getSubjectColor(subject.name),
        borderColor: getSubjectColor(subject.name),
        subjectId: subject.id,
        duration: subject.duration,
      }));
    } else {
      return [];
    }
  });

  // Mở modal để sửa sự kiện
  const handleEventClick = (info: any) => {
    const event = info.event;
    const eventData = event.extendedProps;

    setSelectedEvent(eventData);
    setNewTime(moment(event.start));
    setNewDuration(eventData.duration);
    setIsModalVisible(true);
  };

  // Cập nhật lịch học sau khi sửa
  const handleSaveEdit = () => {
    if (!newTime || !newDuration || !selectedEvent) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const updatedSubjects = [...subjects];
    const subjectToUpdate = updatedSubjects.find(subject => subject.id === selectedEvent.subjectId);

    if (subjectToUpdate) {
      subjectToUpdate.studyTime[selectedEvent.id] = newTime.format('YYYY-MM-DD HH:mm:ss');
      subjectToUpdate.duration = newDuration;
    }

    setSubjects(updatedSubjects);
    setIsModalVisible(false);
    message.success('Lịch học đã được cập nhật');
  };

  // Xóa lịch học
  const handleDeleteEvent = () => {
    const updatedSubjects = [...subjects];
    const subjectToUpdate = updatedSubjects.find(subject => subject.id === selectedEvent.subjectId);

    if (subjectToUpdate) {
      subjectToUpdate.studyTime = subjectToUpdate.studyTime.filter((_, index) => index !== selectedEvent.id);
    }

    setSubjects(updatedSubjects);
    setIsModalVisible(false);
    message.success('Lịch học đã được xóa');
    window.location.reload();
  };

  // Thêm lịch học mới
  const handleAddEvent = () => {
    if (!newTime || !newDuration || !selectedSubject) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Tạo sự kiện mới
    const newEvent = {
      id: new Date().toString(),
      title: selectedSubject,
      date: newTime.format('YYYY-MM-DD HH:mm:ss'),
      backgroundColor: getSubjectColor(selectedSubject),
      borderColor: getSubjectColor(selectedSubject),
      subjectId: selectedSubject,
      duration: newDuration,
    };

    const updatedSubjects = [...subjects];
    const subjectToUpdate = updatedSubjects.find(subject => subject.name === selectedSubject);

    if (subjectToUpdate) {
      subjectToUpdate.studyTime.push(newTime.format('YYYY-MM-DD HH:mm:ss'));
    } else {
      updatedSubjects.push({
        id: selectedSubject,
        name: selectedSubject,
        studyTime: [newTime.format('YYYY-MM-DD HH:mm:ss')],
        duration: newDuration,
        contentLearned: '',
        notes: '',
      });
    }

    setSubjects(updatedSubjects);
    setIsAddModalVisible(false);
    message.success('Lịch học mới đã được thêm');
  };

  return (
    <div>
      <Button 
        type="primary" 
        onClick={() => setIsAddModalVisible(true)} 
        style={{ marginBottom: '20px' }}
      >
        Thêm lịch học
      </Button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventColor="#378006"
        eventTextColor="#ffffff"
        initialDate={new Date()}
        height={600}
        aspectRatio={1.5}
        contentHeight="auto"
        eventClick={handleEventClick}
      />

      {/* Button thêm lịch học */}
      

      {/* Modal sửa lịch học */}
      <Modal
        title="Sửa lịch học"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveEdit}
      >
        <Form layout="vertical">
          <Form.Item label="Thời gian học">
            <DatePicker
              showTime
              value={newTime}
              onChange={setNewTime}
              style={{ width: '100%' }}
              placeholder="Chọn thời gian học"
            />
          </Form.Item>

          <Form.Item label="Thời lượng học (phút)">
            <InputNumber
              value={newDuration}
              onChange={(value: number | null) => setNewDuration(value ?? 0)} // Xử lý nếu giá trị là null
              min={0}
              style={{ width: '100%' }}
              placeholder="Nhập thời lượng học"
            />
          </Form.Item>
        </Form>

        <Button danger onClick={handleDeleteEvent} style={{ marginTop: 10 }}>
          Xóa lịch học
        </Button>
      </Modal>

      {/* Modal thêm lịch học */}
      <Modal
        title="Thêm lịch học"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddEvent}
      >
        <Form layout="vertical">
          <Form.Item label="Chọn môn học">
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: '100%' }}
              placeholder="Chọn môn học"
            >
              {subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.name}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Thời gian học">
            <DatePicker
              showTime
              value={newTime}
              onChange={setNewTime}
              style={{ width: '100%' }}
              placeholder="Chọn thời gian học"
            />
          </Form.Item>

          <Form.Item label="Thời lượng học (phút)">
            <InputNumber
              value={newDuration}
              onChange={(value: number | null) => setNewDuration(value ?? 0)} // Xử lý nếu giá trị là null
              min={0}
              style={{ width: '100%' }}
              placeholder="Nhập thời lượng học"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarView;
