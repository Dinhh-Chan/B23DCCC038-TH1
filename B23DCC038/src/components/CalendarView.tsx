// src/components/CalendarView.tsx

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Subject } from '../models/subject';
import moment from 'moment';

// Hàm tạo màu ngẫu nhiên
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface CalendarViewProps {
  subjects: Subject[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ subjects }) => {
  // Tạo danh sách sự kiện với màu sắc và tên môn học
  const events = subjects.flatMap(subject => {
    if (Array.isArray(subject.studyTime)) {
      return subject.studyTime.map((time: string) => ({
        title: subject.name, // Tên môn học hiển thị trên lịch
        date: moment(time).format('YYYY-MM-DD'),
        backgroundColor: getRandomColor(), // Tạo màu ngẫu nhiên cho mỗi môn học
        borderColor: getRandomColor(), // Tạo màu viền ngẫu nhiên cho sự kiện
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
