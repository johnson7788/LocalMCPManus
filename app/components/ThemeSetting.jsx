import React, { createContext, useState, useContext, useEffect } from 'react';

// 定义主题对象
const themes = {
  light: {
    background: '#f0f0f0',
    color: '#333',
    fontFamily: 'sans-serif',
  },
  dark: {
    background: '#333',
    color: '#f0f0f0',
    fontFamily: 'monospace',
  },
  blue: {
    background: '#e0f7fa',
    color: '#004d40',
    fontFamily: 'serif',
  },
};

// 创建 Theme Context
const ThemeContext = createContext();

// 创建 Theme Provider 组件
export const ThemeProvider = ({ children }) => {
  // 从 localStorage 中读取上次选择的主题，如果没有则使用默认主题
  const [themeName, setThemeName] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light';
  });

  // 根据主题名称获取当前主题对象
  const theme = themes[themeName];

  // 切换主题的函数
  const toggleTheme = (newThemeName) => {
    setThemeName(newThemeName);
    localStorage.setItem('theme', newThemeName); // 将主题保存到 localStorage
  };

  // 将主题和切换主题的方法通过 Context Provider 传递给子组件
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 创建一个自定义 Hook 来方便使用 Theme Context
export const useTheme = () => useContext(ThemeContext);


// 切换主题的组件
export function ThemeSwitcher() {
  const { toggleTheme, themeName } = useTheme();

  return (
    <div>
      <h2>切换主题</h2>
      <select value={themeName} onChange={(e) => toggleTheme(e.target.value)}>
        {Object.keys(themes).map((name) => (
          <option key={name} value={name}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}