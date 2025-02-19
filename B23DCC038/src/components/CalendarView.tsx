// src/components/CalendarView.tsx

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Subject } from '../models/subject';
import moment from 'moment';

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
}

const CalendarView: React.FC<CalendarViewProps> = ({ subjects }) => {
  // Tạo danh sách sự kiện với màu sắc cố định và tên môn học
  const events = subjects.flatMap(subject => {
    if (Array.isArray(subject.studyTime)) {
      return subject.studyTime.map((time: string) => ({
        title: subject.name, // Tên môn học hiển thị trên lịch
        date: moment(time).format('YYYY-MM-DD'),
        backgroundColor: getSubjectColor(subject.name), // Gán màu cố định cho môn học
        borderColor: getSubjectColor(subject.name), // Gán màu viền
      }));
    } else {
      return []; // Nếu studyTime không phải mảng, trả về mảng rỗng
    }
  });

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth" // Mặc định là lịch tháng
        headerToolbar={{
          left: 'prev,next today', // Các nút di chuyển
          center: 'title', // Tiêu đề của lịch (Tháng, Tuần, Ngày)
          right: 'dayGridMonth,timeGridWeek,timeGridDay', // Các chế độ hiển thị: Tháng, Tuần, Ngày
        }}
        events={events}
        eventColor="#378006" // Màu sự kiện mặc định nếu không có màu
        eventTextColor="#ffffff" // Màu chữ của sự kiện
        initialDate={new Date()} // Hiển thị ngày hiện tại khi lần đầu mở lịch
      />
    </div>
  );
};

export default CalendarView;
