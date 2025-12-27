import { Deck } from './types';
import React from 'react';

// Icons as SVG components
export const Icons = {
  BookOpen: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" })
  ),
  Cards: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" })
  ),
  Puzzle: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 4.857 4.857 0 00-4.142 2.943 4.936 4.936 0 00-.364 1.625c0 .805.27 1.536.728 2.122a.64.64 0 01.063.411 9.516 9.516 0 00-.28 2.165c0 1.055.27 2.036.75 2.887a.64.64 0 01-.08.649A4.908 4.908 0 004 21h16a4.908 4.908 0 00-2.613-4.329.64.64 0 01-.08-.649c.48-.851.75-1.832.75-2.887 0-.756-.099-1.488-.28-2.165a.64.64 0 01.063-.411c.458-.586.728-1.317.728-2.122 0-.546-.13-1.06-.364-1.625a4.857 4.857 0 00-4.142-2.943.64.64 0 01-.657-.643v0z" })
  ),
  Plus: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" })
  ),
  Speaker: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" })
  ),
  Sparkles: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" })
  )
};

export const SYSTEM_DECK: Deck = {
  id: 'sys_ielts_01',
  name: 'IELTS Core (System)',
  isSystem: true,
  words: [
    {
      id: 'w_1',
      word: 'ephemeral',
      ipa: '/əˈfem.ər.əl/',
      pos: 'adjective',
      definition: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: 'Fashions are ephemeral, changing with every season.'
    },
    {
      id: 'w_2',
      word: 'serendipity',
      ipa: '/ˌser.ənˈdɪp.ə.ti/',
      pos: 'noun',
      definition: 'Sự tình cờ may mắn, khả năng cầu được ước thấy.',
      example: 'It was pure serendipity that we met at the coffee shop right before the rain started.'
    },
    {
      id: 'w_3',
      word: 'ubiquitous',
      ipa: '/juːˈbɪk.wɪ.təs/',
      pos: 'adjective',
      definition: 'Phổ biến, xuất hiện ở khắp mọi nơi.',
      example: 'Smartphones have become ubiquitous in modern society.'
    },
    {
      id: 'w_4',
      word: 'resilient',
      ipa: '/rɪˈzɪl.jənt/',
      pos: 'adjective',
      definition: 'Kiên cường, có khả năng phục hồi nhanh chóng.',
      example: 'The local economy is remarkably resilient despite the global downturn.'
    },
    {
      id: 'w_5',
      word: 'mitigate',
      ipa: '/ˈmɪt.ɪ.ɡeɪt/',
      pos: 'verb',
      definition: 'Làm nhẹ bớt, làm dịu, giảm thiểu (hậu quả).',
      example: 'Planting trees can help mitigate the effects of climate change.'
    }
  ]
};