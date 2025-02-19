﻿export default [
	{
	  path: '/user',
	  layout: false,
	  routes: [
		{
		  path: '/user/login',
		  layout: false,
		  name: 'login',
		  component: './user/Login',
		},
		{
		  path: '/user',
		  redirect: '/user/login',
		},
	  ],
	},
  
	///////////////////////////////////
	// DEFAULT MENU
	{
	  path: '/dashboard',
	  name: 'Dashboard',
	  component: './TrangChu',
	  icon: 'HomeOutlined',
	},
	{
	  path: '/gioi-thieu',
	  name: 'About',
	  component: './TienIch/GioiThieu',
	  hideInMenu: true,
	},
	{
	  path: '/random-user',
	  name: 'RandomUser',
	  component: './RandomUser',
	  icon: 'ArrowsAltOutlined',
	},
	{
	  path: '/todo-list',
	  name: 'TodoList',
	  component: './todolist/index',
	  icon: 'UnorderedListOutlined',
	},
	{
	  path: '/minigame',
	  name: 'Minigame',
	  component: './SoRandom/index',
	  icon: 'CalculatorOutlined',
	},
	{
	  path: '/quan-ly',
	  name: 'Quản lý',
	  icon: 'InboxOutlined',
	  routes: [
		{
		path: '/quan-ly/danh-muc',
		name: 'Quản lý môn học',
		component: './Categories/index',
		},
		{
		path: '/quan-ly/muc-tieu',
		name: 'Mục tiêu học tập',
		component: './Target/target',
		},
		{
		path: '/quan-ly/lich-hoc',
		name: 'Lịch học',
		component: './Categories/lich',
		},
	  ],
	  },
	{
	  path: '/notification',
	  routes: [
		{
		  path: './subscribe',
		  exact: true,
		  component: './ThongBao/Subscribe',
		},
		{
		  path: './check',
		  exact: true,
		  component: './ThongBao/Check',
		},
		{
		  path: './',
		  exact: true,
		  component: './ThongBao/NotifOneSignal',
		},
	  ],
	  layout: false,
	  hideInMenu: true,
	},
	{
	  path: '/',
	},
	{
	  path: '/403',
	  component: './exception/403/403Page',
	  layout: false,
	},
	{
	  path: '/hold-on',
	  component: './exception/DangCapNhat',
	  layout: false,
	},
	{
	  component: './exception/404',
	},
  ];