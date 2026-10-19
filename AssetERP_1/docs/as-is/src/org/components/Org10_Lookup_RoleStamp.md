# Org10_Lookup_RoleStamp

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/org/Org10_Lookup_RoleStamp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `org.Org10_RoleStamp.delete` | Org10_Lookup_RoleStamp:180 | [`Org10_RoleStamp.java:61`](../../org/services/Org10_RoleStamp.md) | `UpdateDataModel(org10_role_stamp)` 동적 DELETE |
| `org.Org10_RoleStamp.selectByStampId` | Org10_Lookup_RoleStamp:209 | [`Org10_RoleStamp.java:23`](../../org/services/Org10_RoleStamp.md) | [`org10_role_stamp.selectByStampId`](../../org/sql/org10_role_stamp.md) |
| `org.Org10_RoleStamp.update` | Org10_Lookup_RoleStamp:189 | [`Org10_RoleStamp.java:56`](../../org/services/Org10_RoleStamp.md) | `UpdateDataModel(org10_role_stamp)` 동적 INSERT/UPDATE → [`org10_role_stamp.selectById`](../../org/sql/org10_role_stamp.md) |

## 테이블

[`org10_role_stamp`](../../../db/tables/org.md)

## DB 함수

`f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org10_Lookup_RoleStamp (`client/vi/org/Org10_Lookup_RoleStamp.java`, 215줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `orgSearch` Org00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - orgName 350 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-103) → settings(), show()
[E1] anchor.MouseDown (L76) → retrieve()
[E2] insertButton[행 추가].Select (L106) → insertRow()
[E3] deleteButton[행 삭제].Select (L112) → deleteRow()
[E4] updateButton[저장].Select (L118) → update()
[E5] closeButton[닫기].Select (L135) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-63 | 공개 메서드 | 상태 처리 | 업무 |
| private grid() | L143-149 | 필드 초기화 | 상태 처리 | 업무 |
| private insertRow() | L151-175 | E2 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private update() | L177-195 | E4 | GridDeleteData org.Org10_RoleStamp.delete, org.Org10_RoleStamp.update | 업무 |
| private deleteRow() | L197-203 | E3 | 상태 처리 | 업무 |
| private retrieve() | L205-210 | E1,open | 서비스 org.Org10_RoleStamp.selectByStampId(stampId) | 업무 |
| private settings() | L105-141 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L212-214 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.text('orgName', 350, '부서'),  // L146 SQL 계산 컬럼(selectByStampId: f_org_nm(org10_org_code_id, f_sysdate()))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

