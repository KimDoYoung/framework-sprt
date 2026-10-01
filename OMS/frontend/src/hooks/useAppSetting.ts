import { useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  appSettingsStorage,
  SETTINGS_STORAGE_KEY,
} from '../utils/storage';

/**
 * 'asseterp_settings' 단일 JSON 객체 내부의 특정 설정 속성을 다루는 React Hook
 * - 일반 useState와 완전히 동일한 [value, setValue] 인터페이스 제공
 * - 컴포넌트 마운트 시 asseterp_settings JSON에서 해당 속성 로드
 * - 값 변경 시 asseterp_settings 내부의 해당 속성만 갱신하여 1개의 JSON으로 저장
 * - 다른 탭에서의 변경 사항을 감지하는 브라우저 storage 이벤트 리스너 지원
 */
export function useAppSetting<K extends keyof AppSettings>(
  key: K,
  defaultValue?: AppSettings[K]
): [AppSettings[K], (value: AppSettings[K] | ((prev: AppSettings[K]) => AppSettings[K])) => void] {
  const [storedValue, setStoredValue] = useState<AppSettings[K]>(() => {
    return appSettingsStorage.get(key, defaultValue);
  });

  const setValue = useCallback(
    (value: AppSettings[K] | ((prev: AppSettings[K]) => AppSettings[K])) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        appSettingsStorage.set(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue) as AppSettings;
          if (key in parsed) {
            setStoredValue(parsed[key]);
          }
        } catch (err) {
          console.warn(`[useAppSetting] 외부 변경 파싱 실패 (${String(key)}):`, err);
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
