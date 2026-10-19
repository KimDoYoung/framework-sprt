# Pay06_Lookup_LinkContent

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/pay/Pay06_Lookup_LinkContent.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay06_ActMapping.selectByLinkCode` | Pay06_Lookup_LinkContent:96 | [`Pay06_ActMapping.java:51`](../../pay/services/Pay06_ActMapping.md) | [`pay06_act_mapping.selectByLinkCode`](../../pay/sql/pay06_act_mapping.md) |

## 테이블

[`pay06_act_mapping`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay06_Lookup_LinkContent (`client/vi/pay/Pay06_Lookup_LinkContent.java`, 108줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - title 400 "제목" Text
  - note 400 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-69) → show()
[E1] confirmButton[확인].Select (L50) → confirm()
[E2] closeButton[닫기].Select (L56) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L35-40 | 공개 메서드 | 상태 처리 | 업무 |
| private confirm() | L81-89 | E1 | 상태 처리 | 업무 |
| public retrieve() | L91-103 | open | 서비스 pay.Pay06_ActMapping.selectByLinkCode(companyId, kindCode, linkCode) | 업무 |
| public buildGrid() | L71-79 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 400, '제목'),  // L75
  gb.text('note', 400, '비고'),  // L76
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

