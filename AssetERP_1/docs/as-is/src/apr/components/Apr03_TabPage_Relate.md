# Apr03_TabPage_Relate

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr03_TabPage_Relate.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr03_RelateFund.selectByApprId` | Apr03_TabPage_Relate:65 | [`Apr03_RelateFund.java:22`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.selectByApprId`](../../apr/sql/apr03_relate_fund.md) |
| `apr.Apr12_RelateAdv.selectByApprId` | Apr03_TabPage_Relate:78 | [`Apr12_RelateAdv.java:17`](../../apr/services/Apr12_RelateAdv.md) | [`apr12_relate_adv.selectByApprId`](../../apr/sql/apr12_relate_adv.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr03_TabPage_Relate (`client/vi/apr/Apr03_TabPage_Relate.java`, 85줄)

- 그리드 `grid01` (buildGrid01(), 행번호숨김):
  - fundName 290 "연관펀드" Text
- 그리드 `grid02` (buildGrid02(), 행번호숨김):
  - manageName 290 "연관일임" Text

#### 이벤트
[E0] 화면 열림 (생성자 L22-30) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid01() | L32-40 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid02() | L42-50 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L52-58 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve01() | L60-71 | retrieve | 서비스 apr.Apr03_RelateFund.selectByApprId(apprId) | 업무 |
| private retrieve02() | L73-84 | retrieve | 서비스 apr.Apr12_RelateAdv.selectByApprId(apprId) | 업무 |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('fundNm', 290, '연관펀드'),  // L37
];

const buildGrid02 = () => [
  gb.text('manageNm', 290, '연관일임'),  // L47
];
```

#### 사용된 버튼들
버튼 사용하지 않음

