import React from 'react'
import './index.css'
import logo from './assets/logo.png'

function App() {
  const stocks = [
    { name: '삼성전자', value: '77,500원', change: '0.64%', direction: 'down', logo: 'S' },
    { name: 'SK하이닉스', value: '194,000원', change: '1.36%', direction: 'up', logo: 'SK' },
    { name: '테슬라', value: '181.06달러', change: '2.57%', direction: 'up', logo: 'T' },
    { name: '엔비디아', value: '1,037.89달러', change: '1.12%', direction: 'down', logo: 'N' },
    { name: '애플', value: '192.58달러', change: '0.53%', direction: 'down', logo: 'A' },
  ]

  const features = [
    { title: '실시간 트렌드', description: '1시간 단위 트렌드 분석', icon: '↗' },
    { title: '핫한 종목 발견', description: '상승 트렌드를 빠르게 포착', icon: '💧' },
    { title: '맞춤 알림', description: '관심 종목 알림 받기', icon: '🔔' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-12">
      <div className="mx-auto grid w-full max-w-[1380px] gap-10 px-4 lg:grid-cols-[1.65fr_1fr] lg:px-0">
        
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 shadow-[0_1px_3px_0_rgb(0,0,0,0.08)]">
            
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 shadow-sm shadow-slate-200/50">
                  <img src={logo} alt="EOA logo" className="h-9 w-9 object-contain" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400 leading-none">EOA(EARS OF ANTS)</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">실시간 · 트렌드 · 인사이트</p>
                </div>
              </div>

              <div className="space-y-7">
                <h1 className="text-5xl font-bold tracking-tight text-slate-950 leading-[1.15] md:text-6xl md:leading-[1.1]">
                  실시간 트윗 기반
                  <br /> 주식 트렌드 분석
                </h1>
                <p className="max-w-[42rem] text-base leading-7 text-slate-600">
                  X에서 이야기되는 종목을 실시간으로 분석하고 트렌드 변화를 한눈에 확인하세요.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/30">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">관심 주식</h2>
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm shadow-slate-200/60 hover:bg-slate-100 transition">
                  관심 종목 관리
                </button>
              </div>
              <div className="space-y-4">
                {stocks.map((stock) => (
                  <div key={stock.name} className="flex items-center justify-between rounded-[1.75rem] bg-white px-5 py-5 shadow-sm shadow-slate-200/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-lg font-bold text-slate-700">
                        {stock.logo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{stock.name}</p>
                        <p className="text-sm text-slate-400">{stock.value}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${stock.direction === 'up' ? 'text-red-500' : 'text-sky-600'}`}>
                      {stock.direction === 'up' ? '▲ ' : '▼ '}{stock.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm shadow-slate-200/40">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-50 text-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>

          </div>

          <footer className="rounded-[2rem] border border-slate-200 bg-slate-950 px-12 py-12 text-slate-400 shadow-sm shadow-slate-200/10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">EOA(EARS OF ANTS)</p>
                <p className="mt-4 text-sm leading-6 text-slate-500">© 2026 EOA. All rights reserved.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-3 text-sm">
                <a href="#" className="transition hover:text-white hover:opacity-80">서비스 소개</a>
                <a href="#" className="transition hover:text-white hover:opacity-80">개인정보처리방침</a>
                <a href="#" className="transition hover:text-white hover:opacity-80">고객지원</a>
              </div>
            </div>
          </footer>
        </div>

        <aside className="flex items-start lg:sticky lg:top-10">
          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-12 shadow-lg shadow-slate-300/15">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-950 leading-tight">로그인</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                계정에 로그인하고 관심 주식과 실시간 트렌드를 확인하세요.
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-800">이메일 또는 아이디</label>
                <input
                  type="text"
                  placeholder="이메일 또는 아이디를 입력하세요"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 text-sm outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-800">비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 text-sm outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              <div className="flex items-center justify-between pt-2 text-sm text-slate-600">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                  <span className="text-slate-700">로그인 상태 유지</span>
                </label>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition">비밀번호 찾기</a>
              </div>

              <button className="w-full rounded-2xl bg-blue-600 px-6 py-3.5 mt-8 text-base font-semibold text-white shadow-lg shadow-blue-200/30 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/40 active:scale-[0.98]">
                로그인
              </button>
            </form>

            <div className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
              아직 회원이 아니신가요?
              <a href="#" className="ml-2 font-medium text-blue-600 hover:text-blue-700 transition">회원가입</a>
            </div>
          </div>
        </aside>

      </div> 
    </div>
  )
}

export default App;
