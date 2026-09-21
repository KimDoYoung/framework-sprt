import { useState, useEffect, useCallback } from 'react';
import { appStorage } from '../utils/storage';

/**
 * localStorage와 연동되는 React State Hook
 * - 일반 useState와 완전히 동일한 [value, setValue] 인터페이스 제공
 * - 컴포넌트 마운트 시 localStorage에서 복원
 * - 값 변경 시 localStorage에 자동 JSON 직렬화 저장
 * - 다른 창/탭에서의 변경 사항을 감지하는 브라우저 storage 이벤트 리스너 지원
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // 초기 상태 로드 (localStorage에 없으면 initialValue 사용)
  const [storedValue, setStoredValue] = useState<T>(() => {
    return appStorage.get<T>(key, initialValue);
  });

  // 상태 업데이트 및 localStorage 동기화
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        appStorage.set<T>(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  // 다른 탭/창에서 동일한 키가 변경되었을 때 상태 동기화
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const fullKey = `asseterp_${key}`;
      if (e.key === fullKey && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue) as T;
          setStoredValue(parsed);
        } catch (err) {
          console.warn(`[useLocalStorage] 외부 변경 이벤트 파싱 실패 (${key}):`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
