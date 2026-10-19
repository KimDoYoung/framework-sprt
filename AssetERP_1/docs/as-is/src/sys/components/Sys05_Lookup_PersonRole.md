# Sys05_Lookup_PersonRole

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/sys/Sys05_Lookup_PersonRole.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.selectByUserId` | Sys05_Lookup_PersonRole:71 | [`Sys04_Role.java:40`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByUserId`](../../sys/sql/sys04_role.md) |

## 테이블

[`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys05_Lookup_PersonRole (`client/vi/sys/Sys05_Lookup_PersonRole.java`, 77줄)

- 그리드 `grid` (buildRoleGrid(), 체크박스):
  - roleName 200 "권한명" Text
  - userRoleYn 40 "권한" BooleanHtml
  - seq 80 "순서" Text
  - note 450 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-52) → show()
[E1] closeButton[닫기].Select (L34) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L27-31 | 공개 메서드 | 상태 처리 | 업무 |
| public buildRoleGrid() | L54-65 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L67-72 | open | 서비스 sys.Sys04_Role.selectByUserId(userId, companyId) | 업무 |
| private settings() | L33-40 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L74-76 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildRoleGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L59
  // ⚠ 대응 없음 (GridBuilder L60) addBooleanHtml
  gb.text('seq', 80, '순서'),  // L61
  gb.text('note', 450, '비고'),  // L62
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

