# layout-preset 설계

## 개요

- 사용자가 화면의 배치를 이름을 주어 저장한다.

## 설계
- Topbar에 버튼을 둔다.
```
<button type="button" tabindex="0" data-base-ui-click-trigger="" id="base-ui-_r_2_" data-slot="popover-trigger" title="화면 배치 (F9)" class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors data-[popup-open]:text-blue-600 data-[popup-open]:bg-blue-50" aria-haspopup="dialog" aria-expanded="false"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-template" aria-hidden="true"><rect width="18" height="7" x="3" y="3" rx="1"></rect><rect width="9" height="7" x="3" y="14" rx="1"></rect><rect width="5" height="7" x="16" y="14" rx="1"></rect></svg></button>



<div title="화면 레이아웃 저장 및 불러오기" class="ant-dropdown-trigger" style="cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 14px; background-color: rgba(255, 255, 255, 0.16); font-size: 12px; font-weight: 500; user-select: none; border: 1px solid rgba(255, 255, 255, 0.3); color: rgb(255, 255, 255); transition: 0.15s;"><span role="img" aria-label="appstore" class="anticon anticon-appstore" style="font-size: 13px;"><svg viewBox="64 64 896 896" focusable="false" data-icon="appstore" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg></span><span>화면 레이아웃</span><span role="img" aria-label="down" class="anticon anticon-down" style="font-size: 9px; opacity: 0.8;"><svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg></span></div>

```
- 버튼 클릭시 LayoutPreset panel이 나타난다.
- 이미 저장된 목록이 나오고
- 화살키를 클릭해서 선택, 번호를 입력 선택가능하다.
- 저장 버튼으로 현재의 화면 layout을 저장가능하다.
- 이름이 같은 경우 이를 확인받고 overwrite한다.
- preset의 갯수는 10개로 제한한다


# table 설계


- preset_layout JSONB -- jsonb 타입 컬럼 으로 저장

```sql
CREATE TABLE IF NOT EXISTS sys70_user_settings (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      INTEGER NOT NULL,
    setting_key  TEXT NOT NULL,                       -- 예: 'layout_presets', 'ui_theme', 'notifications'
    value        JSONB NOT NULL DEFAULT '{}'::jsonb,  -- 해당 설정의 JSON 데이터
    created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_settings_key UNIQUE (user_id, setting_key)
);
```