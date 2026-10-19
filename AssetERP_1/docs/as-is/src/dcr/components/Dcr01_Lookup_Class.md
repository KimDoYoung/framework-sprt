# Dcr01_Lookup_Class

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `biz`, `bmt`, `com`, `emp`, `est`, `flt`, `fnd`, `ics`, `pay`, `sch`, `sys`, `tdm`
- 파일: `client/vi/dcr/Dcr01_Lookup_Class.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectById` | Dcr01_Lookup_Class:54 | [`Dcr01_ClassTree.java:27`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Lookup_Class (`client/vi/dcr/Dcr01_Lookup_Class.java`, 120줄)

- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="선택해주세요"

#### 이벤트
[E0] 화면 열림 (생성자 L71-105) → show()
[E1] classTreeFullName.TriggerClick (L39) → 인라인 L39-51 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[확인].Select (L79) → update()
[E3] cancleButton[닫기].Select (L85) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-69 | 공개 메서드 | 서비스 dcr.Dcr01_ClassTree.selectById | 업무 |
| private update() | L107-114 | E2 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L116-118 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

