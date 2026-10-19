# MyTabItemConfig

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/MyTabItemConfig.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys06_Menu.getMenuModel` | MyTabItemConfig:19 | [`Sys06_Menu.java:304`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.getMenuModel`](../../sys/sql/sys06_menu.md) |

## 테이블

[`sys06_menu`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### MyTabItemConfig (`client/vi/MyTabItemConfig.java`, 35줄)


#### 이벤트
[E0] 화면 열림 (생성자 L14-16) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public loadMenuInfo() | L18-34 | 공개 메서드 | 서비스 sys.Sys06_Menu.getMenuModel(menuNo) | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

