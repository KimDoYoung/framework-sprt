/**
 * Asset-ERP 단일 통합 JSON LocalStorage 관리 라이브러리
 * - 모든 화면 및 사용자 설정은 'asseterp_settings' 단일 키에 1개의 JSON 객체로 저장됩니다.
 * - 개별 설정 항목(menu23_font_size, flexlayout_model 등)을 일관되게 관리합니다.
 */

export const SETTINGS_STORAGE_KEY = 'asseterp_settings';

export interface AppSettings {
  menu23_font_size: number;
  flexlayout_model?: any;
  [key: string]: any;
}

export const defaultAppSettings: AppSettings = {
  menu23_font_size: 0,
};

/**
 * 기존 레거시 키(asseterp_flexlayout_model, asseterp_font_size_offset) 자동 마이그레이션 및 정리
 */
function migrateLegacySettings(settings: Partial<AppSettings>): AppSettings {
  let migrated = false;
  const merged: AppSettings = { ...defaultAppSettings, ...settings };

  if (typeof window !== 'undefined') {
    // 1. 구 폰트 크기 키 이전
    const oldFont = localStorage.getItem('asseterp_font_size_offset');
    if (oldFont !== null) {
      try {
        merged.menu23_font_size = JSON.parse(oldFont);
        migrated = true;
      } catch (e) {
        // ignore
      }
      localStorage.removeItem('asseterp_font_size_offset');
    }

    // 2. 구 FlexLayout 모델 키 이전
    const oldLayout = localStorage.getItem('asseterp_flexlayout_model');
    if (oldLayout !== null) {
      try {
        merged.flexlayout_model = JSON.parse(oldLayout);
        migrated = true;
      } catch (e) {
        // ignore
      }
      localStorage.removeItem('asseterp_flexlayout_model');
    }

    if (migrated) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error('[appSettingsStorage] 마이그레이션 저장 실패:', e);
      }
    }
  }

  return merged;
}

export const appSettingsStorage = {
  /**
   * 전체 설정 객체를 조회합니다.
   */
  getAll(): AppSettings {
    if (typeof window === 'undefined') {
      return defaultAppSettings;
    }
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return migrateLegacySettings(parsed);
    } catch (e) {
      console.warn('[appSettingsStorage] 설정 파싱 실패, 기본값 사용:', e);
      return defaultAppSettings;
    }
  },

  /**
   * 특정 설정 속성을 조회합니다.
   */
  get<K extends keyof AppSettings>(key: K, defaultValue?: AppSettings[K]): AppSettings[K] {
    const all = this.getAll();
    if (key in all && all[key] !== undefined) {
      return all[key];
    }
    return defaultValue !== undefined ? defaultValue : defaultAppSettings[key];
  },

  /**
   * 특정 설정 속성을 업데이트하여 'asseterp_settings'에 저장합니다.
   */
  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    if (typeof window === 'undefined') return;
    try {
      const all = this.getAll();
      all[key] = value;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error(`[appSettingsStorage] '${String(key)}' 저장 실패:`, e);
    }
  },

  /**
   * 여러 설정 속성을 일괄 업데이트합니다.
   */
  setMultiple(partial: Partial<AppSettings>): void {
    if (typeof window === 'undefined') return;
    try {
      const all = this.getAll();
      const updated = { ...all, ...partial };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[appSettingsStorage] 일괄 저장 실패:', e);
    }
  },

  /**
   * 특정 속성을 삭제합니다.
   */
  remove(key: keyof AppSettings): void {
    if (typeof window === 'undefined') return;
    try {
      const all = this.getAll();
      delete all[key];
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error(`[appSettingsStorage] '${String(key)}' 삭제 실패:`, e);
    }
  },

  /**
   * 전체 설정을 초기화합니다.
   */
  reset(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultAppSettings));
    } catch (e) {
      console.error('[appSettingsStorage] 초기화 실패:', e);
    }
  },
};

/**
 * 범용 로컬 스토리지 헬퍼 (독립 키 저장용)
 */
export const appStorage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(`asseterp_${key}`);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(`asseterp_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`asseterp_${key}`);
    } catch {}
  },
};
