// src/components/CalendarView.tsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Subject } from '../models/subject';
import moment from 'moment';
import { Modal, Button, DatePicker, InputNumber, message, Form } from 'antd';

// Định nghĩa màu cố định cho mỗi môn học (hoặc ánh xạ theo tên môn học)
const getSubjectColor = (subjectName: string) => {
  const colors: { [key: string]: string } = {
    'Toán': '#ff5733',
    'Văn': '#33ff57',
    'Anh': '#3357ff',
    'Khoa học': '#ff33a1',
    'Công nghệ': '#a1ff33',
  };

  return colors[subjectName] || '#cccccc';
};

interface CalendarViewProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>; // Chắc chắn rằng setSubjects là một hàm
}

const CalendarView: React.FC<CalendarViewProps> = ({ subjects, setSubjects }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); 
  const [newTime, setNewTime] = useState<moment.Moment | null>(null);
  const [newDuration, setNewDuration] = useState<number>(0);

  // Cập nhật sự kiện lịch học
  const events = subjects.flatMap(subject => {
    if (Array.isArray(subject.studyTime)) {
      return subject.studyTime.map((time: string, index: number) => ({
        id: `${subject.id}-${index}`,
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

  const handleEventClick = (info: any) => {
    const event = info.event;
    const eventData = event.extendedProps;

    setSelectedEvent(eventData);
    setNewTime(moment(event.start));
    setNewDuration(eventData.duration);
    setIsModalVisible(true);
  };

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

    setSubjects(updatedSubjects); // Cập nhật lại subjects
    setIsModalVisible(false);
    message.success('Lịch học đã được cập nhật');
  };

  const handleDeleteEvent = () => {
    const updatedSubjects = [...subjects];
    const subjectToUpdate = updatedSubjects.find(subject => subject.id === selectedEvent.subjectId);

    if (subjectToUpdate) {
      subjectToUpdate.studyTime = subjectToUpdate.studyTime.filter((_, index) => index !== selectedEvent.id);
    }

    setSubjects(updatedSubjects); // Cập nhật lại subjects
    setIsModalVisible(false);
    message.success('Lịch học đã được xóa');
  };

  return (
    <div>
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
              onChange={(value) => setNewDuration(value || 0)}
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
    </div>
  );
};

export default CalendarView;
