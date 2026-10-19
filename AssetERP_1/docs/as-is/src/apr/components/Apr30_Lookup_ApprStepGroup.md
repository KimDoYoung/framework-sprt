# Apr30_Lookup_ApprStepGroup

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr30_Lookup_ApprStepGroup.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr30_ApprStepGroup.selectByCompanyId` | Apr30_Lookup_ApprStepGroup:117 | [`Apr30_ApprStepGroup.java:21`](../../apr/services/Apr30_ApprStepGroup.md) | [`apr30_appr_step_group.selectByCompanyId`](../../apr/sql/apr30_appr_step_group.md) |

## 테이블

[`apr30_appr_step_group`](../../../db/tables/apr.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr30_Lookup_ApprStepGroup (`client/vi/apr/Apr30_Lookup_ApprStepGroup.java`, 145줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid()):
  - apprStepGroupName 250 "문서결재선 그룹명" Text
  - note 350 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-71) → settings(), show(), retrieve()
[E1] retrieveButton[조회].Select (L74) → retrieve()
[E2] oKButton[확인].Select (L80) → confirm()
[E3] noneButton[선택안함].Select (L86) → confirm()
[E4] hideButton[취소].Select (L92) → hide()
[E5] grid.CellDoubleClick (L98) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-45 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L114-123 | 생성자,E1 | 서비스 apr.Apr30_ApprStepGroup.selectByCompanyId(companyId) | 업무 |
| public confirm() | L125-140 | E2,E3,E5 | 미선택 시 alert "선택된 지정그룹이 없습니다" | 업무 |
| private settings() | L73-104 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L106-112 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L142-144 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('apprStepGroupNm', 250, '문서결재선 그룹명'),  // L109
  gb.text('note', 350, '비고'),  // L110
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={confirm}>선택안함</Button>
4. <Button type="cancel" onClick={hide}>취소</Button>

