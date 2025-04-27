// Mock users data for development
export const mockUsers = [
  {
    id: '1',
    name: 'Эмма',
    age: 28,
    bio: 'Обожаю походы и приключения на природе. Ищу того, с кем можно исследовать новые тропы!',
    location: 'Москва',
    distance: 5,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Походы', 'Фотография', 'Путешествия', 'Кофе'],
    occupation: 'Маркетолог',
    education: 'МГУ',
    verified: true,
    gender: 'female',
    lookingFor: 'male',
  },
  {
    id: '2',
    name: 'Лиам',
    age: 31,
    bio: 'Шеф-повар по профессии, гурман по призванию. Давай отправимся в кулинарное приключение вместе!',
    location: 'Санкт-Петербург',
    distance: 8,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Кулинария', 'Дегустация вин', 'Фермерские рынки', 'Джаз'],
    occupation: 'Шеф-повар',
    education: 'Кулинарная академия',
    verified: true,
    gender: 'male',
    lookingFor: 'female',
  },
  {
    id: '3',
    name: 'София',
    age: 26,
    bio: 'Инструктор по йоге и коуч по осознанности. Ищу того, кто ценит личностный рост и благополучие.',
    location: 'Москва',
    distance: 3,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1521310192545-4ac7b234a58c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1504276048855-f3d60e69632f?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Йога', 'Медитация', 'Веганская кухня', 'Походы'],
    occupation: 'Инструктор по йоге',
    education: 'МГУ',
    verified: true,
    gender: 'female',
    lookingFor: 'all',
  },
  {
    id: '4',
    name: 'Ной',
    age: 29,
    bio: 'Программист днем, музыкант ночью. Ищу того, с кем можно джемить и кодить вместе.',
    location: 'Казань',
    distance: 12,
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Программирование', 'Гитара', 'Инди-музыка', 'Кофе'],
    occupation: 'Программист',
    education: 'МФТИ',
    verified: true,
    gender: 'male',
    lookingFor: 'female',
  },
  {
    id: '5',
    name: 'Оливия',
    age: 27,
    bio: 'Куратор искусства со страстью к современным произведениям. Давай исследовать галереи и обсуждать искусство за бокалом вина.',
    location: 'Москва',
    distance: 4,
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1467632499275-7a693a761056?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Искусство', 'Музеи', 'Вино', 'Литература'],
    occupation: 'Куратор искусства',
    education: 'МГХПА им. Строганова',
    verified: true,
    gender: 'female',
    lookingFor: 'male',
  },
  {
    id: '6',
    name: 'Вильям',
    age: 32,
    bio: 'Архитектор с любовью к устойчивому дизайну. Ищу того, с кем можно путешествовать и исследовать красивые сооружения.',
    location: 'Санкт-Петербург',
    distance: 9,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Архитектура', 'Устойчивое развитие', 'Путешествия', 'Фотография'],
    occupation: 'Архитектор',
    education: 'СПбГАСУ',
    verified: true,
    gender: 'male',
    lookingFor: 'female',
  },
  {
    id: '7',
    name: 'Ава',
    age: 25,
    bio: 'Фрилансер-писатель и заядлый читатель. Давай обсудим наши любимые книги за чашкой кофе.',
    location: 'Москва',
    distance: 2,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1484588168347-9d835bb09939?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Писательство', 'Чтение', 'Кофейни', 'Кино'],
    occupation: 'Писатель-фрилансер',
    education: 'МГУ',
    verified: true,
    gender: 'female',
    lookingFor: 'male',
  },
  {
    id: '8',
    name: 'Джеймс',
    age: 30,
    bio: 'Финансовый аналитик, который любит готовить и пробовать новые рестораны. Ищу того, у кого схожие интересы.',
    location: 'Москва',
    distance: 6,
    photos: [
      'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Финансы', 'Кулинария', 'Рестораны', 'Бег'],
    occupation: 'Финансовый аналитик',
    education: 'ВШЭ',
    verified: true,
    gender: 'male',
    lookingFor: 'female',
  },
  {
    id: '9',
    name: 'Изабелла',
    age: 28,
    bio: 'Эколог, увлеченный сохранением природы. Ищу того, с кем можно исследовать природу.',
    location: 'Санкт-Петербург',
    distance: 10,
    photos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Экология', 'Походы', 'Кемпинг', 'Фотография'],
    occupation: 'Эколог',
    education: 'СПбГУ',
    verified: true,
    gender: 'female',
    lookingFor: 'male',
  },
  {
    id: '10',
    name: 'Бенджамин',
    age: 33,
    bio: 'Врач, специализирующийся на педиатрии. Люблю играть в баскетбол и заниматься волонтерством в свободное время.',
    location: 'Москва',
    distance: 7,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Медицина', 'Баскетбол', 'Волонтерство', 'Путешествия'],
    occupation: 'Педиатр',
    education: 'РНИМУ им. Пирогова',
    verified: true,
    gender: 'male',
    lookingFor: 'female',
  }
];

// Mock matches data for development
export const mockMatches = [
  {
    id: '1',
    userId: 'current-user',
    matchedUserId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    lastMessage: {
      text: "Хочешь выпить кофе как-нибудь?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      senderId: '1',
      read: false
    }
  },
  {
    id: '2',
    userId: 'current-user',
    matchedUserId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    lastMessage: {
      text: "Этот класс йоги звучит потрясающе!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      senderId: 'current-user',
      read: true
    }
  },
  {
    id: '3',
    userId: 'current-user',
    matchedUserId: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    lastMessage: {
      text: "Мне тоже нравится эта галерея! Нам стоит посетить новую выставку.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
      senderId: '5',
      read: true
    }
  }
];