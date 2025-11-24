import type { MockMethod } from 'vite-plugin-mock'
import { resultSuccess } from '../_utils'

const chartData = {
  visitData: [
    {
      x: '2025-11-22',
      y: 7
    },
    {
      x: '2025-11-23',
      y: 5
    },
    {
      x: '2025-11-24',
      y: 4
    },
    {
      x: '2025-11-25',
      y: 2
    },
    {
      x: '2025-11-26',
      y: 4
    },
    {
      x: '2025-11-27',
      y: 7
    },
    {
      x: '2025-11-28',
      y: 5
    },
    {
      x: '2025-11-29',
      y: 6
    },
    {
      x: '2025-11-30',
      y: 5
    },
    {
      x: '2025-12-01',
      y: 9
    },
    {
      x: '2025-12-02',
      y: 6
    },
    {
      x: '2025-12-03',
      y: 3
    },
    {
      x: '2025-12-04',
      y: 1
    },
    {
      x: '2025-12-05',
      y: 5
    },
    {
      x: '2025-12-06',
      y: 3
    },
    {
      x: '2025-12-07',
      y: 6
    },
    {
      x: '2025-12-08',
      y: 5
    }
  ],
  visitData2: [
    {
      x: '2025-11-22',
      y: 1
    },
    {
      x: '2025-11-23',
      y: 6
    },
    {
      x: '2025-11-24',
      y: 4
    },
    {
      x: '2025-11-25',
      y: 8
    },
    {
      x: '2025-11-26',
      y: 3
    },
    {
      x: '2025-11-27',
      y: 7
    },
    {
      x: '2025-11-28',
      y: 2
    }
  ],
  salesData: [
    {
      x: '1月',
      y: 1038
    },
    {
      x: '2月',
      y: 800
    },
    {
      x: '3月',
      y: 419
    },
    {
      x: '4月',
      y: 673
    },
    {
      x: '5月',
      y: 877
    },
    {
      x: '6月',
      y: 768
    },
    {
      x: '7月',
      y: 578
    },
    {
      x: '8月',
      y: 704
    },
    {
      x: '9月',
      y: 854
    },
    {
      x: '10月',
      y: 971
    },
    {
      x: '11月',
      y: 518
    },
    {
      x: '12月',
      y: 249
    }
  ],
  searchData: [
    {
      index: 1,
      keyword: '搜索关键词-0',
      count: 392,
      range: 12,
      status: 1
    },
    {
      index: 2,
      keyword: '搜索关键词-1',
      count: 896,
      range: 48,
      status: 1
    },
    {
      index: 3,
      keyword: '搜索关键词-2',
      count: 832,
      range: 31,
      status: 0
    },
    {
      index: 4,
      keyword: '搜索关键词-3',
      count: 590,
      range: 8,
      status: 1
    },
    {
      index: 5,
      keyword: '搜索关键词-4',
      count: 928,
      range: 29,
      status: 0
    },
    {
      index: 6,
      keyword: '搜索关键词-5',
      count: 198,
      range: 14,
      status: 1
    },
    {
      index: 7,
      keyword: '搜索关键词-6',
      count: 168,
      range: 33,
      status: 1
    },
    {
      index: 8,
      keyword: '搜索关键词-7',
      count: 877,
      range: 89,
      status: 1
    },
    {
      index: 9,
      keyword: '搜索关键词-8',
      count: 733,
      range: 58,
      status: 1
    },
    {
      index: 10,
      keyword: '搜索关键词-9',
      count: 380,
      range: 53,
      status: 1
    },
    {
      index: 11,
      keyword: '搜索关键词-10',
      count: 442,
      range: 13,
      status: 0
    },
    {
      index: 12,
      keyword: '搜索关键词-11',
      count: 677,
      range: 59,
      status: 0
    },
    {
      index: 13,
      keyword: '搜索关键词-12',
      count: 455,
      range: 25,
      status: 0
    },
    {
      index: 14,
      keyword: '搜索关键词-13',
      count: 823,
      range: 44,
      status: 0
    },
    {
      index: 15,
      keyword: '搜索关键词-14',
      count: 360,
      range: 92,
      status: 0
    },
    {
      index: 16,
      keyword: '搜索关键词-15',
      count: 579,
      range: 41,
      status: 1
    },
    {
      index: 17,
      keyword: '搜索关键词-16',
      count: 964,
      range: 29,
      status: 1
    },
    {
      index: 18,
      keyword: '搜索关键词-17',
      count: 166,
      range: 72,
      status: 1
    },
    {
      index: 19,
      keyword: '搜索关键词-18',
      count: 705,
      range: 80,
      status: 0
    },
    {
      index: 20,
      keyword: '搜索关键词-19',
      count: 939,
      range: 17,
      status: 1
    },
    {
      index: 21,
      keyword: '搜索关键词-20',
      count: 268,
      range: 28,
      status: 1
    },
    {
      index: 22,
      keyword: '搜索关键词-21',
      count: 353,
      range: 17,
      status: 1
    },
    {
      index: 23,
      keyword: '搜索关键词-22',
      count: 937,
      range: 17,
      status: 1
    },
    {
      index: 24,
      keyword: '搜索关键词-23',
      count: 931,
      range: 34,
      status: 1
    },
    {
      index: 25,
      keyword: '搜索关键词-24',
      count: 19,
      range: 72,
      status: 1
    },
    {
      index: 26,
      keyword: '搜索关键词-25',
      count: 427,
      range: 65,
      status: 1
    },
    {
      index: 27,
      keyword: '搜索关键词-26',
      count: 770,
      range: 32,
      status: 1
    },
    {
      index: 28,
      keyword: '搜索关键词-27',
      count: 929,
      range: 40,
      status: 1
    },
    {
      index: 29,
      keyword: '搜索关键词-28',
      count: 956,
      range: 18,
      status: 0
    },
    {
      index: 30,
      keyword: '搜索关键词-29',
      count: 345,
      range: 66,
      status: 1
    },
    {
      index: 31,
      keyword: '搜索关键词-30',
      count: 266,
      range: 49,
      status: 0
    },
    {
      index: 32,
      keyword: '搜索关键词-31',
      count: 486,
      range: 45,
      status: 0
    },
    {
      index: 33,
      keyword: '搜索关键词-32',
      count: 92,
      range: 56,
      status: 1
    },
    {
      index: 34,
      keyword: '搜索关键词-33',
      count: 73,
      range: 68,
      status: 1
    },
    {
      index: 35,
      keyword: '搜索关键词-34',
      count: 743,
      range: 86,
      status: 1
    },
    {
      index: 36,
      keyword: '搜索关键词-35',
      count: 104,
      range: 76,
      status: 1
    },
    {
      index: 37,
      keyword: '搜索关键词-36',
      count: 610,
      range: 97,
      status: 1
    },
    {
      index: 38,
      keyword: '搜索关键词-37',
      count: 393,
      range: 13,
      status: 1
    },
    {
      index: 39,
      keyword: '搜索关键词-38',
      count: 650,
      range: 14,
      status: 0
    },
    {
      index: 40,
      keyword: '搜索关键词-39',
      count: 896,
      range: 76,
      status: 1
    },
    {
      index: 41,
      keyword: '搜索关键词-40',
      count: 88,
      range: 0,
      status: 1
    },
    {
      index: 42,
      keyword: '搜索关键词-41',
      count: 258,
      range: 32,
      status: 1
    },
    {
      index: 43,
      keyword: '搜索关键词-42',
      count: 766,
      range: 23,
      status: 1
    },
    {
      index: 44,
      keyword: '搜索关键词-43',
      count: 754,
      range: 20,
      status: 0
    },
    {
      index: 45,
      keyword: '搜索关键词-44',
      count: 486,
      range: 89,
      status: 0
    },
    {
      index: 46,
      keyword: '搜索关键词-45',
      count: 82,
      range: 81,
      status: 1
    },
    {
      index: 47,
      keyword: '搜索关键词-46',
      count: 392,
      range: 13,
      status: 0
    },
    {
      index: 48,
      keyword: '搜索关键词-47',
      count: 215,
      range: 57,
      status: 0
    },
    {
      index: 49,
      keyword: '搜索关键词-48',
      count: 602,
      range: 87,
      status: 1
    },
    {
      index: 50,
      keyword: '搜索关键词-49',
      count: 53,
      range: 4,
      status: 0
    }
  ],
  offlineData: [
    {
      name: 'Stores 0',
      cvr: 0.1
    },
    {
      name: 'Stores 1',
      cvr: 0.5
    },
    {
      name: 'Stores 2',
      cvr: 0.6
    },
    {
      name: 'Stores 3',
      cvr: 0.9
    },
    {
      name: 'Stores 4',
      cvr: 0.9
    },
    {
      name: 'Stores 5',
      cvr: 0.7
    },
    {
      name: 'Stores 6',
      cvr: 0.1
    },
    {
      name: 'Stores 7',
      cvr: 0.3
    },
    {
      name: 'Stores 8',
      cvr: 0.5
    },
    {
      name: 'Stores 9',
      cvr: 0.4
    }
  ],
  offlineChartData: [
    {
      date: '13:26',
      type: '客流量',
      value: 101
    },
    {
      date: '13:26',
      type: '订单数',
      value: 67
    },
    {
      date: '13:56',
      type: '客流量',
      value: 47
    },
    {
      date: '13:56',
      type: '订单数',
      value: 21
    },
    {
      date: '14:26',
      type: '客流量',
      value: 12
    },
    {
      date: '14:26',
      type: '订单数',
      value: 62
    },
    {
      date: '14:56',
      type: '客流量',
      value: 36
    },
    {
      date: '14:56',
      type: '订单数',
      value: 16
    },
    {
      date: '15:26',
      type: '客流量',
      value: 63
    },
    {
      date: '15:26',
      type: '订单数',
      value: 107
    },
    {
      date: '15:56',
      type: '客流量',
      value: 93
    },
    {
      date: '15:56',
      type: '订单数',
      value: 44
    },
    {
      date: '16:26',
      type: '客流量',
      value: 23
    },
    {
      date: '16:26',
      type: '订单数',
      value: 90
    },
    {
      date: '16:56',
      type: '客流量',
      value: 92
    },
    {
      date: '16:56',
      type: '订单数',
      value: 27
    },
    {
      date: '17:26',
      type: '客流量',
      value: 80
    },
    {
      date: '17:26',
      type: '订单数',
      value: 102
    },
    {
      date: '17:56',
      type: '客流量',
      value: 75
    },
    {
      date: '17:56',
      type: '订单数',
      value: 82
    },
    {
      date: '18:26',
      type: '客流量',
      value: 106
    },
    {
      date: '18:26',
      type: '订单数',
      value: 78
    },
    {
      date: '18:56',
      type: '客流量',
      value: 42
    },
    {
      date: '18:56',
      type: '订单数',
      value: 53
    },
    {
      date: '19:26',
      type: '客流量',
      value: 22
    },
    {
      date: '19:26',
      type: '订单数',
      value: 40
    },
    {
      date: '19:56',
      type: '客流量',
      value: 41
    },
    {
      date: '19:56',
      type: '订单数',
      value: 67
    },
    {
      date: '20:26',
      type: '客流量',
      value: 49
    },
    {
      date: '20:26',
      type: '订单数',
      value: 106
    },
    {
      date: '20:56',
      type: '客流量',
      value: 66
    },
    {
      date: '20:56',
      type: '订单数',
      value: 99
    },
    {
      date: '21:26',
      type: '客流量',
      value: 109
    },
    {
      date: '21:26',
      type: '订单数',
      value: 12
    },
    {
      date: '21:56',
      type: '客流量',
      value: 50
    },
    {
      date: '21:56',
      type: '订单数',
      value: 92
    },
    {
      date: '22:26',
      type: '客流量',
      value: 81
    },
    {
      date: '22:26',
      type: '订单数',
      value: 100
    },
    {
      date: '22:56',
      type: '客流量',
      value: 29
    },
    {
      date: '22:56',
      type: '订单数',
      value: 108
    }
  ],
  salesTypeData: [
    {
      x: '家用电器',
      y: 4544
    },
    {
      x: '食用酒水',
      y: 3321
    },
    {
      x: '个护健康',
      y: 3113
    },
    {
      x: '服饰箱包',
      y: 2341
    },
    {
      x: '母婴产品',
      y: 1231
    },
    {
      x: '其他',
      y: 1231
    }
  ],
  salesTypeDataOnline: [
    {
      x: '家用电器',
      y: 244
    },
    {
      x: '食用酒水',
      y: 321
    },
    {
      x: '个护健康',
      y: 311
    },
    {
      x: '服饰箱包',
      y: 41
    },
    {
      x: '母婴产品',
      y: 121
    },
    {
      x: '其他',
      y: 111
    }
  ],
  salesTypeDataOffline: [
    {
      x: '家用电器',
      y: 99
    },
    {
      x: '食用酒水',
      y: 188
    },
    {
      x: '个护健康',
      y: 344
    },
    {
      x: '服饰箱包',
      y: 255
    },
    {
      x: '其他',
      y: 65
    }
  ],
  radarData: [
    {
      name: '个人',
      label: '引用',
      value: 10
    },
    {
      name: '个人',
      label: '口碑',
      value: 8
    },
    {
      name: '个人',
      label: '产量',
      value: 4
    },
    {
      name: '个人',
      label: '贡献',
      value: 5
    },
    {
      name: '个人',
      label: '热度',
      value: 7
    },
    {
      name: '团队',
      label: '引用',
      value: 3
    },
    {
      name: '团队',
      label: '口碑',
      value: 9
    },
    {
      name: '团队',
      label: '产量',
      value: 6
    },
    {
      name: '团队',
      label: '贡献',
      value: 3
    },
    {
      name: '团队',
      label: '热度',
      value: 1
    },
    {
      name: '部门',
      label: '引用',
      value: 4
    },
    {
      name: '部门',
      label: '口碑',
      value: 1
    },
    {
      name: '部门',
      label: '产量',
      value: 6
    },
    {
      name: '部门',
      label: '贡献',
      value: 5
    },
    {
      name: '部门',
      label: '热度',
      value: 7
    }
  ]
}

export default [
  {
    url: '/api/dashboard/chartdata',
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(chartData)
    }
  }
] as MockMethod[]
