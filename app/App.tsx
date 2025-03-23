import './styles/app.css'
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import ResultsPanel from './components/ResultsPanel';
import ChatPage from './components/ChatPage';
import SettingsView from './settings/SettingsView';
import { ExtensionStateContextProvider } from "./context/ExtensionStateContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import TranslationProvider from "./i18n/TranslationContext"

function App() {
  const [activeView, setActiveView] = useState(null); // 'settings' or 'results'
  const [activeTool, setActiveTool] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'chat', 'settings'
  
  const handleToolAction = (toolId, action) => {
    setActiveTool(toolId);
    setActiveView(action); // action 是 'settings' 或 'results'
    setCurrentPage('home');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 切换页面时清除工具状态
    if (page !== 'home') {
      setActiveView(null);
      setActiveTool(null);
    }
  };

  const queryClient = new QueryClient()

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header onPageChange={handlePageChange} currentPage={currentPage} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 - 只在首页显示 */}
        {currentPage === 'home' && <Sidebar onToolAction={handleToolAction} />}
        
        {/* 右侧内容区 */}
        <main className="flex-1 overflow-auto p-6">
          {/* 首页内容 */}
          {currentPage === 'home' && (
            <>
              {activeView === 'settings' && activeTool && (
                <SettingsPanel toolId={activeTool} />
              )}
              
              {activeView === 'results' && activeTool && (
                <ResultsPanel toolId={activeTool} />
              )}
              
              {!activeView && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium">选择一个工具开始</h3>
                    <p className="mt-1">从左侧选择一个MCP工具，或者创建一个新的工具</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 聊天页面 */}
          {currentPage === 'chat' && <ChatPage />}
          <ExtensionStateContextProvider>
            <TranslationProvider>
                <QueryClientProvider client={queryClient}>
                    {/* 设置页面 */}
                    {currentPage === 'settings' && <SettingsView onDone={() => handlePageChange('home')} />}
                </QueryClientProvider>
            </TranslationProvider>
          </ExtensionStateContextProvider>
        </main>
      </div>
    </div>
  );
}

export default App;